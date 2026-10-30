import { requireGallery } from '@/lib/galleries'
import { getPayloadClient } from '@/lib/payload'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const normalizeEmail = (value: unknown) =>
  typeof value === 'string' && EMAIL_RE.test(value.trim()) ? value.trim().toLowerCase() : null

async function findSelection(galleryId: number, email: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'selections',
    where: { gallery: { equals: galleryId }, email: { equals: email } },
    depth: 0,
    limit: 1,
    overrideAccess: true,
  })
  return { payload, selection: docs[0] }
}

/** GET ?email= → ids of that client's favorite photos. */
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const gallery = await requireGallery(slug)
  if (!gallery?.allowFavorites) return Response.json({ error: 'No autorizado' }, { status: 403 })

  const email = normalizeEmail(new URL(request.url).searchParams.get('email'))
  if (!email) return Response.json({ error: 'Email inválido' }, { status: 400 })

  const { selection } = await findSelection(gallery.id, email)
  return Response.json({ photos: (selection?.photos ?? []) as number[] })
}

/** POST { email, photoId } → toggles the photo in the client's favorites. */
export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const gallery = await requireGallery(slug)
  if (!gallery?.allowFavorites) return Response.json({ error: 'No autorizado' }, { status: 403 })

  const body = (await request.json().catch(() => ({}))) as { email?: unknown; photoId?: unknown }
  const email = normalizeEmail(body.email)
  const photoId = Number(body.photoId)
  if (!email) return Response.json({ error: 'Email inválido' }, { status: 400 })
  if (!gallery.photos.some((photo) => photo.id === photoId)) {
    return Response.json({ error: 'Foto no encontrada' }, { status: 404 })
  }

  const { payload, selection } = await findSelection(gallery.id, email)
  const current = (selection?.photos ?? []) as number[]
  const photos = current.includes(photoId)
    ? current.filter((id) => id !== photoId)
    : [...current, photoId]

  if (selection) {
    await payload.update({ collection: 'selections', id: selection.id, data: { photos }, overrideAccess: true })
  } else {
    await payload.create({
      collection: 'selections',
      data: { gallery: gallery.id, email, photos },
      overrideAccess: true,
    })
  }

  return Response.json({ photos })
}
