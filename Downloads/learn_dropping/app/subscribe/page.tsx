"use client"

import type React from "react"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft } from "lucide-react"

function SubscribeForm() {
  const searchParams = useSearchParams()
  const planParam = searchParams.get("plan") || "free"

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profession: "",
    plan: "free",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePlanSelect = (plan: string) => {
    // Only free plan is available — proceed to step 2
    setFormData((prev) => ({ ...prev, plan: 'free' }))
    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Subscription failed")
      }

      // Success - always redirect to confirmation for free plan
      window.location.href = `/subscribe/confirmation?email=${encodeURIComponent(formData.email)}`
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground w-fit">
            <ChevronLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {step === 1 ? (
            // Plan Selection
            <div>
              <h1 className="text-4xl font-bold mb-2 text-center">Choose your plan</h1>
              <p className="text-center text-muted-foreground mb-12">Step 1 of 2</p>

              <div className="grid grid-cols-1 gap-6">
                <button
                  onClick={() => handlePlanSelect("free")}
                  className="p-6 border-2 border-border rounded-lg hover:border-primary transition text-left"
                >
                  <h3 className="text-2xl font-bold mb-2">Free</h3>
                  <p className="text-muted-foreground mb-4">₦0/month</p>
                  <p className="text-sm text-muted-foreground">Get curated newsletters every week</p>
                </button>
              </div>
            </div>
          ) : (
            // Information Collection
            <div>
              <h1 className="text-4xl font-bold mb-2 text-center">Your information</h1>
              <p className="text-center text-muted-foreground mb-12">Step 2 of 2</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="profession">Profession</Label>
                  <select
                    id="profession"
                    name="profession"
                    value={formData.profession}
                    onChange={handleInputChange}
                    required
                    className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select your profession</option>
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="Designer">Designer</option>
                    <option value="Founder">Founder</option>
                    <option value="Investor">Investor</option>
                    <option value="Marketer">Marketer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {error && <p className="text-destructive text-sm">{error}</p>}

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1 relative">
                    <span className={`inline-flex items-center justify-center gap-3 w-full ${loading ? "opacity-100" : ""}`}>
                      {loading ? (
                        <>
                          <Spinner className="w-5 h-5 text-primary animate-spin" />
                          <span>Subscribing...</span>
                        </>
                      ) : formData.plan === "premium" ? (
                        "Continue to Payment"
                      ) : (
                        "Subscribe"
                      )}
                    </span>
                  </Button>
                </div>
                {loading && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-48 p-6 bg-white/90 backdrop-blur rounded-xl flex flex-col items-center gap-4">
                      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-indigo-600 shadow-lg">
                        <Spinner className="w-10 h-10 text-white animate-spin" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-semibold">Finishing up</h3>
                        <p className="text-sm text-muted-foreground">We'll redirect you to the confirmation page shortly.</p>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SubscribePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SubscribeForm />
    </Suspense>
  )
}
