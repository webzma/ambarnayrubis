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

  return (
    <section className="mx-auto grid max-w-6xl gap-16 px-6 py-20 md:grid-cols-2 md:px-10">
      {image && (
        <Photo photo={publicPhotoView(image)} sizes="(min-width: 768px) 50vw, 100vw" priority className="w-full object-cover" />
      )}
      <div className={`self-center ${image ? '' : 'md:col-span-2 mx-auto max-w-2xl text-center'}`}>
        <p className="eyebrow">Sobre mí</p>
        <h1 className="mt-3 font-serif text-5xl">{settings.aboutTitle}</h1>
        {settings.aboutText && (
          <div className="mt-8 space-y-5 leading-relaxed text-muted">
            {settings.aboutText.split(/\n{2,}/).map((paragraph, i) => (
              <p key={i} className="whitespace-pre-line">{paragraph}</p>
            ))}
          </div>
        )}
        <Link href="/contacto" className="btn mt-12">
          Trabajemos juntos
        </Link>
      </div>
    </section>
  )
}
