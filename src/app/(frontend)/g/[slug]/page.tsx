import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { GalleryAccessForm } from '@/components/GalleryAccessForm'
import { GalleryView } from '@/components/GalleryView'
import { Photo } from '@/components/Photo'
import { getSettings } from '@/lib/content'
import { getGalleryBySlug, hasGalleryAccess, isExpired } from '@/lib/galleries'
import { privatePhotoView } from '@/lib/photo-view'

type Props = { params: Promise<{ slug: string }> }

export const metadata: Metadata = { robots: { index: false, follow: false } }

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : null

function GalleryHeader({ siteName }: { siteName: string }) {
  return (
    <header className="absolute inset-x-0 top-0 z-20 px-6 py-6 text-center text-white md:px-10">
      <Link href="/" className="font-serif text-2xl tracking-wide">
        {siteName}
      </Link>
    </header>
  )
}

export default async function ClientGalleryPage({ params }: Props) {
  const { slug } = await params
  const [gallery, settings] = await Promise.all([getGalleryBySlug(slug), getSettings()])
  if (!gallery) notFound()

  const cover = gallery.cover ? await privatePhotoView(gallery.cover) : null
  const date = formatDate(gallery.eventDate)

  const hero = (children?: React.ReactNode) => (
    <section className="relative flex h-svh min-h-[520px] items-center justify-center overflow-hidden bg-ink text-white">
      <GalleryHeader siteName={settings.siteName} />
      {cover && <Photo photo={cover} sizes="100vw" priority className="absolute inset-0 h-full w-full object-cover opacity-80" />}
      <div className="absolute inset-0 bg-black/30" />
      <div className="animate-fade-in relative z-10 px-6 text-center">
        {date && <p className="text-[11px] tracking-[0.4em] uppercase">{date}</p>}
        <h1 className="mt-5 font-serif text-5xl font-light md:text-7xl">{gallery.title}</h1>
        {children}
      </div>
    </section>
  )

  if (isExpired(gallery)) {
    return hero(<p className="mt-8 text-white/80">Esta galería ha expirado. Contáctame si necesitas acceso.</p>)
  }

  if (!(await hasGalleryAccess(gallery))) {
    return (
      <>
        {hero(
          <a href="#acceso" className="btn btn-light mt-10">
            Acceder
          </a>,
        )}
        <section id="acceso" className="px-6 py-24">
          <p className="eyebrow mb-10 text-center">Esta galería es privada</p>
          <GalleryAccessForm slug={gallery.slug!} />
        </section>
      </>
    )
  }

  const photos = await Promise.all(
    gallery.photos.map((photo) => privatePhotoView(photo, { allowDownload: gallery.allowDownloads })),
  )

  return (
    <>
      {hero(
        <a href="#fotos" className="btn btn-light mt-10">
          Ver galería
        </a>,
      )}
      <section id="fotos" className="mx-auto max-w-7xl px-3 pb-10 md:px-10">
        <GalleryView
          slug={gallery.slug!}
          photos={photos}
          allowDownloads={Boolean(gallery.allowDownloads)}
          allowFavorites={Boolean(gallery.allowFavorites)}
        />
      </section>
    </>
  )
}
