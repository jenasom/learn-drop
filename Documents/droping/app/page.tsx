import { SubscribeForm } from "@/components/subscribe-form"
import { Navigation } from "@/components/navigation"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="newsletter-container pt-20 md:pt-32 pb-16 md:pb-24">
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-accent font-medium text-sm md:text-base tracking-wide uppercase">
              Welcome to Learn Drop
            </p>
            <h1 className="text-foreground">Curated Tech Insights Weekly</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Get the latest in technology, artificial intelligence, and software development delivered to your inbox
              every week. Stay ahead with handpicked insights from industry leaders.
            </p>
          </div>

          {/* Subscribe Form */}
          <div className="pt-8">
            <SubscribeForm />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-12 border-t border-border">
            <div className="space-y-2">
              <p className="text-2xl md:text-3xl font-bold text-accent">2.5K+</p>
              <p className="text-sm md:text-base text-muted-foreground">Active Subscribers</p>
            </div>
            <div className="space-y-2">
              <p className="text-2xl md:text-3xl font-bold text-accent">48+</p>
              <p className="text-sm md:text-base text-muted-foreground">Issues Published</p>
            </div>
            <div className="space-y-2">
              <p className="text-2xl md:text-3xl font-bold text-accent">98%</p>
              <p className="text-sm md:text-base text-muted-foreground">Open Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Issues Section */}
      <section className="bg-secondary/30 border-y border-border">
        <div className="newsletter-container py-16 md:py-24">
          <div className="space-y-12">
            <div className="space-y-2">
              <h2>Recent Issues</h2>
              <p className="text-lg text-muted-foreground">Explore our latest newsletter editions</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Featured Issue 1 */}
              <Link href="/archive" className="newsletter-card group">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 bg-accent/10 rounded text-accent text-sm font-medium">
                    Issue #48
                  </div>
                  <h3 className="group-hover:text-accent transition-colors">
                    The Future of AI in Software Development
                  </h3>
                  <p className="text-muted-foreground">
                    Exploring how AI is transforming the way developers write, test, and deploy code. With insights from
                    leading technologists.
                  </p>
                  <p className="text-sm text-muted-foreground">Published Nov 1, 2025</p>
                </div>
              </Link>

              {/* Featured Issue 2 */}
              <Link href="/archive" className="newsletter-card group">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 bg-accent/10 rounded text-accent text-sm font-medium">
                    Issue #47
                  </div>
                  <h3 className="group-hover:text-accent transition-colors">Web Performance Optimization Strategies</h3>
                  <p className="text-muted-foreground">
                    Learn the latest techniques for building faster web applications. From caching strategies to code
                    splitting best practices.
                  </p>
                  <p className="text-sm text-muted-foreground">Published Oct 25, 2025</p>
                </div>
              </Link>
            </div>

            <div className="text-center pt-6">
              <Link href="/archive" className="button-primary inline-block">
                View All Issues
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="newsletter-container py-16 md:py-24">
        <div className="text-center space-y-6">
          <h2>Never miss an update</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Subscribe now to get weekly tech insights delivered to your inbox. Cancel anytime.
          </p>
          <div className="pt-4">
            <SubscribeForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/20">
        <div className="newsletter-container py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>Learn Drop © 2025. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/archive" className="hover:text-foreground transition-colors">
                Archive
              </Link>
              <a href="mailto:hello@learndrop.dev" className="hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
