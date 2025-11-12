"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Download } from "lucide-react"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || "your email"

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground mb-6">
          Thank you for upgrading to Premium. Your subscription is now active.
        </p>

        <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-muted-foreground mb-2">Premium Subscription Activated</p>
          <p className="font-semibold text-lg">₦1,000/month</p>
          <p className="text-xs text-muted-foreground mt-2">Confirmation sent to {email}</p>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-left text-sm">
              <p className="font-medium">Unlimited newsletters</p>
              <p className="text-muted-foreground">Create and send as many as you want</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-left text-sm">
              <p className="font-medium">Advanced analytics</p>
              <p className="text-muted-foreground">Track opens, clicks, and engagement</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-left text-sm">
              <p className="font-medium">Priority support</p>
              <p className="text-muted-foreground">Get help when you need it most</p>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <Button className="w-full" asChild>
            <Link href="/dashboard">
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" className="w-full bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          A confirmation email has been sent to <span className="font-medium">{email}</span>
        </p>
      </Card>
    </div>
  )
}
