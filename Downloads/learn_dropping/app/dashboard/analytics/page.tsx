"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { StatCard } from "@/components/stat-card"
import { ArrowLeft, TrendingUp, Users, Mail, BarChart3, Download } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AnalyticsMetrics {
  totalSubscribers: number
  activeSubscribers: number
  premiumSubscribers: number
  freeSubscribers: number
  monthlyGrowth: number
  churnRate: number
  avgOpenRate: number
  avgClickRate: number
  topPerformingIssue: string
  topPerformingRate: number
}

interface ChartData {
  date: string
  subscribers: number
  opens: number
  clicks: number
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null)
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    fetchAnalytics()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/auth/login")
    }
  }

  const fetchAnalytics = async () => {
    try {
      // Generate mock analytics data
      const mockMetrics: AnalyticsMetrics = {
        totalSubscribers: 1248,
        activeSubscribers: 1156,
        premiumSubscribers: 342,
        freeSubscribers: 814,
        monthlyGrowth: 12.5,
        churnRate: 2.3,
        avgOpenRate: 34.7,
        avgClickRate: 8.2,
        topPerformingIssue: "Issue #15: AI Trends 2025",
        topPerformingRate: 52.3,
      }

      // Generate 30 days of chart data
      const days = 30
      const data: ChartData[] = []
      for (let i = 0; i < days; i++) {
        const date = new Date()
        date.setDate(date.getDate() - (days - i))
        data.push({
          date: date.toISOString().split("T")[0],
          subscribers: Math.floor(1000 + Math.random() * 250 + i * 8),
          opens: Math.floor(300 + Math.random() * 150),
          clicks: Math.floor(50 + Math.random() * 50),
        })
      }

      console.log("[v0] Analytics loaded successfully")
      setMetrics(mockMetrics)
      setChartData(data)
    } catch (err) {
      console.error("[v0] Error fetching analytics:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleExportReport = () => {
    if (!metrics) return

    const csv = [
      ["Analytics Report", new Date().toISOString().split("T")[0]],
      [],
      ["Subscriber Metrics"],
      ["Total Subscribers", metrics.totalSubscribers],
      ["Active Subscribers", metrics.activeSubscribers],
      ["Premium Subscribers", metrics.premiumSubscribers],
      ["Free Subscribers", metrics.freeSubscribers],
      [],
      ["Growth Metrics"],
      ["Monthly Growth Rate (%)", metrics.monthlyGrowth],
      ["Churn Rate (%)", metrics.churnRate],
      [],
      ["Engagement Metrics"],
      ["Average Open Rate (%)", metrics.avgOpenRate],
      ["Average Click Rate (%)", metrics.avgClickRate],
      ["Top Performing Issue", metrics.topPerformingIssue],
      ["Top Performing Rate (%)", metrics.topPerformingRate],
    ]
      .map((row) => (Array.isArray(row) ? row.map((cell) => `"${cell}"`).join(",") : row))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `analytics-report-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <main className="flex-1 md:ml-64">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Analytics</h1>
              <p className="text-muted-foreground">Track your subscriber growth and engagement metrics</p>
            </div>
            <Button onClick={handleExportReport} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            <StatCard label="Total Subscribers" value={metrics.totalSubscribers} icon={Users} trend={12.5} />
            <StatCard label="Active Subscribers" value={metrics.activeSubscribers} icon={Users} trend={8.3} />
            <StatCard label="Monthly Growth" value={`${metrics.monthlyGrowth}%`} icon={TrendingUp} />
            <StatCard label="Avg Open Rate" value={`${metrics.avgOpenRate}%`} icon={Mail} />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card className="p-8">
                <h3 className="text-lg font-semibold mb-6">Subscriber Growth (Last 30 Days)</h3>
                <div className="space-y-4">
                  {chartData.map((data, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="text-sm text-muted-foreground w-20">{data.date}</div>
                      <div className="flex-1 bg-muted rounded-full h-8 flex items-center px-3 relative overflow-hidden">
                        <div
                          className="absolute top-0 left-0 h-full bg-primary/20 transition-all"
                          style={{ width: `${(data.subscribers / 1250) * 100}%` }}
                        />
                        <span className="text-xs font-medium relative z-10">{data.subscribers} subscribers</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Subscription Breakdown</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Premium Subscribers</span>
                      <span className="font-semibold">{metrics.premiumSubscribers}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(metrics.premiumSubscribers / metrics.totalSubscribers) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-muted-foreground text-sm">
                      <span>
                        {((metrics.premiumSubscribers / metrics.totalSubscribers) * 100).toFixed(1)}% of total
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Health Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Monthly Growth Rate</span>
                      <span className="font-semibold text-green-600">{metrics.monthlyGrowth}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Churn Rate</span>
                      <span className="font-semibold text-destructive">{metrics.churnRate}%</span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Engagement Tab */}
            <TabsContent value="engagement" className="space-y-6">
              <Card className="p-8">
                <h3 className="text-lg font-semibold mb-6">Engagement Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Average Open Rate</p>
                      <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold">{metrics.avgOpenRate}%</span>
                        <span className="text-sm text-green-600 mb-1">↑ 3.2% from last month</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mt-4">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${metrics.avgOpenRate}%` }} />
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Average Click Rate</p>
                      <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold">{metrics.avgClickRate}%</span>
                        <span className="text-sm text-green-600 mb-1">↑ 1.5% from last month</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mt-4">
                        <div
                          className="bg-primary/60 h-2 rounded-full"
                          style={{ width: `${metrics.avgClickRate * 4}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <Card className="p-4 bg-muted/30 border-muted">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Top Performing Issue
                      </h4>
                      <p className="text-sm mb-3">{metrics.topPerformingIssue}</p>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Open Rate</p>
                        <div className="flex items-end gap-2">
                          <span className="font-bold text-lg">{metrics.topPerformingRate}%</span>
                          <span className="text-xs text-green-600">
                            +{(metrics.topPerformingRate - metrics.avgOpenRate).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </Card>

              <Card className="p-8">
                <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { title: "Issue #20 sent", date: "2 days ago", opens: 342, clicks: 28 },
                    { title: "Issue #19 sent", date: "9 days ago", opens: 385, clicks: 31 },
                    { title: "Issue #18 sent", date: "16 days ago", opens: 298, clicks: 22 },
                  ].map((activity, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{activity.opens} opens</p>
                        <p className="text-xs text-muted-foreground">{activity.clicks} clicks</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Subscribers Tab */}
            <TabsContent value="subscribers" className="space-y-6">
              <Card className="p-8">
                <h3 className="text-lg font-semibold mb-6">Subscriber Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-6 bg-muted/30 border-muted">
                    <p className="text-sm text-muted-foreground mb-2">Total Subscribers</p>
                    <p className="text-4xl font-bold mb-3">{metrics.totalSubscribers}</p>
                    <p className="text-xs text-green-600">
                      +{Math.floor(metrics.totalSubscribers * (metrics.monthlyGrowth / 100))} this month
                    </p>
                  </Card>

                  <Card className="p-6 bg-muted/30 border-muted">
                    <p className="text-sm text-muted-foreground mb-2">Active Subscribers</p>
                    <p className="text-4xl font-bold mb-3">{metrics.activeSubscribers}</p>
                    <p className="text-xs text-muted-foreground">
                      {((metrics.activeSubscribers / metrics.totalSubscribers) * 100).toFixed(1)}% engagement
                    </p>
                  </Card>

                  <Card className="p-6 bg-muted/30 border-muted">
                    <p className="text-sm text-muted-foreground mb-2">Unsubscribed</p>
                    <p className="text-4xl font-bold mb-3">{metrics.totalSubscribers - metrics.activeSubscribers}</p>
                    <p className="text-xs text-destructive">{metrics.churnRate}% churn rate</p>
                  </Card>
                </div>

                <div className="mt-8 p-6 bg-muted/20 border border-border rounded-lg">
                  <h4 className="font-semibold mb-4">Subscription Plan Distribution</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Premium Plan</span>
                        <span className="font-semibold">{metrics.premiumSubscribers}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div
                          className="bg-primary h-3 rounded-full"
                          style={{ width: `${(metrics.premiumSubscribers / metrics.totalSubscribers) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Free Plan</span>
                        <span className="font-semibold">{metrics.freeSubscribers}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div
                          className="bg-primary/40 h-3 rounded-full"
                          style={{ width: `${(metrics.freeSubscribers / metrics.totalSubscribers) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
