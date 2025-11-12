"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { XCircle, Mail, ArrowLeft } from "lucide-react"

export default function PaymentErrorPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || "your email"

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-destructive" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
        <p className="text-muted-foreground mb-8">
          We couldn't process your payment. Please check your card details and try again.
        </p>

        <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-muted-foreground mb-1">Issue with</p>
          <p className="font-semibold flex items-center gap-2">
            <Mail className="w-4 h-4" />
            {email}
          </p>
        </div>

        <div className="space-y-3 mb-8 text-left">
          <div className="text-sm">
            <p className="font-medium mb-1">Why this might have happened:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Insufficient funds on your card</li>
              <li>Incorrect card details entered</li>
              <li>Card not authorized for online transactions</li>
              <li>Temporary payment processor issue</li>
            </ul>
          </div>
        </div>

        <div className="space-y-2">
          <Link href="/subscribe/checkout" className="block">
            <Button className="w-full">Try Again</Button>
          </Link>
          <Link href="/" className="block">
            <Button variant="outline" className="w-full bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          Need help? Contact our support team at support@learndrop.com
        </p>
      </Card>
    </div>
  )
}
