import { Navigation } from "@/components/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export default async function ArchivePage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    },
  )

  const { data: issues } = await supabase
    .from("newsletter_issues")
    .select("*")
    .order("published_at", { ascending: false })
    .is("published_at", false)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="newsletter-container py-16 md:py-24">
        <div className="space-y-12">
          <div className="space-y-4">
            <h1>Newsletter Archive</h1>
            <p className="text-xl text-muted-foreground">Explore all past issues of Learn Drop</p>
          </div>

          {issues && issues.length > 0 ? (
            <div className="grid gap-6">
              {issues.map((issue) => (
                <div key={issue.id} className="newsletter-card group">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="inline-block px-3 py-1 bg-accent/10 rounded text-accent text-sm font-medium">
                          Issue #{issue.issue_number}
                        </div>
                        <h2 className="text-2xl group-hover:text-accent transition-colors line-clamp-2">
                          {issue.title}
                        </h2>
                        <p className="text-muted-foreground line-clamp-2">{issue.description}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Published{" "}
                      {new Date(issue.published_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="newsletter-card text-center py-12">
              <p className="text-muted-foreground text-lg">No issues published yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
