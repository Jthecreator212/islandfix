import type { Metadata } from 'next'
import '@fontsource-variable/inter'
import '@fontsource-variable/space-grotesk'
import './globals.css'

export const metadata: Metadata = {
  title: 'IslandFix — The Verified Trades Marketplace',
  description: 'Find trusted, verified tradespeople in the Caribbean. Book with confidence.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body bg-[#dde3ea] text-[#1a1a2e] antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
