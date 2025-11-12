import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // TODO: Verify password against stored hash
    // For now, return mock response
    const token = Buffer.from(`${email}:${Date.now()}`).toString("base64")

    return NextResponse.json({
      token,
      user: { id: "1", email },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
