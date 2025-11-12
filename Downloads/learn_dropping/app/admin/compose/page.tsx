"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { AlertCircle, Send, Save, Clock } from "lucide-react"

function simplePreviewHtml(md: string) {
  if (!md) return ""
  const escaped = md.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  const withHeadings = escaped.replace(/^# (.*$)/gim, "<h1>$1</h1>").replace(/^## (.*$)/gim, "<h2>$1</h2>")
  const withFormatting = withHeadings.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>").replace(/\*(.*?)\*/gim, "<em>$1</em>")
  const withLinks = withFormatting.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
  return withLinks.split(/\n\n+/).map(p => `<p>${p.replace(/\n/g, "<br />")}</p>`).join("\n")
}

export default function ComposePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [sendType, setSendType] = useState<"now" | "schedule">("now")
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    content: "",
    scheduledTime: "",
    imageData: null as string | null,
    imageName: null as string | null,
    sendViaMailerLite: false,
    mailerLiteGroup: process.env.NEXT_PUBLIC_DEFAULT_MAILERLITE_GROUP_ID || "",
  })

  const [previewMode, setPreviewMode] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setFormData((prev) => ({ ...prev, imageData: result, imageName: file.name }))
    }
    reader.readAsDataURL(file)
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
    return true
  }

  const handleSaveDraft = async () => {
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, status: "draft" }),
      })

      if (!response.ok) throw new Error("Failed to save draft")
      console.log("[v0] Draft saved successfully")
      router.push("/admin/issues")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleSendNow = async () => {
    setError("")
    if (!validateForm()) return

    setLoading(true)

    try {
      const response = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          status: sendType === "now" ? "sent" : "scheduled",
          scheduledTime: sendType === "schedule" ? formData.scheduledTime : null,
        }),
      })

      if (!response.ok) throw new Error("Failed to send newsletter")
      console.log("[v0] Newsletter sent/scheduled successfully")
      router.push("/admin/issues")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Compose Newsletter</h1>

      <Card className="p-8">
        <form className="space-y-6">
          <div>
            <Label htmlFor="title">Issue Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Issue #42: The Future of AI"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">For internal reference</p>
          </div>

          <div>
            <Label htmlFor="subject">Email Subject Line</Label>
            <Input
              id="subject"
              name="subject"
              placeholder="What subscribers will see in their inbox"
              value={formData.subject}
              onChange={handleInputChange}
              className="mt-2"
            />
          </div>

          <div className="flex items-center gap-3 mt-2">
            <input
              id="sendViaMailerLite"
              name="sendViaMailerLite"
              type="checkbox"
              checked={formData.sendViaMailerLite}
              onChange={(e) => setFormData((prev) => ({ ...prev, sendViaMailerLite: e.target.checked }))}
            />
            <Label htmlFor="sendViaMailerLite" className="font-normal cursor-pointer">
              Send via MailerLite
            </Label>
          </div>

          {formData.sendViaMailerLite && (
            <div className="mt-2">
              <Label htmlFor="mailerLiteGroup">MailerLite Group ID</Label>
              <Input
                id="mailerLiteGroup"
                name="mailerLiteGroup"
                placeholder="Group ID (optional - uses DEFAULT if blank)"
                value={formData.mailerLiteGroup}
                onChange={handleInputChange}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">If left blank the configured default group will be used.</p>
            </div>
          )}

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Write your newsletter content here..."
              value={formData.content}
              onChange={handleInputChange}
              rows={12}
              className="mt-2 font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-2">Markdown formatting is supported</p>
          </div>

          <div>
            <Label htmlFor="image">Optional hero image (will be embedded)</Label>
            <input id="image" name="image" type="file" accept="image/*" onChange={handleFileChange} className="mt-2" />
            {formData.imageData && (
              <div className="mt-3">
                <p className="text-xs text-muted-foreground">Preview:</p>
                <img src={formData.imageData} alt="preview" className="max-w-full rounded-md border mt-2" />
              </div>
            )}
          </div>

          {/* Send Options */}
          <div className="border-t border-border pt-6">
            <Label className="text-base font-semibold mb-4 block">When to send</Label>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="send-now-admin"
                  name="sendType"
                  value="now"
                  checked={sendType === "now"}
                  onChange={(e) => setSendType(e.target.value as "now")}
                  className="w-4 h-4"
                />
                <Label htmlFor="send-now-admin" className="font-normal cursor-pointer">
                  Send immediately to all subscribers
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="send-schedule-admin"
                  name="sendType"
                  value="schedule"
                  checked={sendType === "schedule"}
                  onChange={(e) => setSendType(e.target.value as "schedule")}
                  className="w-4 h-4"
                />
                <Label htmlFor="send-schedule-admin" className="font-normal cursor-pointer">
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
                    onChange={handleInputChange}
                    className="mt-2"
                  />
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm flex gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {/* Preview toggle */}
          <div className="pt-4">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={previewMode} onChange={() => setPreviewMode((v) => !v)} />
              <span className="text-sm">Preview</span>
            </label>
          </div>

          {previewMode && (
            <div className="mt-4 p-4 border rounded-lg bg-white">
              <h3 className="text-lg font-semibold mb-2">{formData.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{formData.subject}</p>
              {formData.imageData && <img src={formData.imageData} alt="hero" className="max-w-full mb-4 rounded" />}
              <div className="prose max-w-full" dangerouslySetInnerHTML={{ __html: simplePreviewHtml(formData.content) }} />
            </div>
          )}

          <div className="flex gap-4 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              disabled={loading}
              className="flex-1 bg-transparent"
            >
              <Save className="w-4 h-4 mr-2" />
              Save as Draft
            </Button>
            <Button type="button" onClick={handleSendNow} disabled={loading} className="flex-1">
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
        </form>
      </Card>
    </div>
  )
}
