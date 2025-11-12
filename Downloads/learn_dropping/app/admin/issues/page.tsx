"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Issue {
  id: string
  title: string
  subject: string
  status: "draft" | "sent"
  sentAt?: string
  createdAt: string
}

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([])

  useEffect(() => {
    // In a real app, fetch from API
    setIssues([
      {
        id: "1",
        title: "Issue #42: The Future of AI",
        subject: "AI is changing everything - here's what you need to know",
        status: "sent",
        sentAt: "2025-01-20",
        createdAt: "2025-01-20",
      },
      {
        id: "2",
        title: "Issue #41: Startup Lessons",
        subject: "5 things I learned building my latest startup",
        status: "sent",
        sentAt: "2025-01-13",
        createdAt: "2025-01-13",
      },
      {
        id: "3",
        title: "Issue #40: Market Analysis",
        subject: "Q1 2025 tech market predictions",
        status: "draft",
        createdAt: "2025-01-06",
      },
    ])
  }, [])

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Issues Archive</h1>

      <div className="space-y-4">
        {issues.map((issue) => (
          <Card key={issue.id} className="p-6 hover:border-primary/50 transition cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{issue.title}</h3>
                <p className="text-muted-foreground text-sm mb-3">{issue.subject}</p>
                <p className="text-xs text-muted-foreground">
                  {issue.status === "sent" ? `Sent on ${issue.sentAt}` : `Created on ${issue.createdAt}`}
                </p>
              </div>
              <Badge variant={issue.status === "sent" ? "default" : "secondary"}>{issue.status}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
