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

  return (
    <>
      <section className="relative h-svh min-h-[560px] text-white">
        <SiteHeader settings={settings} overlay />
        <HeroSlideshow photos={hero} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50" />
        <div className="animate-fade-in relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <p className="text-[11px] tracking-[0.4em] uppercase">{settings.tagline}</p>
          <h1 className="mt-6 font-serif text-5xl font-light md:text-7xl">{settings.siteName}</h1>
          <Link href="/portafolio" className="btn btn-light mt-12">
            Ver portafolio
          </Link>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-24 md:px-10">
          <div className="mb-16 text-center">
            <p className="eyebrow">Portafolio</p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">Historias recientes</h2>
          </div>
          <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      )}

      <section className="bg-line/30">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2 md:px-10">
          {aboutImage && (
            <Photo photo={publicPhotoView(aboutImage)} sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[4/5] w-full object-cover" />
          )}
          <div className={aboutImage ? '' : 'md:col-span-2 text-center'}>
            <p className="eyebrow">Sobre mí</p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">{settings.aboutTitle}</h2>
            {settings.aboutText && (
              <p className="mt-6 line-clamp-6 leading-relaxed whitespace-pre-line text-muted">{settings.aboutText}</p>
            )}
            <Link href="/sobre-mi" className="btn mt-10">
              Conóceme
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-28 text-center">
        <p className="eyebrow">Reserva tu sesión</p>
        <h2 className="mx-auto mt-3 max-w-2xl font-serif text-4xl italic md:text-5xl">
          Cuéntame tu historia y creemos algo bonito juntos
        </h2>
        <Link href="/contacto" className="btn mt-10">
          Escríbeme
        </Link>
      </section>
    </>
  )
}
