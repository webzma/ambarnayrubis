import type { Metadata } from 'next'

import { ContactForm } from '@/components/ContactForm'
import { PageHeader } from '@/components/PageHeader'
import { whatsappHref } from '@/components/SiteFooter'
import { getSettings } from '@/lib/content'

export const revalidate = 3600
export const metadata: Metadata = { title: 'Contacto' }

export default async function ContactPage() {
  const settings = await getSettings()
  const whatsapp = whatsappHref(settings.whatsapp)
  const details = [
    settings.email && { label: 'Email', value: settings.email, href: `mailto:${settings.email}` },
    settings.phone && { label: 'Teléfono', value: settings.phone, href: `tel:${settings.phone.replace(/\s/g, '')}` },
    settings.location && { label: 'Ubicación', value: settings.location },
  ].filter((detail): detail is { label: string; value: string; href?: string } => Boolean(detail))

  return (
    <section className="mx-auto max-w-6xl px-6 pt-20 pb-28 md:px-10">
      <PageHeader
        eyebrow="Contacto"
        title="Hablemos"
        intro="Cuéntame sobre tu sesión o evento y te enviaré disponibilidad y paquetes."
      />
      <div className="grid gap-14 md:grid-cols-12 md:gap-16">
        <aside className="animate-rise md:col-span-4">
          <div className="bg-sand p-8 md:p-10">
            <p className="font-serif text-2xl font-light">¿Tienes una fecha en mente?</p>
            {details.length > 0 && (
              <dl className="mt-8 space-y-6">
                {details.map((detail) => (
                  <div key={detail.label}>
                    <dt className="eyebrow">{detail.label}</dt>
                    <dd className="mt-2">
                      {detail.href ? (
                        <a href={detail.href} className="link">
                          {detail.value}
                        </a>
                      ) : (
                        detail.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            {whatsapp && (
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-solid mt-10 w-full">
                Escríbeme por WhatsApp
              </a>
            )}
          </div>
        </aside>
        <div className="animate-rise md:col-span-8" style={{ animationDelay: '120ms' }}>
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
