"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateNewsletterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    category: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Auto-generate slug from title
    if (name === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/newsletters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to create newsletter")

      const data = await response.json()
      router.push(`/dashboard/newsletters/${data.newsletter.id}`)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-2">Create a new newsletter</h1>
          <p className="text-muted-foreground mb-8">Set up the basics of your newsletter</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Newsletter Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Tech Weekly"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">This is the name of your newsletter</p>
            </div>

            <div>
              <Label htmlFor="slug">Newsletter Slug</Label>
              <Input
                id="slug"
                name="slug"
                placeholder="tech-weekly"
                value={formData.slug}
                onChange={handleChange}
                required
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">Used in your newsletter URL</p>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
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

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe what your newsletter is about..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="mt-2 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">This will be shown to potential subscribers</p>
            </div>

            <div className="flex gap-4">
              <Link href="/dashboard" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  Cancel
                </Button>
              </Link>
              <Button className="flex-1" type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Newsletter"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
