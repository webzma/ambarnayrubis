import Link from 'next/link'

import type { Album } from '@/payload-types'
import { categoryLabel } from '@/lib/categories'
import { asMedia } from '@/lib/content'
import { publicPhotoView } from '@/lib/photo-view'
import { Photo } from './Photo'

type Props = { album: Pick<Album, 'title' | 'slug' | 'category' | 'cover'> }

export function AlbumCard({ album }: Props) {
  const cover = asMedia(album.cover)

  return (
    <Link href={`/portafolio/${album.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-line/40">
        {cover && (
          <Photo
            photo={publicPhotoView(cover)}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="h-full w-full object-cover transition duration-[1200ms] ease-[var(--ease-soft)] group-hover:scale-[1.05]"
          />
        )}
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/45 via-black/0 to-black/0 p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <span className="translate-y-2 text-[11px] tracking-[0.25em] text-white uppercase transition-transform duration-500 group-hover:translate-y-0">
            Ver historia →
          </span>
        </div>
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-4 border-b border-line pb-4">
        <h3 className="font-serif text-2xl leading-tight">{album.title}</h3>
        {album.category && <p className="eyebrow shrink-0">{categoryLabel(album.category)}</p>}
      </div>
    </Link>
  )
}
