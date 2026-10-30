import Link from 'next/link'

import { GalleryCard } from '@/components/GalleryCard'
import { MailIcon } from '@/components/icons'
import { Pagination } from '@/components/Pagination'
import { SiteTopBar } from '@/components/SiteTopBar'
import { asMedia, getSettings } from '@/lib/content'
import { getGalleryTags, getListedGalleries } from '@/lib/galleries'

type Props = { searchParams: Promise<{ pagina?: string; etiqueta?: string; q?: string }> }

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams
  const tag = params.etiqueta?.trim() || undefined
  const query = params.q?.trim().slice(0, 100) || undefined
  const requestedPage = Math.max(1, Number.parseInt(params.pagina ?? '1', 10) || 1)

  const [settings, tags, { cards, page, totalPages }] = await Promise.all([
    getSettings(),
    getGalleryTags(),
    getListedGalleries({ page: requestedPage, tag, query }),
  ])
  const logo = asMedia(settings.logo)

  // Builds a homepage URL keeping the current filters unless overridden (`null` clears one).
  const href = (next: { pagina?: number; etiqueta?: string | null; q?: string | null }) => {
    const search = new URLSearchParams()
    const nextTag = next.etiqueta === undefined ? tag : next.etiqueta
    const nextQuery = next.q === undefined ? query : next.q
    if (nextTag) search.set('etiqueta', nextTag)
    if (nextQuery) search.set('q', nextQuery)
    if (next.pagina && next.pagina > 1) search.set('pagina', String(next.pagina))
    const qs = search.toString()
    return qs ? `/?${qs}` : '/'
  }

  const filter = (label: string, value: string | null) => {
    const active = (tag ?? null) === value
    return (
      <Link
        key={label}
        href={href({ etiqueta: value })}
        aria-current={active ? 'page' : undefined}
        className={`label pb-1 transition-colors hover:text-ink ${active ? 'border-b border-ink text-ink' : ''}`}
      >
        {label}
      </Link>
    )
  }

  return (
    <>
      <SiteTopBar settings={settings} query={query} />

      <section className="mx-auto max-w-2xl px-6 pt-6 text-center">
        {logo?.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo.sizes?.thumbnail?.url || logo.url}
            alt={settings.siteName}
            className="mx-auto h-[75px] w-[75px] rounded-md object-cover"
          />
        )}
        <h1 className="heading mt-6 text-2xl tracking-[0.14em]">{settings.siteName}</h1>
        {settings.intro && <p className="mt-8 text-[15px] leading-relaxed whitespace-pre-line">{settings.intro}</p>}
        {settings.email && (
          <a href={`mailto:${settings.email}`} className="mt-8 inline-flex items-center gap-3 text-[15px] hover:underline">
            <MailIcon className="h-4 w-4 text-muted" />
            {settings.email}
          </a>
        )}
        <span className="mx-auto mt-12 block h-px w-32 bg-line" aria-hidden />
      </section>

      <section className="mx-auto max-w-[1400px] px-4 pt-12 md:px-8">
        {tags.length > 0 && (
          <nav className="mb-16 flex flex-wrap justify-center gap-x-7 gap-y-3" aria-label="Filtrar por etiqueta">
            {filter('Todas', null)}
            {tags.map((name) => filter(name, name))}
          </nav>
        )}

        {query && (
          <p className="mb-12 text-center text-sm text-muted">
            Resultados para «{query}» ·{' '}
            <Link href={href({ q: null })} className="underline">
              Ver todas
            </Link>
          </p>
        )}

        {cards.length === 0 ? (
          <p className="py-16 text-center text-muted">{query || tag ? 'No hay galerías que coincidan.' : 'Pronto habrá nuevas galerías aquí.'}</p>
        ) : (
          <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((gallery) => (
              <GalleryCard key={gallery.id} gallery={gallery} />
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} href={(n) => href({ pagina: n })} />
      </section>
    </>
  )
}
