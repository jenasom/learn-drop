import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import RemoveDevIcon from '@/components/remove-dev-icon'

// export const metadata: Metadata = {
//   title: 'Learn Drop',
//   description: 'Created with v0',
//   generator: 'v0.app',
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
  {/* Load Roboto from Google Fonts at runtime (user request) */}
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <RemoveDevIcon />
        <Analytics />
      </body>
    </html>
  )
}
