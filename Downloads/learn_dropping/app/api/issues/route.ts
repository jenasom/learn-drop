import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { sendNewsletter } from "../../../lib/mailer"

const issues: any[] = []

function simpleMarkdownToHtml(md: string) {
  if (!md) return ""
  // Escape basic HTML
  const escaped = md.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  // Convert headings
  const withHeadings = escaped.replace(/^# (.*$)/gim, "<h1>$1</h1>").replace(/^## (.*$)/gim, "<h2>$1</h2>")
  // Convert bold/italic
  .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>").replace(/\*(.*?)\*/gim, "<em>$1</em>")
  // Convert links
  .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
  // Paragraphs
  const paragraphs = withHeadings.split(/\n\n+/).map(p => '<p>' + p.replace(/\n/g, "<br />") + '</p>').join("\n")
  return paragraphs
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, subject, content, status, imageData, imageName } = body

    if (!title || !subject || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const issue = {
      id: Date.now().toString(),
      title,
      subject,
      content,
      status: status || "draft",
      sentAt: status === "sent" ? new Date().toISOString() : null,
      createdAt: new Date().toISOString(),
    }

    issues.push(issue)

    // If status is "sent", send via our SMTP mailer to local subscribers
    if (status === "sent") {
      try {
        const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY
        const MAILERLITE_API_BASE = "https://connect.mailerlite.com/api"
        const defaultGroup = process.env.DEFAULT_MAILERLITE_GROUP_ID || process.env.NEXT_PUBLIC_DEFAULT_MAILERLITE_GROUP_ID
        const mailerLiteGroupId = (body as any).mailerLiteGroup || (body as any).mailerLiteGroupId || defaultGroup

        // If MailerLite API key is present and admin requested MailerLite send, attempt to create & send a campaign
        if (MAILERLITE_API_KEY && (body as any).sendViaMailerLite) {
          try {
            const converted = simpleMarkdownToHtml(content)
            const htmlPayload = '<!doctype html><html><body>' + converted + '</body></html>'
            const payload: any = { subject, html: htmlPayload, type: "regular" }
            if (mailerLiteGroupId) payload.groups = [mailerLiteGroupId]

            const res = await fetch(MAILERLITE_API_BASE + '/campaigns', {
              method: "POST",
              headers: {
                Authorization: 'Bearer ' + MAILERLITE_API_KEY,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            })

            const resText = await res.text().catch(() => "<no-body>")
            if (!res.ok) {
              console.error("MailerLite campaign creation failed:", res.status, resText)
              // fallthrough to SMTP send
            } else {
              // Try to parse the created campaign ID and trigger a send action
              try {
                const created = JSON.parse(resText || "{}")
                const campaignId = created && (created.id || created.data && created.data.id)
                if (campaignId) {
                  // MailerLite campaign send action
                  const sendRes = await fetch(MAILERLITE_API_BASE + '/campaigns/' + campaignId + '/actions/send', {
                    method: 'POST',
                    headers: {
                      Authorization: 'Bearer ' + MAILERLITE_API_KEY,
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({})
                  })
                  const sendText = await sendRes.text().catch(() => '<no-body>')
                  if (!sendRes.ok) {
                    console.error('MailerLite campaign send failed:', sendRes.status, sendText)
                    // fall through to SMTP send
                  } else {
                    console.log('MailerLite campaign sent:', sendText)
                    return NextResponse.json(issue, { status: 201 })
                  }
                } else {
                  console.log('MailerLite campaign created but no id returned:', resText)
                  // consider this a success (MailerLite may queue/send automatically)
                  return NextResponse.json(issue, { status: 201 })
                }
              } catch (e) {
                console.error('Error parsing MailerLite create response or sending campaign:', e, resText)
                // fall through to SMTP send
              }
            }
          } catch (e) {
            console.error("MailerLite campaign error:", e)
            // fall through to SMTP send
          }
        }

        // Read local subscribers
        const file = path.join(process.cwd(), "data", "subscribers.json")
        const raw = await fs.promises.readFile(file, { encoding: "utf8" }).catch(() => "[]")
        const local = JSON.parse(raw || "[]")
        const recipients = (local || []).map((s: any) => s.email).filter(Boolean)

  // Prepare HTML from markdown content
  const converted = simpleMarkdownToHtml(content)
  const html = '<!doctype html><html><body>' + converted + '</body></html>'

        const sendResult = await sendNewsletter({
          subject,
          html,
          text: content,
          imageData: imageData || null,
          imageName: imageName || null,
          recipients,
        })

        console.log("Newsletter send result:", sendResult)
      } catch (e) {
        console.error("Failed to send newsletter:", e)
      }
    }

    return NextResponse.json(issue, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json(issues)
}
