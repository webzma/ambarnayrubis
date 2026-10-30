import Link from 'next/link'

import type { SiteSetting } from '@/payload-types'
import { SearchToggle } from './SearchToggle'
import { SocialLinks } from './SocialLinks'

/** Thin top bar: social links on the left, gallery search on the right. */
export function SiteTopBar({ settings, query }: { settings: SiteSetting; query?: string }) {
  const hasSocials = Boolean(settings.facebook || settings.instagram || settings.tiktok)

  return (
    <header className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 md:px-8">
      {hasSocials ? (
        <SocialLinks settings={settings} />
      ) : (
        <Link href="/" className="heading text-xs">
          {settings.siteName}
        </Link>
      )}
      <SearchToggle initial={query} />
    </header>
  )
}
