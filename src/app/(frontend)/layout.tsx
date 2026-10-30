import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import React from 'react'

import { SiteFooter } from '@/components/SiteFooter'
import { getSettings } from '@/lib/content'
import './styles.css'

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-display',
})
const body = Jost({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-body' })

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    metadataBase: process.env.NEXT_PUBLIC_SERVER_URL ? new URL(process.env.NEXT_PUBLIC_SERVER_URL) : undefined,
    title: { default: `${settings.siteName} | ${settings.tagline ?? 'Fotografía'}`, template: `%s | ${settings.siteName}` },
    description: settings.description ?? undefined,
    openGraph: { siteName: settings.siteName, type: 'website' },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()

  return (
    <html lang="es" className={`${display.variable} ${body.variable}`}>
      <body className="flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>
        <SiteFooter settings={settings} />
      </body>
    </html>
  )
}
