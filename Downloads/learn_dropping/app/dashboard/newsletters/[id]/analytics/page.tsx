"use client"

import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { StatCard } from "@/components/stat-card"
import { ArrowLeft, BarChart3, Users } from "lucide-react"

interface IssueAnalytics {
  issueTitle: string
  sentDate: string
  recipients: number
  opens: number
  clicks: number
  unsubscribes: number
  bounces: number
}

export default function NewsletterAnalyticsPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const issueAnalytics: IssueAnalytics = {
    issueTitle: "Issue #20: The Future of AI",
    sentDate: "2025-01-15",
    recipients: 1248,
    opens: 428,
    clicks: 35,
    unsubscribes: 2,
    bounces: 1,
  }

  const openRate = ((issueAnalytics.opens / issueAnalytics.recipients) * 100).toFixed(1)
  const clickRate = ((issueAnalytics.clicks / issueAnalytics.opens) * 100).toFixed(1)
  const unsubscribeRate = ((issueAnalytics.unsubscribes / issueAnalytics.recipients) * 100).toFixed(2)

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <main className="flex-1 md:ml-64">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <Link
            href={`/dashboard/newsletters/${id}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Newsletter
          </Link>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">{issueAnalytics.issueTitle}</h1>
            <p className="text-muted-foreground">Sent on {issueAnalytics.sentDate}</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            <StatCard label="Recipients" value={issueAnalytics.recipients} icon={Users} />
            <StatCard label="Opens" value={issueAnalytics.opens} trend={Number.parseFloat(openRate)} />
            <StatCard label="Clicks" value={issueAnalytics.clicks} icon={BarChart3} />
            <StatCard label="Unsubscribes" value={issueAnalytics.unsubscribes} />
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Performance Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="text-sm text-muted-foreground">Open Rate</span>
                  <span className="text-2xl font-bold">{openRate}%</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="text-sm text-muted-foreground">Click Rate</span>
                  <span className="text-2xl font-bold">{clickRate}%</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="text-sm text-muted-foreground">Bounce Rate</span>
                  <span className="text-2xl font-bold">
                    {((issueAnalytics.bounces / issueAnalytics.recipients) * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Unsubscribe Rate</span>
                  <span className="text-2xl font-bold">{unsubscribeRate}%</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Engagement Breakdown</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Opened</span>
                    <span className="font-semibold">{issueAnalytics.opens}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${(issueAnalytics.opens / issueAnalytics.recipients) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Clicked</span>
                    <span className="font-semibold">{issueAnalytics.clicks}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary/60 h-2 rounded-full"
                      style={{ width: `${(issueAnalytics.clicks / issueAnalytics.recipients) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Unsubscribed</span>
                    <span className="font-semibold">{issueAnalytics.unsubscribes}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-destructive/60 h-2 rounded-full" style={{ width: "2%" }} />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-8 p-6 bg-muted/20 border border-border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Your open rate of {openRate}% is above average. Keep up the great subject lines!</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Consider adding more calls-to-action to improve click rates.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Monitor unsubscribe trends to ensure content remains relevant to your audience.</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
