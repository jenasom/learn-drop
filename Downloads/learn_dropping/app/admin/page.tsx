"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Users, Mail, TrendingUp } from "lucide-react"

interface DashboardStats {
  totalSubscribers: number
  premiumSubscribers: number
  freeSubscribers: number
  totalIssuesSent: number
  totalRevenue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSubscribers: 0,
    premiumSubscribers: 0,
    freeSubscribers: 0,
    totalIssuesSent: 0,
    totalRevenue: 0,
  })

  useEffect(() => {
    // In a real app, fetch stats from API
    setStats({
      totalSubscribers: 524,
      premiumSubscribers: 82,
      freeSubscribers: 442,
      totalIssuesSent: 28,
      totalRevenue: 82000,
    })

    // remove dev overlay nodes that may be injected by Turbopack/Next dev
    try {
      const nodes = Array.from(document.querySelectorAll("*"))
      const suspects = nodes.filter((el) => {
        const txt = (el.textContent || "").toLowerCase()
        return /turbopack|route info|route, turbopack|preferences/.test(txt)
      })
      suspects.forEach((el) => {
        const fixedParent = el.closest('div[style*="position:fixed"], div[style*="position: fixed"]') || el.parentElement
        if (fixedParent && fixedParent.parentElement) fixedParent.parentElement.removeChild(fixedParent)
        else if (el.parentElement) el.parentElement.removeChild(el)
      })
    } catch (e) {
      // ignore
    }
  }, [])

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Subscribers</p>
              <p className="text-3xl font-bold mt-2">{stats.totalSubscribers}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {stats.premiumSubscribers} premium, {stats.freeSubscribers} free
              </p>
            </div>
            <Users className="w-8 h-8 text-primary/50" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Issues Sent</p>
              <p className="text-3xl font-bold mt-2">{stats.totalIssuesSent}</p>
              <p className="text-xs text-muted-foreground mt-2">This year</p>
            </div>
            <Mail className="w-8 h-8 text-primary/50" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Revenue</p>
              <p className="text-3xl font-bold mt-2">₦{stats.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-2">From premium subscriptions</p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary/50" />
          </div>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Compose New Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">Write and send the latest issue to your subscribers</p>
            <a href="/admin/compose" className="text-primary hover:underline text-sm font-medium">
              Get started →
            </a>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-2">View Subscribers</h3>
            <p className="text-sm text-muted-foreground mb-4">Manage your growing subscriber base</p>
            <a href="/admin/subscribers" className="text-primary hover:underline text-sm font-medium">
              View all →
            </a>
          </Card>
        </div>
      </div>
    </div>
  )
}
