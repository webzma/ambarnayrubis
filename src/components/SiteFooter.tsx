import Link from 'next/link'

import type { SiteSetting } from '@/payload-types'

export function SiteFooter({ settings }: { settings: SiteSetting }) {
  return (
    <footer className="mt-24 flex flex-col items-center gap-6 px-6 pt-10 pb-14 text-center text-sm text-muted">
      <p className="uppercase">© {settings.siteName}</p>
      <Link href="/admin" prefetch={false} className="text-xs text-muted/70 transition-colors hover:text-ink">
        Acceso administración
      </Link>
    </footer>
  )
}
