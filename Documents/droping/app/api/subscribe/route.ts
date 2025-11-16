import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json({ message: "Please provide a valid email" }, { status: 400 })
    }

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
              // Silent fail - cookies can only be set server-side
            }
          },
        },
      },
    )

    // Check if already subscribed
    const { data: existingSubscriber } = await supabase.from("subscribers").select("*").eq("email", email).single()

    if (existingSubscriber && existingSubscriber.is_active) {
      return NextResponse.json({ message: "This email is already subscribed" }, { status: 400 })
    }

    // Create or update subscriber
    if (existingSubscriber) {
      await supabase
        .from("subscribers")
        .update({ is_active: true, unsubscribed_at: null })
        .eq("id", existingSubscriber.id)
    } else {
      await supabase.from("subscribers").insert({
        email,
        name: name || null,
        is_active: true,
      })
    }

    // Send welcome email
    await resend.emails.send({
      from: "Learn Drop <onboarding@resend.dev>",
      to: email,
      subject: "Welcome to Learn Drop Newsletter!",
      html: `
        <h1>Welcome to Learn Drop!</h1>
        <p>Hi ${name || "there"},</p>
        <p>Thanks for subscribing to Learn Drop. You'll receive curated tech insights delivered weekly.</p>
        <p>Look out for our next issue coming soon!</p>
      `,
    })

    return NextResponse.json({ message: "Successfully subscribed!" }, { status: 201 })
  } catch (error) {
    console.error("Subscribe error:", error)
    return NextResponse.json({ message: "Failed to subscribe" }, { status: 500 })
  }
}
