"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, Mail, ArrowRight } from "lucide-react"

export default function ConfirmationPage() {
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

        <h1 className="text-3xl font-bold mb-2">Almost done — confirm your email</h1>
        <p className="text-muted-foreground mb-6">
          Thanks for subscribing to Learn Drop. To start receiving our newsletter, please check your inbox and click the confirmation link we just sent.
        </p>

        <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-muted-foreground mb-1">Confirmation sent to</p>
          <p className="font-semibold flex items-center gap-2">
            <Mail className="w-4 h-4" />
            {email}
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-left text-sm">
              <p className="font-medium">Check your inbox</p>
              <p className="text-muted-foreground">Open the confirmation email and click the "Confirm subscription" link to complete signup. If you don't see it, check your spam folder.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-left text-sm">
              <p className="font-medium">Next issue coming soon</p>
              <p className="text-muted-foreground">Our newsletter goes out every week</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full bg-transparent">
              Back to Home
            </Button>
          </Link>
          <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@learn-drop.example.com"}?subject=Resend%20confirmation&body=Please%20resend%20my%20confirmation%20email`} className="flex-1">
            <Button className="w-full">
              Resend confirmation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      </Card>
    </div>
  )
}
