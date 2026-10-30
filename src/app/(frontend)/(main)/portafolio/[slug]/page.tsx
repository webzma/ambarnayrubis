import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Photo } from '@/components/Photo'
import { PhotoGrid } from '@/components/PhotoGrid'
import { categoryLabel } from '@/lib/categories'
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
  const cover = asMedia(album.cover)

  return (
    <>
      <section className="relative flex h-[70svh] min-h-[460px] items-end overflow-hidden bg-ink text-white">
        {cover && (
          <Photo photo={publicPhotoView(cover)} sizes="100vw" priority className="animate-ken-burns absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
        <div className="animate-rise relative mx-auto w-full max-w-7xl px-6 pb-14 md:px-10 md:pb-20">
          <Link href="/portafolio" className="link text-[11px] tracking-[0.25em] text-white/80 uppercase">
            ← Portafolio
          </Link>
          {album.category && (
            <p className="mt-8 text-[11px] tracking-[0.35em] text-white/75 uppercase">{categoryLabel(album.category)}</p>
          )}
          <h1 className="mt-3 max-w-4xl font-serif text-5xl leading-none font-light md:text-7xl">{album.title}</h1>
          <p className="mt-6 text-[11px] tracking-[0.25em] text-white/70 uppercase">{photos.length} fotografías</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 pt-16 pb-28 md:px-10 md:pt-24">
        {album.description && (
          <p className="mx-auto mb-16 max-w-2xl px-3 text-center font-serif text-2xl leading-relaxed font-light whitespace-pre-line italic md:mb-20 md:text-3xl">
            {album.description}
          </p>
        )}
        <PhotoGrid photos={photos} />
        <div className="mt-20 flex flex-col items-center gap-6 text-center">
          <p className="font-serif text-3xl font-light">¿Te imaginas tu historia así?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/contacto" className="btn btn-solid">
              Reservar sesión
            </Link>
            <Link href="/portafolio" className="btn">
              Ver más galerías
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
