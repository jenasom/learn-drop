"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft, Lock, Bell, CreditCard } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john@example.com",
    notifications: true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSave = async () => {
    try {
      const response = await fetch("/api/user/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert("Settings saved successfully!")
      }
    } catch (err) {
      console.error(err)
      alert("Failed to save settings")
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar userName={formData.name} />

      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <h1 className="text-4xl font-bold mb-12">Settings</h1>

          <div className="space-y-6">
            {/* Profile Settings */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="font-semibold">JD</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Profile</h2>
                  <p className="text-sm text-muted-foreground">Manage your account information</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} className="mt-2" />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-2"
                  />
                </div>

                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </Card>

            {/* Billing */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-5 h-5 text-primary" />
                <div>
                  <h2 className="text-lg font-semibold">Billing</h2>
                  <p className="text-sm text-muted-foreground">Manage your subscription and payments</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Current Plan</p>
                  <div className="p-4 border border-border rounded-lg bg-muted/20">
                    <p className="font-semibold">Free Plan</p>
                    <p className="text-sm text-muted-foreground">Up to 100 subscribers</p>
                  </div>
                </div>

                <Link href="/pricing">
                  <Button variant="outline" className="w-full bg-transparent">
                    Upgrade Plan
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Notifications */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-5 h-5 text-primary" />
                <div>
                  <h2 className="text-lg font-semibold">Notifications</h2>
                  <p className="text-sm text-muted-foreground">Control how you receive updates</p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="notifications"
                    checked={formData.notifications}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Email notifications for new subscribers</span>
                </label>
              </div>
            </Card>

            {/* Security */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-5 h-5 text-primary" />
                <div>
                  <h2 className="text-lg font-semibold">Security</h2>
                  <p className="text-sm text-muted-foreground">Manage your account security</p>
                </div>
              </div>

              <Button variant="outline">Change Password</Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
