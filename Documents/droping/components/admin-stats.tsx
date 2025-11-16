import { Mail, Users, BookOpen } from "lucide-react"

interface AdminStatsProps {
  stats: {
    subscribers: number
    issues: number
    sent: number
  }
  loading: boolean
}

export function AdminStats({ stats, loading }: AdminStatsProps) {
  const statItems = [
    { icon: Users, label: "Active Subscribers", value: stats.subscribers },
    { icon: BookOpen, label: "Issues Published", value: stats.issues },
    { icon: Mail, label: "Emails Sent", value: stats.sent },
  ]

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {statItems.map((item, index) => (
        <div key={index} className="newsletter-card">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="text-3xl font-bold text-accent">{loading ? "..." : item.value.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-accent/10 rounded-lg">
              <item.icon className="w-6 h-6 text-accent" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
