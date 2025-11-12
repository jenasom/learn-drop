"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { StatCard } from "@/components/stat-card"
import { Search, Download, Mail, TrendingUp, ArrowLeft } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Subscriber {
  id: string
  newsletter_id: string
  email: string
  name: string
  profession?: string
  plan: "free" | "premium"
  status: "active" | "unsubscribed"
  subscribed_at: string
}

export default function SubscribersPage() {
  const router = useRouter()
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([])
  const [search, setSearch] = useState("")
  const [filterPlan, setFilterPlan] = useState<"all" | "free" | "premium">("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    fetchSubscribers()
  }, [])

  useEffect(() => {
    filterSubscribers()
  }, [subscribers, search, filterPlan])

  const checkAuth = () => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/auth/login")
    }
  }

  const fetchSubscribers = async () => {
    try {
      const response = await fetch("/api/subscribers", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      })

      if (response.ok) {
        const data = await response.json()
        // Mock data for now - replace with actual API response
        setSubscribers([
          {
            id: "1",
            newsletter_id: "news-1",
            name: "Alice Johnson",
            email: "alice@example.com",
            profession: "Software Engineer",
            plan: "premium",
            status: "active",
            subscribed_at: "2025-01-10",
          },
          {
            id: "2",
            newsletter_id: "news-1",
            name: "Bob Smith",
            email: "bob@example.com",
            profession: "Product Manager",
            plan: "free",
            status: "active",
            subscribed_at: "2025-01-12",
          },
          {
            id: "3",
            newsletter_id: "news-1",
            name: "Carol White",
            email: "carol@example.com",
            profession: "Designer",
            plan: "premium",
            status: "active",
            subscribed_at: "2025-01-05",
          },
          {
            id: "4",
            newsletter_id: "news-1",
            name: "David Lee",
            email: "david@example.com",
            profession: "Founder",
            plan: "free",
            status: "unsubscribed",
            subscribed_at: "2024-12-20",
          },
        ])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filterSubscribers = () => {
    let filtered = subscribers

    // Apply search filter
    if (search) {
      filtered = filtered.filter(
        (sub) =>
          sub.name.toLowerCase().includes(search.toLowerCase()) ||
          sub.email.toLowerCase().includes(search.toLowerCase()),
      )
    }

    // Apply plan filter
    if (filterPlan !== "all") {
      filtered = filtered.filter((sub) => sub.plan === filterPlan)
    }

    setFilteredSubscribers(filtered)
  }

  const handleExport = () => {
    const csv = [
      ["Name", "Email", "Profession", "Plan", "Status", "Subscribed Date"],
      ...filteredSubscribers.map((sub) => [
        sub.name,
        sub.email,
        sub.profession || "",
        sub.plan,
        sub.status,
        sub.subscribed_at,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `subscribers-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  const activeSubscribers = subscribers.filter((s) => s.status === "active")
  const premiumCount = activeSubscribers.filter((s) => s.plan === "premium").length
  const freeCount = activeSubscribers.filter((s) => s.plan === "free").length

  if (loading) {
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

          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Subscribers</h1>
            <p className="text-muted-foreground">Manage and track your newsletter subscribers</p>
          </div>

          {/* Analytics Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            <StatCard label="Active Subscribers" value={activeSubscribers.length} icon={Mail} />
            <StatCard label="Premium Subscribers" value={premiumCount} icon={TrendingUp} />
            <StatCard label="Free Subscribers" value={freeCount} />
            <StatCard label="Unsubscribed" value={subscribers.filter((s) => s.status === "unsubscribed").length} />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList>
                <TabsTrigger value="all">All Subscribers</TabsTrigger>
                <TabsTrigger value="premium">Premium</TabsTrigger>
                <TabsTrigger value="free">Free</TabsTrigger>
              </TabsList>

              <Button onClick={handleExport} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>

            <TabsContent value="all" className="space-y-4">
              <Card className="p-4">
                <div className="mb-4 relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left px-4 py-3 font-semibold">Name</th>
                        <th className="text-left px-4 py-3 font-semibold">Email</th>
                        <th className="text-left px-4 py-3 font-semibold">Profession</th>
                        <th className="text-left px-4 py-3 font-semibold">Plan</th>
                        <th className="text-left px-4 py-3 font-semibold">Status</th>
                        <th className="text-left px-4 py-3 font-semibold">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubscribers.map((subscriber) => (
                        <tr key={subscriber.id} className="border-b border-border hover:bg-muted/30 transition">
                          <td className="px-4 py-3">{subscriber.name}</td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">{subscriber.email}</td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">{subscriber.profession || "-"}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                subscriber.plan === "premium"
                                  ? "bg-primary/20 text-primary"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {subscriber.plan}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                subscriber.status === "active"
                                  ? "bg-green-500/20 text-green-700 dark:text-green-400"
                                  : "bg-destructive/20 text-destructive"
                              }`}
                            >
                              {subscriber.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">{subscriber.subscribed_at}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredSubscribers.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No subscribers found</p>
                  </div>
                )}

                <p className="text-xs text-muted-foreground mt-4">Total: {filteredSubscribers.length} subscribers</p>
              </Card>
            </TabsContent>

            <TabsContent value="premium">
              <Card className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left px-4 py-3 font-semibold">Name</th>
                        <th className="text-left px-4 py-3 font-semibold">Email</th>
                        <th className="text-left px-4 py-3 font-semibold">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers
                        .filter((s) => s.plan === "premium")
                        .map((subscriber) => (
                          <tr key={subscriber.id} className="border-b border-border hover:bg-muted/30 transition">
                            <td className="px-4 py-3">{subscriber.name}</td>
                            <td className="px-4 py-3 text-muted-foreground text-xs">{subscriber.email}</td>
                            <td className="px-4 py-3 text-muted-foreground text-xs">{subscriber.subscribed_at}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="free">
              <Card className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left px-4 py-3 font-semibold">Name</th>
                        <th className="text-left px-4 py-3 font-semibold">Email</th>
                        <th className="text-left px-4 py-3 font-semibold">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers
                        .filter((s) => s.plan === "free")
                        .map((subscriber) => (
                          <tr key={subscriber.id} className="border-b border-border hover:bg-muted/30 transition">
                            <td className="px-4 py-3">{subscriber.name}</td>
                            <td className="px-4 py-3 text-muted-foreground text-xs">{subscriber.email}</td>
                            <td className="px-4 py-3 text-muted-foreground text-xs">{subscriber.subscribed_at}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
