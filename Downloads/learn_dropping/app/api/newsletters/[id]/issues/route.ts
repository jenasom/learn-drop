import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { title, subject, content, status, scheduledTime } = body
    const { id: newsletterId } = params

    if (!title || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const issue = {
      id: "1",
      newsletter_id: newsletterId,
      title,
      subject: subject || title,
      content,
      status: status || "draft",
      scheduled_time: scheduledTime || null,
      published_at: status === "published" ? new Date().toISOString() : null,
      created_at: new Date().toISOString(),
    }

    console.log("[v0] Issue created:", {
      id: issue.id,
      newsletter_id: newsletterId,
      status: issue.status,
      scheduled_time: issue.scheduled_time,
    })

    // TODO: Create newsletter issue in database
    // TODO: If status is "published" or "scheduled", send/schedule via MailerLite to all subscribers

    return NextResponse.json({ issue })
  } catch (error) {
    console.error("[v0] Issue creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id: newsletterId } = params

    console.log("[v0] Fetching issues for newsletter:", newsletterId)

    // TODO: Fetch issues for specific newsletter from database
    const issues = [
      {
        id: "1",
        newsletter_id: newsletterId,
        title: "Welcome to Learn Drop",
        subject: "Welcome to our newsletter!",
        status: "published",
        published_at: "2025-01-10",
        issue_number: 1,
      },
    ]

    return NextResponse.json({ issues })
  } catch (error) {
    console.error("[v0] Issues fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
