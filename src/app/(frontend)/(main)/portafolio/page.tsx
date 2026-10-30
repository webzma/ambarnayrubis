import type { Metadata } from 'next'

import { AlbumCard } from '@/components/AlbumCard'
import { getAlbums } from '@/lib/content'

export const revalidate = 3600
export const metadata: Metadata = { title: 'Portafolio' }

export default async function PortfolioPage() {
  const albums = await getAlbums()

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
      <div className="mb-16 text-center">
        <p className="eyebrow">Portafolio</p>
        <h1 className="mt-3 font-serif text-5xl">Galerías</h1>
      </div>
      {albums.length === 0 ? (
        <p className="text-center text-muted">Pronto habrá nuevas historias aquí.</p>
      ) : (
        <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      )}
    </section>
  )
}
