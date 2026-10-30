import type { Metadata } from 'next'

import { GalleryAccessForm } from '@/components/GalleryAccessForm'

export const metadata: Metadata = { title: 'Acceso clientes', robots: { index: false } }

export default function ClientAccessPage() {
  return (
    <section className="px-6 pt-20 pb-28">
      <div className="animate-rise mx-auto max-w-lg border border-line bg-white/60 px-8 py-14 text-center shadow-[0_30px_80px_-40px_rgba(28,27,25,0.25)] md:px-14">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sand text-accent" aria-hidden>
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.4}>
            <rect x="4.5" y="10.5" width="15" height="10" rx="1.5" />
            <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
          </svg>
        </span>
        <p className="eyebrow mt-8">Área de clientes</p>
        <h1 className="mt-3 font-serif text-5xl font-light">Tu galería</h1>
        <p className="mx-auto mt-5 mb-12 max-w-sm leading-relaxed text-muted">
          Introduce el código y la contraseña que recibiste para ver, elegir favoritas y descargar tus fotos.
        </p>
        <GalleryAccessForm />
      </div>
    </section>
  )
}
