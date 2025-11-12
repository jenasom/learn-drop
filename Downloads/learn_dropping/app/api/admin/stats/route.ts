import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // TODO: Fetch admin stats from database
    return NextResponse.json({
      totalUsers: 1250,
      totalNewsletters: 580,
      totalSubscribers: 125000,
      totalRevenue: 8750000,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
