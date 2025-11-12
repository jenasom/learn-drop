import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get("reference")

    if (!reference) {
      return NextResponse.json({ error: "Missing reference" }, { status: 400 })
    }

    // TODO: Verify payment with Paystack
    // For now, return mock success response
    return NextResponse.json({
      status: true,
      message: "Verification successful",
      data: {
        reference,
        amount: 500000,
        customer: {
          email: "customer@example.com",
        },
        status: "success",
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
