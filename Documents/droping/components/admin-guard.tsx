"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const supabase = createClient()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    async function checkAuth() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
          router.push("/admin/login")
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        setIsAuthenticated(false)
        router.push("/admin/login")
      }
    }

    checkAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        setIsAuthenticated(false)
        router.push("/admin/login")
      }
    })

    return () => subscription?.unsubscribe()
  }, [router, supabase])

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="space-y-2 text-center">
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
