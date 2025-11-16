"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { AdminLogout } from "@/components/admin-logout"

export function Navigation() {
  const [isAdmin, setIsAdmin] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setIsAdmin(!!session)
    }

    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAdmin(!!session)
    })

    return () => subscription?.unsubscribe()
  }, [supabase])

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="newsletter-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <span className="text-accent-foreground text-sm font-bold">LD</span>
            </div>
            <span className="font-bold text-lg hidden md:inline">Learn Drop</span>
          </Link>

          <div className="flex items-center gap-4 md:gap-8">
            <Link href="/archive" className="text-sm md:text-base hover:text-accent transition-colors">
              Archive
            </Link>
            {isAdmin ? (
              <div className="flex items-center gap-4">
                <Link href="/admin" className="text-sm md:text-base hover:text-accent transition-colors">
                  Dashboard
                </Link>
                <AdminLogout />
              </div>
            ) : (
              <Link href="/admin/login" className="text-sm md:text-base hover:text-accent transition-colors">
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
