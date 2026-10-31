import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { GalleryAccessForm } from '@/components/GalleryAccessForm'
import { GalleryView } from '@/components/GalleryView'
import { Photo } from '@/components/Photo'
import { asMedia, getSettings } from '@/lib/content'
import { formatDate } from '@/lib/format'
import { getGalleryBySlug, hasGalleryAccess, isExpired } from '@/lib/galleries'
import { privatePhotoView } from '@/lib/photo-view'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const gallery = await getGalleryBySlug((await params).slug)
  return { title: gallery?.title, robots: { index: false, follow: false } }
}

export default async function ClientGalleryPage({ params }: Props) {
  const { slug } = await params
  const [gallery, settings] = await Promise.all([getGalleryBySlug(slug), getSettings()])
  if (!gallery) notFound()

  const cover = gallery.cover ? await privatePhotoView(gallery.cover) : null
  const date = formatDate(gallery.eventDate)
  const logo = asMedia(settings.logo)

  const hero = (children?: React.ReactNode) => (
    <section className="animate-aperture relative flex h-svh min-h-[560px] flex-col items-center justify-center overflow-hidden bg-neutral-950 text-white">
      {cover && (
        <Photo
          photo={cover}
          sizes="100vw"
          priority
          className="ken-burns absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/55" />
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <h1
          className="animate-focus font-display text-5xl font-light tracking-wide md:text-7xl"
          style={{ animationDelay: '500ms' }}
        >
          {gallery.title}
        </h1>
        {date && (
          <p
            className="animate-rise mt-5 text-xs tracking-[0.3em] uppercase md:text-sm"
            style={{ animationDelay: '900ms' }}
          >
            {date}
          </p>
        )}
        <div
          className="animate-rise flex w-full flex-col items-center"
          style={{ animationDelay: '1100ms' }}
        >
          {children}
        </div>
      </div>
      <Link
        href="/"
        className="animate-fade-in absolute bottom-8 z-10 flex flex-col items-center gap-2"
        style={{ animationDelay: '1400ms' }}
      >
        {logo?.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo.sizes?.thumbnail?.url || logo.url}
            alt=""
            className="h-12 w-12 rounded-md object-cover"
          />
        )}
        <span className="text-[10px] tracking-[0.25em] uppercase">{settings.siteName}</span>
      </Link>
    </section>
  )

  if (isExpired(gallery)) {
    return hero(
      <p className="mt-10 text-white/85">
        Esta galería ha expirado. Escríbeme si necesitas acceso.
      </p>,
    )
  }

  if (!(await hasGalleryAccess(gallery))) {
    return hero(
      <div className="mt-10 w-full max-w-xs">
        <GalleryAccessForm slug={gallery.slug!} tone="light" />
      </div>,
    )
  }

  const photos = await Promise.all(
    gallery.photos.map((photo) =>
      privatePhotoView(photo, { allowDownload: gallery.allowDownloads }),
    ),
  )

  return (
    <>
      {hero(
        <a href="#fotos" className="btn btn-light mt-10">
          Ver galería
        </a>,
      )}
      <section id="fotos" className="scroll-mt-0">
        <GalleryView
          slug={gallery.slug!}
          title={gallery.title}
          siteName={settings.siteName}
          photos={photos}
          allowDownloads={Boolean(gallery.allowDownloads)}
          allowFavorites={Boolean(gallery.allowFavorites)}
        />
      </section>
    </>
  )
}
