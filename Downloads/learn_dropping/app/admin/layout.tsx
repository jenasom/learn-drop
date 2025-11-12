"use client"

import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail, LogOut } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 w-64 h-screen border-r border-border bg-card">
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-2 text-xl font-semibold hover:text-primary transition">
            <Mail className="w-6 h-6" />
            <span>Learn Drop</span>
          </Link>
        </div>

        <nav className="space-y-2 px-4">
          <Link href="/admin">
            <Button variant="ghost" className="w-full justify-start">
              Dashboard
            </Button>
          </Link>
          <Link href="/admin/subscribers">
            <Button variant="ghost" className="w-full justify-start">
              Subscribers
            </Button>
          </Link>
          <Link href="/admin/compose">
            <Button variant="ghost" className="w-full justify-start">
              Compose Newsletter
            </Button>
          </Link>
          <Link href="/admin/issues">
            <Button variant="ghost" className="w-full justify-start">
              Issues Archive
            </Button>
          </Link>
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <div className="p-8">{children}</div>
      </div>
    </div>
  )
}
