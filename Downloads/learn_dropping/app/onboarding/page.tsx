"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    newsletterName: "",
    category: "",
    description: "",
    frequency: "weekly",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    if (step === 1) {
      setStep(2)
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/newsletters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to create newsletter")

      router.push("/dashboard")
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            {[1, 2].map((s) => (
              <div key={s} className={`h-1 flex-1 rounded-full transition ${s <= step ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
          <h1 className="text-3xl font-bold mb-2">{step === 1 ? "Let's create your newsletter" : "Tell us more"}</h1>
          <p className="text-muted-foreground">
            {step === 1 ? "Start by giving your newsletter a name and category" : "Help us understand your content"}
          </p>
        </div>

        <div className="space-y-6">
          {step === 1 ? (
            <>
              <div>
                <Label htmlFor="name">Newsletter Name</Label>
                <Input
                  id="name"
                  name="newsletterName"
                  placeholder="e.g., Tech Weekly"
                  value={formData.newsletterName}
                  onChange={handleChange}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-2 w-full px-3 py-2 border border-border rounded-md bg-background"
                >
                  <option value="">Select a category</option>
                  <option value="technology">Technology</option>
                  <option value="business">Business</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="education">Education</option>
                  <option value="finance">Finance</option>
                  <option value="health">Health</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <Label htmlFor="description">Newsletter Description</Label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="What is your newsletter about?"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="mt-2 w-full px-3 py-2 border border-border rounded-md bg-background"
                />
              </div>
              <div>
                <Label htmlFor="frequency">Publishing Frequency</Label>
                <select
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  className="mt-2 w-full px-3 py-2 border border-border rounded-md bg-background"
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="daily">Daily</option>
                </select>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-4 mt-8">
          {step === 2 && (
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep(1)}>
              Back
            </Button>
          )}
          <Button className="flex-1" onClick={handleSubmit} disabled={loading}>
            {step === 1 ? "Next" : loading ? "Creating..." : "Create Newsletter"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
