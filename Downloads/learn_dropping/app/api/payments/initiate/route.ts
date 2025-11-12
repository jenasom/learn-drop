import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, amount, plan } = body

    if (!email || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const reference = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // For production, integrate with actual Paystack API
    // const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     email,
    //     amount: amount * 100, // Convert to kobo
    //     callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/verify`,
    //     metadata: { plan, reference },
    //   }),
    // })

    // Mock response for development
    return NextResponse.json(
      {
        status: true,
        message: "Authorization URL created",
        data: {
          authorization_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/subscribe/checkout?email=${encodeURIComponent(email)}`,
          access_code: reference,
          reference,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Payment initiate error:", error)
    return NextResponse.json({ error: "Payment initialization failed" }, { status: 500 })
  }
}
