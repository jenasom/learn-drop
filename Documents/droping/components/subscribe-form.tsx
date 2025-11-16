"use client"

import type React from "react"

import { useState } from "react"
import { Mail, CheckCircle, AlertCircle, Loader } from "lucide-react"

export function SubscribeForm() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Subscription failed")
      }

      setStatus("success")
      setMessage("Thanks for subscribing! Check your email.")
      setEmail("")
      setName("")

      setTimeout(() => {
        setStatus("idle")
        setMessage("")
      }, 5000)
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "Something went wrong")
      setTimeout(() => setStatus("idle"), 5000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              disabled={status === "loading"}
            />
          </div>
          <div className="flex-1">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-border bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              disabled={status === "loading"}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="w-full button-primary flex items-center justify-center gap-2 text-sm md:text-base disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {status === "loading" ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Subscribing...
            </>
          ) : status === "success" ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Subscribed!
            </>
          ) : (
            <>
              <Mail className="w-4 h-4" />
              Subscribe
            </>
          )}
        </button>

        {message && (
          <div
            className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
              status === "success"
                ? "bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-400"
                : "bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            {status === "success" ? (
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            )}
            <p>{message}</p>
          </div>
        )}
      </div>
    </form>
  )
}
