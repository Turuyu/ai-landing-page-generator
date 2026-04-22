import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Landing Page Generator',
  description: 'Generate beautiful landing pages from Markdown'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}