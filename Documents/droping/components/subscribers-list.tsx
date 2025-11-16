"use client"

import { useState, useEffect } from "react"
import { Users, Mail, Loader } from "lucide-react"

interface Subscriber {
  id: string
  email: string
  name: string
  subscribed_at: string
  is_active: boolean
}

export function SubscribersList() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSubscribers() {
      try {
        const response = await fetch("/api/admin/subscribers")
        const data = await response.json()
        setSubscribers(data)
      } catch (error) {
        console.error("Error loading subscribers:", error)
      } finally {
        setLoading(false)
      }
    }
    loadSubscribers()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="w-6 h-6 text-accent" />
        <h2 className="text-2xl font-bold">Active Subscribers: {subscribers.length}</h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-6 h-6 animate-spin text-accent" />
        </div>
      ) : subscribers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50 border border-border rounded-t-lg">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Subscribed</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 text-sm">{sub.name || "Anonymous"}</td>
                  <td className="px-4 py-3 text-sm flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    {sub.email}
                  </td>
                  <td className="px-4 py-3 text-sm">{new Date(sub.subscribed_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        sub.is_active
                          ? "bg-green-100 text-green-900 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-gray-100 text-gray-900 dark:bg-gray-900/20 dark:text-gray-400"
                      }`}
                    >
                      {sub.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="newsletter-card text-center py-12">
          <p className="text-muted-foreground text-lg">No subscribers yet</p>
        </div>
      )}
    </div>
  )
}
