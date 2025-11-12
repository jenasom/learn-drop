import { Card } from "@/components/ui/card"
import Link from "next/link"

interface NewsletterCardProps {
  id: string
  title: string
  description?: string
  subscriberCount: number
  isPublished: boolean
  createdAt: string
}

export function NewsletterCard({
  id,
  title,
  description,
  subscriberCount,
  isPublished,
  createdAt,
}: NewsletterCardProps) {
  return (
    <Link href={`/dashboard/newsletters/${id}`}>
      <Card className="p-6 hover:border-primary transition cursor-pointer h-full">
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-semibold line-clamp-2">{title}</h3>
          <div
            className={`text-xs px-2 py-1 rounded-full ${
              isPublished ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            }`}
          >
            {isPublished ? "Published" : "Draft"}
          </div>
        </div>
        {description && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{subscriberCount} subscribers</span>
          <span className="text-muted-foreground text-xs">{new Date(createdAt).toLocaleDateString()}</span>
        </div>
      </Card>
    </Link>
  )
}
