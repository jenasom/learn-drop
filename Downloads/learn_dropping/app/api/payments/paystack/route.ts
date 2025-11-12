import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, email, tier } = body

    if (!amount || !email || !tier) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // TODO: Initialize Paystack transaction
    // For now, return mock response with authorization URL
    const reference = `ref_${Date.now()}`
    const authorizationUrl = `https://checkout.paystack.com/c/${reference}`

    return NextResponse.json({
      status: true,
      message: "Authorization URL created",
      data: {
        authorization_url: authorizationUrl,
        access_code: `access_${reference}`,
        reference,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
