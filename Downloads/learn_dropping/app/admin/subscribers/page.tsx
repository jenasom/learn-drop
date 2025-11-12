"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface Subscriber {
  id: string
  name: string
  email: string
  profession: string
  plan: "free" | "premium"
  subscribedAt: string
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
  // Fetch real subscribers from the server API (which will proxy to MailerLite if configured)
    let mounted = true
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/subscribers")
        if (!res.ok) {
          const err = await res.text()
          throw new Error(`Failed to load subscribers: ${err}`)
        }
        const json = await res.json()
        if (!mounted) return
        setSubscribers(json.subscribers || [])
      } catch (err) {
        console.error(err)
        if (!mounted) return
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  const loadDemo = () => {
    setSubscribers([
      { id: 'demo-1', name: 'Demo User', email: 'demo1@example.com', profession: 'Founder', plan: 'free', subscribedAt: '2025-01-01' },
      { id: 'demo-2', name: 'Example Reader', email: 'reader@example.com', profession: 'Designer', plan: 'free', subscribedAt: '2025-02-02' },
      { id: 'demo-3', name: 'QA Tester', email: 'qa@example.com', profession: 'Engineer', plan: 'free', subscribedAt: '2025-03-03' },
    ])
    setError(null)
  }

  // Remove dev overlay nodes (Turbopack / Next) if they remain visible inside admin
  useEffect(() => {
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

  const filteredSubscribers = subscribers.filter(
    (sub) =>
      sub.name.toLowerCase().includes(search.toLowerCase()) || sub.email.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Subscribers</h1>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {!loading && !error && subscribers.length === 0 && (
        <div className="mb-6 p-4 rounded-md bg-yellow-50 border border-yellow-200 text-sm text-yellow-800">
          No subscribers were loaded. If you want to view your real subscribers, set the <code>MAILERLITE_API_KEY</code> in your
          environment (e.g. <code>.env.local</code>) and restart the dev server. As a quick demo you can also load example data:
          <div className="mt-3">
            <button onClick={loadDemo} className="px-3 py-1 rounded-md bg-primary text-primary-foreground">Load demo subscribers</button>
          </div>
        </div>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-6 py-4 font-semibold text-sm">Name</th>
                <th className="text-left px-6 py-4 font-semibold text-sm">Email</th>
                <th className="text-left px-6 py-4 font-semibold text-sm">Profession</th>
                <th className="text-left px-6 py-4 font-semibold text-sm">Status</th>
                <th className="text-left px-6 py-4 font-semibold text-sm">Plan</th>
                <th className="text-left px-6 py-4 font-semibold text-sm">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-muted-foreground">
                    Loading subscribers...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-destructive">
                    {error}
                  </td>
                </tr>
              ) : filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-muted-foreground">
                    No subscribers found.
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((subscriber) => (
                <tr key={subscriber.id} className="border-b border-border hover:bg-muted/30 transition">
                  <td className="px-6 py-4">{subscriber.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{subscriber.email}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{subscriber.profession}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        subscriber.plan === "premium" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {subscriber.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{subscriber.subscribedAt}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        subscriber.status && subscriber.status.toLowerCase() === "active"
                          ? "bg-primary/20 text-primary"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {subscriber.status || "unknown"}
                    </span>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="text-sm text-muted-foreground mt-4">Total: {filteredSubscribers.length} subscribers</p>
    </div>
  )
}
