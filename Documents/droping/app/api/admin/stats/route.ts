import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
        },
      },
    )

    // Get active subscribers count
    const { count: subscribersCount } = await supabase
      .from("subscribers")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)

    // Get issues count
    const { count: issuesCount } = await supabase.from("newsletter_issues").select("*", { count: "exact", head: true })

    // Get total emails sent
    const { count: sentCount } = await supabase.from("send_logs").select("*", { count: "exact", head: true })

    return NextResponse.json({
      subscribers: subscribersCount || 0,
      issues: issuesCount || 0,
      sent: sentCount || 0,
    })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json({ subscribers: 0, issues: 0, sent: 0 }, { status: 500 })
  }
}
