import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PhotoGrid } from '@/components/PhotoGrid'
import { asMedia, asMediaList, getAlbumBySlug, getAlbums } from '@/lib/content'
import { publicPhotoView } from '@/lib/photo-view'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

// Prerender existing albums; new ones are rendered on first visit and cached.
export async function generateStaticParams() {
  const albums = await getAlbums()
  return albums.filter((album) => album.slug).map((album) => ({ slug: album.slug! }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const album = await getAlbumBySlug((await params).slug)
  if (!album) return {}
  const cover = asMedia(album.cover)
  return {
    title: album.title,
    description: album.description ?? undefined,
    openGraph: cover?.sizes?.large?.url ? { images: [cover.sizes.large.url] } : undefined,
  }
}

export default async function AlbumPage({ params }: Props) {
  const album = await getAlbumBySlug((await params).slug)
  if (!album) notFound()

  const photos = asMediaList(album.photos).map(publicPhotoView)

  return (
    <section className="mx-auto max-w-7xl px-3 py-20 md:px-10">
      <div className="mx-auto mb-16 max-w-2xl px-3 text-center">
        {album.category && <p className="eyebrow">{album.category}</p>}
        <h1 className="mt-3 font-serif text-5xl">{album.title}</h1>
        {album.description && <p className="mt-6 leading-relaxed whitespace-pre-line text-muted">{album.description}</p>}
      </div>
      <PhotoGrid photos={photos} />
      <div className="mt-20 text-center">
        <Link href="/portafolio" className="btn">
          Ver más galerías
        </Link>
      </div>
    </section>
  )
}
