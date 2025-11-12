"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Send, Save, Clock, AlertCircle } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ComposePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [sendType, setSendType] = useState<"now" | "schedule">("now")
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    subject: "",
    scheduledTime: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Please enter a newsletter title")
      return false
    }
    if (!formData.subject.trim()) {
      setError("Please enter an email subject")
      return false
    }
    if (!formData.content.trim()) {
      setError("Please enter newsletter content")
      return false
    }
    if (sendType === "schedule" && !formData.scheduledTime) {
      setError("Please select a time to schedule the newsletter")
      return false
    }
    return true
  }

  const handleSaveDraft = async () => {
    setError("")
    setLoading(true)
    try {
      const response = await fetch(`/api/newsletters/${id}/issues`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ ...formData, status: "draft" }),
      })

      if (!response.ok) throw new Error("Failed to save draft")

      console.log("[v0] Draft saved successfully")
      alert("Draft saved successfully!")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save draft")
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async () => {
    setError("")
    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/newsletters/${id}/issues`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          ...formData,
          status: sendType === "now" ? "published" : "scheduled",
          scheduledTime: sendType === "schedule" ? formData.scheduledTime : null,
        }),
      })

      if (!response.ok) throw new Error("Failed to publish newsletter")

      console.log("[v0] Newsletter published successfully")
      router.push(`/dashboard/newsletters/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish newsletter")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <main className="flex-1 md:ml-64">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link
            href={`/dashboard/newsletters/${id}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Newsletter
          </Link>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Compose Issue</h1>
            <p className="text-muted-foreground">Create and send your next newsletter</p>
          </div>

          <Card className="p-8">
            <div className="space-y-6">
              <div>
                <Label htmlFor="title">Issue Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Weekly Tech Roundup #42"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">For internal reference only</p>
              </div>

              <div>
                <Label htmlFor="subject">Email Subject Line</Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="e.g., This week in tech: AI breakthroughs"
                  value={formData.subject}
                  onChange={handleChange}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">What subscribers will see in their inbox</p>
              </div>

              {/* Editor with Tabs */}
              <div>
                <Label htmlFor="content">Newsletter Content</Label>
                <Tabs defaultValue="edit" className="w-full mt-2">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>

                  <TabsContent value="edit" className="mt-4">
                    <textarea
                      id="content"
                      name="content"
                      placeholder="Write your newsletter content here..."
                      value={formData.content}
                      onChange={handleChange}
                      rows={15}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Supports Markdown formatting. Tip: Use # for headings, ** for bold, and links with [text](url)
                    </p>
                  </TabsContent>

                  <TabsContent value="preview" className="mt-4">
                    <div className="border border-border rounded-md p-6 bg-card min-h-96">
                      {formData.subject && (
                        <div className="mb-6 pb-4 border-b border-border">
                          <p className="text-xs text-muted-foreground mb-1">Subject:</p>
                          <p className="font-semibold text-lg">{formData.subject}</p>
                        </div>
                      )}
                      {formData.content ? (
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <p className="whitespace-pre-wrap text-foreground">{formData.content}</p>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Start typing to see preview...</p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Send Options */}
              <div className="border-t border-border pt-6">
                <Label className="text-base font-semibold mb-4 block">When to send</Label>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="send-now"
                      name="sendType"
                      value="now"
                      checked={sendType === "now"}
                      onChange={(e) => setSendType(e.target.value as "now")}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="send-now" className="font-normal cursor-pointer">
                      Send immediately to all subscribers
                    </Label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="send-schedule"
                      name="sendType"
                      value="schedule"
                      checked={sendType === "schedule"}
                      onChange={(e) => setSendType(e.target.value as "schedule")}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="send-schedule" className="font-normal cursor-pointer">
                      Schedule for later
                    </Label>
                  </div>

                  {sendType === "schedule" && (
                    <div className="ml-7 space-y-2">
                      <Label htmlFor="scheduledTime">Scheduled Date & Time</Label>
                      <Input
                        id="scheduledTime"
                        name="scheduledTime"
                        type="datetime-local"
                        value={formData.scheduledTime}
                        onChange={handleChange}
                        className="mt-2"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={loading}
                  className="flex-1 bg-transparent"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save as Draft
                </Button>
                <Button onClick={handlePublish} disabled={loading} className="flex-1">
                  {sendType === "schedule" ? (
                    <>
                      <Clock className="w-4 h-4 mr-2" />
                      {loading ? "Scheduling..." : "Schedule Newsletter"}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {loading ? "Sending..." : "Send Now"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
