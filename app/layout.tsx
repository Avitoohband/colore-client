import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CoLore - Collaborative Storytelling Game',
  description: 'A local multiplayer storytelling game where players create stories together',
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
