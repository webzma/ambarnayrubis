import Link from 'next/link'

import type { Album } from '@/payload-types'
import { asMedia } from '@/lib/content'
import { publicPhotoView } from '@/lib/photo-view'
import { Photo } from './Photo'

type Props = { album: Pick<Album, 'title' | 'slug' | 'category' | 'cover'> }

export function AlbumCard({ album }: Props) {
  const cover = asMedia(album.cover)

  return (
    <Link href={`/portafolio/${album.slug}`} className="group block">
      <div className="aspect-[4/5] overflow-hidden bg-line/40">
        {cover && (
          <Photo
            photo={publicPhotoView(cover)}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
          />
        )}
      </div>
      <div className="mt-5 text-center">
        {album.category && <p className="eyebrow">{album.category}</p>}
        <h3 className="mt-2 font-serif text-2xl">{album.title}</h3>
      </div>
    </Link>
  )
}
