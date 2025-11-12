"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Mail, Users, Zap, BarChart3 } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Mail className="w-6 h-6 text-primary" />
            <span className="text-xl font-semibold">Learn Drop</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/subscribe">
              <Button>Subscribe</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-balance">
            Deep insights on technology and business
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance max-w-2xl mx-auto">
            Subscribe to Learn Drop for curated perspectives on innovation, startups, and the future of technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/subscribe">
              <Button size="lg" className="w-full sm:w-auto">
                Subscribe Today
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <button className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-2">
              View Latest Issue
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center">Why subscribe to Learn Drop?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 border border-border rounded-lg hover:border-primary/50 transition">
              <Mail className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Weekly Insights</h3>
              <p className="text-muted-foreground">
                Thoughtful analysis on emerging trends and what they mean for your business.
              </p>
            </div>
            <div className="p-8 border border-border rounded-lg hover:border-primary/50 transition">
              <Users className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Community</h3>
              <p className="text-muted-foreground">
                Join 500+ subscribers in a thriving community of tech enthusiasts and founders.
              </p>
            </div>
            <div className="p-8 border border-border rounded-lg hover:border-primary/50 transition">
              <Zap className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Actionable</h3>
              <p className="text-muted-foreground">
                Not just theory—practical advice you can apply immediately to your work.
              </p>
            </div>
            <div className="p-8 border border-border rounded-lg hover:border-primary/50 transition">
              <BarChart3 className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Data-Driven</h3>
              <p className="text-muted-foreground">
                Backed by research and real-world examples from the tech industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-center">Simple pricing</h2>
          <p className="text-center text-muted-foreground mb-16">Choose what works best for you</p>
          <div className="max-w-2xl mx-auto">
            <div className="p-8 border border-border rounded-lg hover:border-primary/50 transition text-center">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="text-muted-foreground text-sm mb-6">Essential insights</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">₦0</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3 text-sm justify-center">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  Free newsletters
                </li>
                <li className="flex items-start gap-3 text-sm justify-center">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  Access to archive
                </li>
              </ul>
              <Link href="/subscribe">
                <Button variant="outline" className="w-56 mx-auto bg-transparent">
                  Subscribe Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Learn Drop. All rights reserved.</p>
          <p className="mt-2">Learn Drop is from <a className="text-primary hover:underline" href="https://bitlearning.onrender.com" target="_blank" rel="noopener noreferrer">Bit Learning</a></p>
        </div>
      </footer>
    </div>
  )
}
