import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-paystack-signature") || ""

    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY || "")
      .update(body)
      .digest("hex")

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const payload = JSON.parse(body)
    const { event, data } = payload

    console.log("[v0] Paystack webhook received:", event)

    if (event === "charge.success") {
      const { reference, customer, metadata } = data

      // TODO: Update payment status to success
      // TODO: Upgrade subscriber to premium
      // TODO: Send confirmation email
      // TODO: Update MailerLite subscriber status

      console.log("[v0] Payment successful:", { reference, email: customer.email, metadata })
    }

    return NextResponse.json({ status: "ok" }, { status: 200 })
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
