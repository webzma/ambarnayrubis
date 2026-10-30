import Link from 'next/link'

import { AlbumCard } from '@/components/AlbumCard'
import { HeroSlideshow } from '@/components/HeroSlideshow'
import { Photo } from '@/components/Photo'
import { SiteHeader } from '@/components/SiteHeader'
import { asMedia, asMediaList, getAlbums, getSettings } from '@/lib/content'
import { publicPhotoView } from '@/lib/photo-view'

export const revalidate = 3600

export default async function HomePage() {
  const [settings, featured] = await Promise.all([getSettings(), getAlbums({ featured: true })])
  const hero = asMediaList(settings.heroImages).map(publicPhotoView)
  const aboutImage = asMedia(settings.aboutImage)
  const ctaImage = hero[1] ?? hero[0]

  return (
    <>
      <section className="relative h-svh min-h-[600px] text-white">
        <SiteHeader settings={settings} overlay />
        <HeroSlideshow photos={hero} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/60" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <p className="animate-rise flex items-center gap-4 text-[11px] tracking-[0.45em] uppercase before:h-px before:w-10 before:bg-white/60 after:h-px after:w-10 after:bg-white/60">
            {settings.tagline}
          </p>
          <h1
            className="animate-rise mt-6 font-serif text-6xl leading-none font-light md:text-8xl"
            style={{ animationDelay: '150ms' }}
          >
            {settings.siteName}
          </h1>
          <div className="animate-rise mt-12 flex flex-wrap justify-center gap-3" style={{ animationDelay: '300ms' }}>
            <Link href="/portafolio" className="btn btn-light">
              Ver portafolio
            </Link>
            <Link href="/contacto" className="btn border-transparent text-white hover:bg-white/10 hover:text-white">
              Reservar sesión →
            </Link>
          </div>
        </div>
        <a
          href="#contenido"
          className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 text-[10px] tracking-[0.3em] uppercase md:flex"
          aria-label="Desplazarse al contenido"
        >
          <span>Descubre</span>
          <span className="block h-12 w-px overflow-hidden bg-white/25">
            <span className="animate-scroll-cue block h-full w-full bg-white" />
          </span>
        </a>
      </section>

      <div id="contenido" />

      {featured.length > 0 && (
        <section className="reveal mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
          <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow-rule">Portafolio</p>
              <h2 className="mt-4 font-serif text-4xl font-light md:text-6xl">Historias recientes</h2>
            </div>
            <Link href="/portafolio" className="link self-start text-[11px] tracking-[0.25em] uppercase md:self-auto">
              Ver todo el portafolio →
            </Link>
          </div>
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {featured.slice(0, 6).map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      )}

      <section className="bg-sand">
        <div className="reveal mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 md:grid-cols-2 md:gap-20 md:px-10 md:py-32">
          {aboutImage && (
            <div className="relative mr-4 mb-4 md:mr-0">
              <div className="absolute inset-0 translate-x-4 translate-y-4 border border-accent/50" aria-hidden />
              <Photo
                photo={publicPhotoView(aboutImage)}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="relative aspect-[4/5] w-full object-cover"
              />
            </div>
          )}
          <div className={aboutImage ? '' : 'mx-auto max-w-2xl text-center md:col-span-2'}>
            <p className="eyebrow-rule">Sobre mí</p>
            <h2 className="mt-4 font-serif text-4xl font-light md:text-6xl">{settings.aboutTitle}</h2>
            {settings.aboutText && (
              <p className="mt-8 line-clamp-6 text-lg leading-relaxed whitespace-pre-line text-muted">{settings.aboutText}</p>
            )}
            <Link href="/sobre-mi" className="btn mt-10">
              Conóceme
            </Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink px-6 py-32 text-center text-white md:py-44">
        {ctaImage && <Photo photo={ctaImage} sizes="100vw" className="absolute inset-0 h-full w-full object-cover opacity-25" />}
        <div className="reveal relative">
          <p className="text-[11px] tracking-[0.4em] text-white/70 uppercase">Reserva tu sesión</p>
          <h2 className="mx-auto mt-6 max-w-3xl font-serif text-4xl leading-tight font-light italic md:text-6xl">
            Cuéntame tu historia y creemos algo bonito juntos
          </h2>
          <Link href="/contacto" className="btn btn-light mt-12">
            Escríbeme
          </Link>
        </div>
      </section>
    </>
  )
}
