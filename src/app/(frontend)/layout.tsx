import type { Metadata } from 'next'
import { Lato, Raleway } from 'next/font/google'
import React from 'react'

import { SiteFooter } from '@/components/SiteFooter'
import { getSettings } from '@/lib/content'
import './styles.css'

const heading = Raleway({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-heading' })
const body = Lato({ subsets: ['latin'], weight: ['300', '400', '700'], variable: '--font-body' })

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    metadataBase: process.env.NEXT_PUBLIC_SERVER_URL ? new URL(process.env.NEXT_PUBLIC_SERVER_URL) : undefined,
    title: { default: `${settings.siteName} | ${settings.tagline ?? 'Fotografía'}`, template: `%s | ${settings.siteName}` },
    description: settings.description ?? settings.intro ?? undefined,
    openGraph: { siteName: settings.siteName, type: 'website' },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()

  return (
    <html lang="es" className={`${heading.variable} ${body.variable}`}>
      <body className="flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>
        <SiteFooter settings={settings} />
      </body>
    </html>
  )
}
