import type { Metadata } from 'next'
import Link from 'next/link'

import { Photo } from '@/components/Photo'
import { asMedia, getSettings } from '@/lib/content'
import { publicPhotoView } from '@/lib/photo-view'

export const revalidate = 3600
export const metadata: Metadata = { title: 'Sobre mí' }

export default async function AboutPage() {
  const settings = await getSettings()
  const image = asMedia(settings.aboutImage)
  const [lead, ...rest] = (settings.aboutText ?? '').split(/\n{2,}/).filter(Boolean)

  return (
    <section className="mx-auto grid max-w-6xl gap-16 px-6 pt-20 pb-28 md:grid-cols-2 md:gap-20 md:px-10">
      {image && (
        <div className="animate-fade-in relative mr-4 mb-4 self-start md:sticky md:top-28 md:mr-0">
          <div className="absolute inset-0 translate-x-4 translate-y-4 border border-accent/50" aria-hidden />
          <Photo photo={publicPhotoView(image)} sizes="(min-width: 768px) 50vw, 100vw" priority className="relative w-full object-cover" />
        </div>
      )}
      <div className={`animate-rise self-center ${image ? '' : 'mx-auto max-w-2xl text-center md:col-span-2'}`}>
        <p className="eyebrow-rule">Sobre mí</p>
        <h1 className="mt-4 font-serif text-5xl font-light md:text-6xl">{settings.aboutTitle}</h1>
        {lead && <p className="mt-10 font-serif text-2xl leading-relaxed font-light whitespace-pre-line italic">{lead}</p>}
        {rest.length > 0 && (
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted">
            {rest.map((paragraph, i) => (
              <p key={i} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>
        )}
        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/contacto" className="btn btn-solid">
            Trabajemos juntos
          </Link>
          <Link href="/portafolio" className="btn">
            Ver portafolio
          </Link>
        </div>
      </div>
    </section>
  )
}
