"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Check } from "lucide-react"
import { useRouter } from "next/navigation"

const plans = [
  {
    name: "Free",
    price: "₦0",
    description: "Perfect to get started",
    features: ["Up to 100 subscribers", "Basic editor", "Monthly sending", "Email support"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "₦5,000",
    period: "/month",
    description: "For growing creators",
    features: [
      "Unlimited subscribers",
      "Advanced editor",
      "Weekly sending",
      "Priority support",
      "Basic analytics",
      "Custom branding",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Business",
    price: "₦15,000",
    period: "/month",
    description: "For professional teams",
    features: [
      "All Pro features",
      "Custom domain",
      "API access",
      "Advanced analytics",
      "Dedicated support",
      "Team collaboration",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
]

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async (planName: string) => {
    setLoading(true)
    try {
      if (planName === "Free") {
        router.push("/auth/signup")
      } else if (planName === "Business") {
        // For business plan, show contact form or redirect to sales
        window.location.href = "mailto:sales@learndrop.com?subject=Business%20Plan%20Inquiry"
      } else {
        const email = prompt("Enter your email address:") || "user@example.com"
        if (email) {
          router.push(`/subscribe/checkout?email=${encodeURIComponent(email)}`)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground">Choose the perfect plan for your newsletter</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`p-8 relative transition ${
                plan.highlighted ? "border-primary bg-primary/5 md:scale-105" : "hover:border-primary"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold rounded-full">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleUpgrade(plan.name)}
                disabled={loading}
                className="w-full"
                variant={plan.highlighted ? "default" : "outline"}
              >
                {loading ? "Processing..." : plan.cta}
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-16 p-8 bg-muted/20 border border-border rounded-lg text-center">
          <h3 className="text-lg font-semibold mb-2">Not sure which plan is right for you?</h3>
          <p className="text-muted-foreground mb-4">Start with our Free plan and upgrade anytime</p>
          <Link href="/auth/signup">
            <Button variant="outline">Get Started Free</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
