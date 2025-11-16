"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { AdminStats } from "@/components/admin-stats"
import { AdminForm } from "@/components/admin-form"
import { SubscribersList } from "@/components/subscribers-list"
import { AdminGuard } from "@/components/admin-guard"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "create" | "subscribers">("dashboard")
  const [stats, setStats] = useState({ subscribers: 0, issues: 0, sent: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch("/api/admin/stats")
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Error loading stats:", error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <Navigation />

        <section className="newsletter-container py-16 md:py-24">
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <h1>Admin Dashboard</h1>
              <p className="text-lg text-muted-foreground">Manage your Learn Drop newsletter</p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-border pb-4">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  activeTab === "dashboard"
                    ? "text-accent border-b-2 border-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("create")}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  activeTab === "create"
                    ? "text-accent border-b-2 border-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Create Issue
              </button>
              <button
                onClick={() => setActiveTab("subscribers")}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  activeTab === "subscribers"
                    ? "text-accent border-b-2 border-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Subscribers
              </button>
            </div>

            {/* Content */}
            <div className="pt-8">
              {activeTab === "dashboard" && <AdminStats stats={stats} loading={loading} />}
              {activeTab === "create" && <AdminForm onSuccess={() => setActiveTab("dashboard")} />}
              {activeTab === "subscribers" && <SubscribersList />}
            </div>
          </div>
        </section>
      </div>
    </AdminGuard>
  )
}
