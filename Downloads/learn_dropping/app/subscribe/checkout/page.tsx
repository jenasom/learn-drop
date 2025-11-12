"use client"

import type React from "react"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Lock, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    cardholderName: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === "cardNumber") {
      setCardData((prev) => ({ ...prev, [name]: value.replace(/\s/g, "").slice(0, 16) }))
    } else if (name === "expiryDate") {
      setCardData((prev) => ({ ...prev, [name]: value.slice(0, 5) }))
    } else if (name === "cvc") {
      setCardData((prev) => ({ ...prev, [name]: value.slice(0, 4) }))
    } else {
      setCardData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          amount: 1000,
          reference: `TXN-${Date.now()}`,
          status: "success",
        }),
      })

      if (!response.ok) {
        throw new Error("Payment processing failed")
      }

      // Redirect to success page
      router.push(`/payment/success?email=${encodeURIComponent(email)}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <Link href="/subscribe" className="flex items-center gap-2 text-muted-foreground hover:text-foreground w-fit">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex items-center justify-center px-4 py-12 min-h-[calc(100vh-100px)]">
        <Card className="w-full max-w-md p-8">
          <h1 className="text-3xl font-bold mb-2">Complete your purchase</h1>
          <p className="text-muted-foreground mb-8">Premium plan • ₦1,000/month</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order Summary */}
            <div className="border border-border rounded-lg p-4 bg-muted/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm">Premium Subscription</span>
                <span className="font-semibold">₦1,000</span>
              </div>
              <div className="border-t border-border pt-4 flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="text-lg font-bold">₦1,000</span>
              </div>
            </div>

            {/* Email Confirmation */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">Subscription will be billed to</p>
              <p className="font-medium text-sm">{email}</p>
            </div>

            {/* Card Details */}
            <div>
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                name="cardholderName"
                placeholder="John Doe"
                value={cardData.cardholderName}
                onChange={handleInputChange}
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardData.cardNumber.replace(/(.{4})/g, "$1 ").trim()}
                onChange={handleInputChange}
                required
                className="mt-2 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={cardData.expiryDate}
                  onChange={handleInputChange}
                  required
                  className="mt-2 font-mono"
                />
              </div>
              <div>
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  name="cvc"
                  placeholder="123"
                  value={cardData.cvc}
                  onChange={handleInputChange}
                  required
                  className="mt-2 font-mono"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Payment Button */}
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              <Lock className="w-4 h-4 mr-2" />
              {loading ? "Processing..." : `Pay ₦1,000`}
            </Button>

            {/* Security Notice */}
            <p className="text-xs text-muted-foreground text-center">
              Your payment information is secure and encrypted. We accept all major credit cards.
            </p>
          </form>
        </Card>
      </div>
    </div>
  )
}
