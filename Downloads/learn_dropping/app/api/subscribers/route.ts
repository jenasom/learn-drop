import { type NextRequest, NextResponse } from "next/server"
import { sendWelcomeEmail } from "../../../lib/mailer"
import fs from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
  const { newsletterId, email, name, profession } = body

    // Require at least an email. newsletterId may be omitted for generic subscriptions
    if (!email) {
      return NextResponse.json({ error: "Missing required field: email" }, { status: 400 })
    }

    // TODO: Add subscriber to database and sync with MailerLite
    // If MailerLite is configured, we'll let MailerLite handle double-opt-in confirmation
    const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY

    // Generate a local confirmation token only when MailerLite is NOT configured
    let confirmToken: string | null = null
    if (!MAILERLITE_API_KEY) {
      confirmToken = require('crypto').randomBytes(20).toString('hex')
    }

    const subscriber: any = {
      id: Date.now().toString(),
      newsletter_id: newsletterId,
      email,
      name,
      profession,
      subscribed_at: new Date().toISOString(),
      status: MAILERLITE_API_KEY ? 'unconfirmed' : 'unconfirmed',
    }
    if (confirmToken) subscriber.confirmToken = confirmToken

    // Persist subscriber locally so we can send newsletters without MailerLite
    try {
      const file = path.join(process.cwd(), "data", "subscribers.json")
      let existing: any[] = []
      try {
        const raw = await fs.promises.readFile(file, { encoding: "utf8" })
        existing = JSON.parse(raw || "[]")
      } catch (e) {
        existing = []
      }

      // Only add if email not already present
      if (!existing.find((s) => s.email === email)) {
        existing.push({ ...subscriber })
        await fs.promises.writeFile(file, JSON.stringify(existing, null, 2), { encoding: "utf8" })
        console.log("Saved subscriber locally:", email)
      } else {
        console.log("Subscriber already exists locally:", email)
      }
    } catch (e) {
      console.error("Failed to persist subscriber locally:", e)
    }

  // Call MailerLite API to add subscriber (best-effort). If newsletterId is missing
    // we still send the email/name but omit the groupId so MailerLite will add it
    // to a default group (depending on your MailerLite setup).
    // Prefer calling MailerLite external API directly from the server route
    // when an API key is configured. This avoids routing via the internal
    // /api/mailerlite proxy and is recommended for production.
    
    const MAILERLITE_API_BASE = "https://connect.mailerlite.com/api"
    const DEFAULT_MAILERLITE_GROUP_ID = process.env.DEFAULT_MAILERLITE_GROUP_ID

    // Use the provided newsletterId, falling back to DEFAULT_MAILERLITE_GROUP_ID
    const groupId = newsletterId || DEFAULT_MAILERLITE_GROUP_ID

    if (MAILERLITE_API_KEY) {
      try {
        // Build payload for MailerLite Connect API. If a group id is available, include it.
        const payload: any = { email, fields: {} }
        if (name) payload.fields.name = name
        if (profession) payload.fields.profession = profession
        if (groupId) payload.groups = [groupId]

        const res = await fetch(`${MAILERLITE_API_BASE}/subscribers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${MAILERLITE_API_KEY}`,
          },
          body: JSON.stringify(payload),
        })

        let bodyText = await res.text().catch(() => "<no-body>")
        if (!res.ok) {
          // If the failure is caused by an invalid group id, retry without groups
          console.error(`MailerLite sync failed -> status=${res.status} body=${bodyText}`)
          try {
            const parsed = JSON.parse(bodyText || "{}")
            const groupsError = parsed?.errors && (parsed.errors["groups.0"] || parsed.errors.groups?.[0])
            if (res.status === 422 && groupsError) {
              console.warn("MailerLite group id appears invalid; retrying subscriber creation without groups")
              // Retry without groups
              const retryPayload = { email, fields: {} as any }
              if (name) retryPayload.fields.name = name
              if (profession) retryPayload.fields.profession = profession

              const retryRes = await fetch(`${MAILERLITE_API_BASE}/subscribers`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${MAILERLITE_API_KEY}`,
                },
                body: JSON.stringify(retryPayload),
              })
              const retryBody = await retryRes.text().catch(() => "<no-body>")
              if (!retryRes.ok) {
                console.error(`MailerLite retry failed -> status=${retryRes.status} body=${retryBody}`)
              } else {
                console.log(`MailerLite retry OK -> status=${retryRes.status} body=${retryBody}`)
              }
            }
          } catch (e) {
            // ignore JSON parsing errors and proceed
          }
        } else {
          console.log(`MailerLite sync OK -> status=${res.status} body=${bodyText}`)
        }
        // When MailerLite is configured we do not send a local confirmation link. MailerLite will send its own confirmation email.
      } catch (err) {
        console.error("MailerLite external sync failed:", err)
      }
    } else {
      if (!MAILERLITE_API_KEY) console.warn("MailerLite API key not configured; skipping sync")
    }

    // Use MailerLite to send confirmation/welcome when configured; otherwise send via local SMTP
    if (!MAILERLITE_API_KEY) {
      try {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
        const confirmUrl = confirmToken ? `${appUrl.replace(/\/$/, '')}/api/subscribers/confirm?token=${confirmToken}` : undefined
        const mailResult = await sendWelcomeEmail(email, name, profession, confirmUrl)
        if (!mailResult.success) {
          console.warn("Welcome email could not be delivered:", mailResult.message)
        }
      } catch (err) {
        console.error("Unexpected error sending welcome email:", err)
      }
    } else {
      // MailerLite will handle double-opt-in confirmation and confirmation email delivery.
      console.log('MailerLite configured; skipping local welcome email. MailerLite will send confirmation.')
    }

    return NextResponse.json({ subscriber })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const newsletterId = searchParams.get("newsletter_id")
    // If MailerLite API key is configured, forward the request to MailerLite
    const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY
    const MAILERLITE_API_BASE = "https://connect.mailerlite.com/api"

    // Read local subscribers file
    const file = path.join(process.cwd(), "data", "subscribers.json")
    const raw = await fs.promises.readFile(file, { encoding: "utf8" }).catch(() => "[]")
    const local = JSON.parse(raw || "[]")

    if (MAILERLITE_API_KEY) {
      try {
        // MailerLite Connect API: fetch subscribers (first page). You can paginate later.
        const limit = 250
        const url = `${MAILERLITE_API_BASE}/subscribers?limit=${limit}`
        const res = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${MAILERLITE_API_KEY}`,
            "Content-Type": "application/json",
          },
        })

        if (!res.ok) {
          const bodyText = await res.text()
          console.error("MailerLite list subscribers failed:", res.status, bodyText)
          // Return just local subscribers as a fallback
          return NextResponse.json({ subscribers: local || [], count: (local || []).length })
        }

        const mlData = await res.json()
        const mlList = Array.isArray(mlData) ? mlData : mlData.data || []

        // Merge MailerLite data with local, preferring local fields when duplicates
        const combinedMap: Record<string, any> = {}
        ;(mlList || []).forEach((s: any) => {
          const email = s.email || (s.data && s.data.email)
          if (email) combinedMap[email.toLowerCase()] = { email, name: s.name || (s.fields && s.fields.name) || "", status: s.status || "", created_at: s.created_at || (s.data && s.data.created_at) || "" }
        })
        ;(local || []).forEach((s: any) => {
          if (s.email) combinedMap[s.email.toLowerCase()] = { email: s.email, name: s.name || "", status: s.status || "active", created_at: s.subscribed_at || s.createdAt || "" }
        })

        const subscribers = Object.values(combinedMap)
        return NextResponse.json({ subscribers, count: subscribers.length })
      } catch (err) {
        console.error("Error fetching MailerLite subscribers:", err)
        return NextResponse.json({ subscribers: local || [], count: (local || []).length })
      }
    }

    // If MailerLite not configured, return local subscribers
    return NextResponse.json({ subscribers: local || [], count: (local || []).length })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
