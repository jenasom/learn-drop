"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, Mail, TrendingUp } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { StatCard } from "@/components/stat-card"

interface Issue {
  id: string
  title: string
  status: string
  published_at?: string
  issue_number: number
}

interface Newsletter {
  id: string
  title: string
  description: string
  subscriber_count: number
  issues: Issue[]
}

export default function NewsletterDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNewsletter()
  }, [id])

  const fetchNewsletter = async () => {
    try {
      const response = await fetch(`/api/newsletters/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      })
      if (response.ok) {
        const data = await response.json()
        setNewsletter(data.newsletter)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !newsletter) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">{newsletter.title}</h1>
              <p className="text-muted-foreground">{newsletter.description}</p>
            </div>
            <Link href={`/dashboard/newsletters/${id}/compose`}>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Issue
              </Button>
            </Link>
          </div>

          {/* Analytics Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <StatCard label="Total Subscribers" value={newsletter.subscriber_count} icon={Mail} />
            <StatCard label="Total Issues" value={newsletter.issues?.length || 0} />
            <StatCard
              label="Published Issues"
              value={newsletter.issues?.filter((i) => i.status === "published").length || 0}
              icon={TrendingUp}
            />
          </div>

          {/* Issues Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">Issues</h2>
              {newsletter.issues && newsletter.issues.length > 0 ? (
                <div className="space-y-4">
                  {newsletter.issues.map((issue) => (
                    <Link key={issue.id} href={`/dashboard/newsletters/${id}/issues/${issue.id}`}>
                      <Card className="p-6 hover:border-primary transition cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Issue #{issue.issue_number}</p>
                            <h3 className="text-lg font-semibold mb-2">{issue.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {issue.status === "published" ? "Published" : "Draft"}
                            </p>
                          </div>
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              issue.status === "published"
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {issue.status}
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <Mail className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No issues yet</h3>
                  <p className="text-muted-foreground mb-6">Create your first newsletter issue</p>
                  <Link href={`/dashboard/newsletters/${id}/compose`}>
                    <Button>Create Issue</Button>
                  </Link>
                </Card>
              )}
            </div>

            {/* Additional Info Sidebar */}
            <div>
              <h3 className="text-lg font-bold mb-4">Newsletter Info</h3>
              <div className="space-y-4">
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Created</p>
                  <p className="font-medium">{new Date().toLocaleDateString()}</p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <p className="font-medium">Active</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
