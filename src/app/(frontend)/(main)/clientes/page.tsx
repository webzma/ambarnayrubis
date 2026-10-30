import type { Metadata } from 'next'

import { GalleryAccessForm } from '@/components/GalleryAccessForm'
import { LockIcon } from '@/components/icons'

export const metadata: Metadata = { title: 'Acceso clientes', robots: { index: false } }

export default function ClientAccessPage() {
  return (
    <section className="mx-auto max-w-md px-6 pt-16 text-center">
      <LockIcon className="mx-auto h-6 w-6 text-muted" />
      <h1 className="heading mt-6 text-xl">Tu galería</h1>
      <p className="mt-5 mb-12 text-[15px] leading-relaxed text-muted">
        Introduce el código y la contraseña que recibiste para ver, elegir favoritas y descargar tus fotos.
      </p>
      <GalleryAccessForm />
    </section>
  )
}
