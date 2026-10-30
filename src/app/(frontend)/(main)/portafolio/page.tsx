import type { Metadata } from 'next'

import { AlbumBrowser } from '@/components/AlbumBrowser'
import { AlbumCard } from '@/components/AlbumCard'
import { PageHeader } from '@/components/PageHeader'
import { getAlbums } from '@/lib/content'

export const revalidate = 3600
export const metadata: Metadata = { title: 'Portafolio' }

export default async function PortfolioPage() {
  const albums = await getAlbums()

  return (
    <section className="mx-auto max-w-7xl px-6 pt-20 pb-28 md:px-10">
      <PageHeader eyebrow="Portafolio" title="Galerías" intro="Bodas, retratos, familias y momentos que merecen ser recordados." />
      {albums.length === 0 ? (
        <p className="text-center text-muted">Pronto habrá nuevas historias aquí.</p>
      ) : (
        <AlbumBrowser categories={albums.map((album) => album.category)}>
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </AlbumBrowser>
      )}
    </section>
  )
}
