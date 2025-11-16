"use client"

import type React from "react"

import { useState } from "react"
import { Send, Loader, AlertCircle, CheckCircle } from "lucide-react"

interface AdminFormProps {
  onSuccess: () => void
}

export function AdminForm({ onSuccess }: AdminFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    issueNumber: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")

    try {
      const response = await fetch("/api/admin/create-issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create issue")
      }

      setStatus("success")
      setMessage("Newsletter issue created successfully!")
      setFormData({ title: "", description: "", content: "", issueNumber: "" })

      setTimeout(() => {
        setStatus("idle")
        setMessage("")
        onSuccess()
      }, 2000)
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "Something went wrong")
      setTimeout(() => setStatus("idle"), 5000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Issue Number</label>
        <input
          type="number"
          value={formData.issueNumber}
          onChange={(e) => setFormData({ ...formData, issueNumber: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Description</label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Content (HTML)</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent h-48 font-mono text-sm"
          required
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full button-primary flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {status === "loading" ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Create & Send Newsletter
          </>
        )}
      </button>

      {message && (
        <div
          className={`flex items-start gap-2 p-4 rounded-lg ${
            status === "success"
              ? "bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-400"
          }`}
        >
          {status === "success" ? (
            <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          )}
          <p>{message}</p>
        </div>
      )}
    </form>
  )
}
