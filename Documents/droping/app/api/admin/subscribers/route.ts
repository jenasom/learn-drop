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

    const { data: subscribers } = await supabase
      .from("subscribers")
      .select("*")
      .eq("is_active", true)
      .order("subscribed_at", { ascending: false })

    return NextResponse.json(subscribers || [])
  } catch (error) {
    console.error("Subscribers error:", error)
    return NextResponse.json([], { status: 500 })
  }
}
