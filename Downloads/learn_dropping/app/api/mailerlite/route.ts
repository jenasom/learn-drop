import { type NextRequest, NextResponse } from "next/server"

// MailerLite API helper
const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY
const MAILERLITE_API_BASE = "https://api.mailerlite.com/api/v1"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    if (!MAILERLITE_API_KEY) {
      return NextResponse.json({ error: "MailerLite API key not configured" }, { status: 500 })
    }

    if (action === "create-group") {
      // Create a new group (newsletter list)
      const response = await fetch(`${MAILERLITE_API_BASE}/groups`, {
        method: "POST",
        headers: {
          "X-MailerLite-ApiDomain": "api.mailerlite.com",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          language: data.language || "en",
        }),
      })

      const result = await response.json()
      return NextResponse.json(result)
    }

    if (action === "subscribe") {
      // Add subscriber to group
      const response = await fetch(`${MAILERLITE_API_BASE}/groups/${data.groupId}/subscribers`, {
        method: "POST",
        headers: {
          "X-MailerLite-ApiDomain": "api.mailerlite.com",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          name: data.name,
          fields: data.fields || {},
        }),
      })

      const result = await response.json()
      return NextResponse.json(result)
    }

    if (action === "send-campaign") {
      // Send campaign to group
      const response = await fetch(`${MAILERLITE_API_BASE}/campaigns`, {
        method: "POST",
        headers: {
          "X-MailerLite-ApiDomain": "api.mailerlite.com",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: data.subject,
          groups: [data.groupId],
          html: data.html,
          type: "regular",
        }),
      })

      const result = await response.json()
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
