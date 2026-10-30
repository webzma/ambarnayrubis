import { downloadZip } from 'client-zip'

import { slugify } from '@/fields/slug'
import { requireGallery } from '@/lib/galleries'
import { getPayloadClient } from '@/lib/payload'
import { contentDisposition, fileNameFor, privatePhotoStream } from '@/lib/private-files'

// Large galleries stream for a while; Vercel Pro allows up to 800s with Fluid Compute.
export const maxDuration = 300

/**
 * Streams a ZIP with the original files of a gallery. Photos are fetched one at a
 * time while the ZIP is being written, so memory stays flat regardless of size.
 * `?email=` limits the ZIP to that client's favorites.
 */
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const gallery = await requireGallery(slug)
  if (!gallery) return new Response('No autorizado', { status: 403 })
  if (!gallery.allowDownloads) return new Response('Descargas desactivadas', { status: 403 })

  let photos = gallery.photos
  const email = new URL(request.url).searchParams.get('email')?.trim().toLowerCase()
  if (email) {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'selections',
      where: { gallery: { equals: gallery.id }, email: { equals: email } },
      depth: 0,
      limit: 1,
      overrideAccess: true,
    })
    const favoriteIds = new Set(docs[0]?.photos ?? [])
    photos = photos.filter((photo) => favoriteIds.has(photo.id))
  }
  if (photos.length === 0) return new Response('No hay fotos para descargar', { status: 404 })

  const usedNames = new Set<string>()
  const uniqueName = (name: string) => {
    let candidate = name
    for (let i = 2; usedNames.has(candidate); i++) candidate = name.replace(/(\.[^.]+)?$/, `-${i}$1`)
    usedNames.add(candidate)
    return candidate
  }

  async function* files() {
    for (const photo of photos) {
      const { stream, size } = await privatePhotoStream(photo)
      yield {
        name: uniqueName(fileNameFor(photo)),
        input: stream,
        size,
        lastModified: new Date(photo.updatedAt),
      }
    }
  }

  const zipName = `${slugify(gallery.title) || 'galeria'}${email ? '-favoritas' : ''}.zip`
  return new Response(downloadZip(files()).body, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': contentDisposition(zipName),
      'Cache-Control': 'private, no-store',
    },
  })
}
