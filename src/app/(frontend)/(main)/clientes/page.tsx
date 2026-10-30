import type { Metadata } from 'next'

import { GalleryAccessForm } from '@/components/GalleryAccessForm'

export const metadata: Metadata = { title: 'Acceso clientes', robots: { index: false } }

export default function ClientAccessPage() {
  return (
    <section className="px-6 py-24">
      <div className="mb-14 text-center">
        <p className="eyebrow">Área de clientes</p>
        <h1 className="mt-3 font-serif text-5xl">Tu galería</h1>
        <p className="mx-auto mt-6 max-w-md text-muted">
          Introduce el código y la contraseña que recibiste para ver, elegir favoritas y descargar tus fotos.
        </p>
      </div>
      <GalleryAccessForm />
    </section>
  )
}
