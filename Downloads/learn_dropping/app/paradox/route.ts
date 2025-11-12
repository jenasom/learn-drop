import { NextResponse } from "next/server"

export async function GET() {
  // Redirect /paradox to the admin login page
  return NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'))
}
