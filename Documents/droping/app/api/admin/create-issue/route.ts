import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { title, description, content, issueNumber } = await request.json()

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch {
              // Silent fail
            }
          },
        },
      },
    )

    // Create the issue
    const { data: issue } = await supabase
      .from("newsletter_issues")
      .insert({
        title,
        description,
        content,
        issue_number: Number.parseInt(issueNumber),
        published_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (!issue) {
      throw new Error("Failed to create issue")
    }

    // Get all active subscribers
    const { data: subscribers } = await supabase.from("subscribers").select("email, name").eq("is_active", true)

    if (subscribers && subscribers.length > 0) {
      // Send emails to all subscribers
      for (const subscriber of subscribers) {
        await resend.emails.send({
          from: "Learn Drop <onboarding@resend.dev>",
          to: subscriber.email,
          subject: `${title} - Learn Drop Issue #${issueNumber}`,
          html: `
            <h1>${title}</h1>
            <p>Hi ${subscriber.name || "there"},</p>
            ${description ? `<p>${description}</p>` : ""}
            <div>${content}</div>
            <hr />
            <p style="color: #999; font-size: 12px;">Learn Drop © 2025</p>
          `,
        })

        // Log the send
        await supabase.from("send_logs").insert({
          issue_id: issue.id,
          subscriber_id: subscriber.id,
          status: "sent",
        })
      }
    }

    return NextResponse.json({ message: "Newsletter sent successfully!", issue }, { status: 201 })
  } catch (error) {
    console.error("Create issue error:", error)
    return NextResponse.json({ message: "Failed to create and send newsletter" }, { status: 500 })
  }
}
