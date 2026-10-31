import Link from 'next/link'

import { formatDate } from '@/lib/format'
import type { GalleryCard as Card } from '@/lib/galleries'
import { LockIcon } from './icons'
import { RevealImg } from './RevealImg'

export function GalleryCard({ gallery }: { gallery: Card }) {
  const date = formatDate(gallery.eventDate)

  return (
    <Link href={`/g/${gallery.slug}`} className="group block text-center">
      <div className="aspect-[3/2] overflow-hidden bg-line/60">
        {gallery.cover && (
          <RevealImg
            src={gallery.cover.card}
            srcSet={`${gallery.cover.thumb} 480w, ${gallery.cover.card} 1080w`}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            alt={gallery.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-[scale] duration-[1400ms] ease-[var(--ease-soft)] group-hover:scale-[1.04]"
          />
        )}
      </div>
      <h2 className="heading mt-6 flex items-center justify-center gap-2 text-[15px]">
        {gallery.locked && <LockIcon className="h-4 w-4 shrink-0" />}
        {gallery.title}
      </h2>
      {date && <p className="label mt-2.5">{date}</p>}
    </Link>
  )
}
