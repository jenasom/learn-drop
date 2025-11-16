import { createServerClient } from "@supabase/ssr"
import type { NextRequest, NextResponse } from "next/server"

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  const response = new Response()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if user needs to be redirected based on their route
  const path = request.nextUrl.pathname

  // If on admin page and not authenticated, redirect to login
  if (path.startsWith("/admin") && !path.startsWith("/admin/login") && !user) {
    return Response.redirect(new URL("/admin/login", request.url))
  }

  return response
}
