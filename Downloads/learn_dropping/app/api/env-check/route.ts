import { NextRequest, NextResponse } from "next/server"

// Safe environment check endpoint: returns presence and length of keys only.
// Does NOT return secret values.
export async function GET(_request: NextRequest) {
  const keys = [
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "MAILERLITE_API_KEY",
    "DEFAULT_MAILERLITE_GROUP_ID",
  ]

  const envInfo: Record<string, { present: boolean; length: number }> = {}

  for (const k of keys) {
    const v = process.env[k]
    envInfo[k] = { present: Boolean(v), length: v ? v.length : 0 }
  }

  return NextResponse.json({ ok: true, env: envInfo })
}
