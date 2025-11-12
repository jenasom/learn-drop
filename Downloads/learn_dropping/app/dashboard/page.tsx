"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Plus, Mail, BarChart3 } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { StatCard } from "@/components/stat-card"
import { NewsletterCard } from "@/components/newsletter-card"

interface Newsletter {
  id: string
  title: string
  slug: string
  subscriber_count: number
  is_published: boolean
  created_at: string
  description?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState({ name: "", email: "" })

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken")
      if (!token) {
        router.push("/auth/login")
        return
      }

      fetchNewsletters()
    }

    const fetchNewsletters = async () => {
      try {
        const response = await fetch("/api/newsletters", {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        })
        if (response.ok) {
          const data = await response.json()
          setNewsletters(data.newsletters || [])
          setUser(data.user || {})
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar userName={user.name} />

      <main className="flex-1 md:ml-64">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Welcome back, {user.name || "Creator"}</h1>
            <p className="text-muted-foreground">Manage and grow your newsletters</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <StatCard
              label="Total Newsletters"
              value={newsletters.length}
              icon={Mail}
              trend={newsletters.length > 0 ? 100 : 0}
            />
            <StatCard label="Total Subscribers" value={newsletters.reduce((sum, n) => sum + n.subscriber_count, 0)} />
            <Link href="/dashboard/analytics" className="block">
              <StatCard label="View Analytics" value="Go" icon={BarChart3} />
            </Link>
          </div>

          {/* Create Newsletter Button */}
          <div className="mb-12">
            <Link href="/dashboard/create">
              <Button size="lg">
                <Plus className="w-4 h-4 mr-2" />
                Create New Newsletter
              </Button>
            </Link>
          </div>

          {/* Newsletters Grid */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Newsletters</h2>
            {newsletters.length === 0 ? (
              <Card className="p-12 text-center">
                <Mail className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No newsletters yet</h3>
                <p className="text-muted-foreground mb-6">Create your first newsletter to get started</p>
                <Link href="/dashboard/create">
                  <Button>Create Newsletter</Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsletters.map((newsletter) => (
                  <NewsletterCard
                    key={newsletter.id}
                    id={newsletter.id}
                    title={newsletter.title}
                    description={newsletter.description}
                    subscriberCount={newsletter.subscriber_count}
                    isPublished={newsletter.is_published}
                    createdAt={newsletter.created_at}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
