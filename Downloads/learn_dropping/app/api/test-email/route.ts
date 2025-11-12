import { NextRequest, NextResponse } from "next/server"
import { testMailerLite } from "@/lib/mailerlite-test"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const result = await testMailerLite(email)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Test endpoint error:", error)
    return NextResponse.json({ error: "Test failed" }, { status: 500 })
  }
}