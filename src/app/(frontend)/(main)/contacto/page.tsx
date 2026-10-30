import type { Metadata } from 'next'

import { ContactForm } from '@/components/ContactForm'
import { getSettings } from '@/lib/content'

export const revalidate = 3600
export const metadata: Metadata = { title: 'Contacto' }

export default async function ContactPage() {
  const settings = await getSettings()

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <div className="mb-16 text-center">
        <p className="eyebrow">Contacto</p>
        <h1 className="mt-3 font-serif text-5xl">Hablemos</h1>
        <p className="mt-6 text-muted">
          Cuéntame sobre tu sesión o evento y te enviaré disponibilidad y paquetes.
          {settings.email && (
            <>
              {' '}También puedes escribirme a{' '}
              <a href={`mailto:${settings.email}`} className="text-ink underline underline-offset-4">
                {settings.email}
              </a>
              .
            </>
          )}
        </p>
      </div>
      <ContactForm />
    </section>
  )
}
