import 'server-only'

import { cookies } from 'next/headers'
import type { Where } from 'payload'

import type { ClientPhoto, Gallery } from '@/payload-types'
import { getPayloadClient } from './payload'
import { privatePhotoView, type PhotoView } from './photo-view'
import { createToken, readToken, signValue } from './tokens'

const ACCESS_TTL = 60 * 60 * 24 * 30 // 30 days

export type LoadedGallery = Omit<Gallery, 'photos' | 'cover'> & {
  photos: ClientPhoto[]
  cover: ClientPhoto | null
}

const cookieName = (galleryId: number) => `gal_${galleryId}`

// Changing the password invalidates every cookie issued with the old one.
const passwordFingerprint = (gallery: Pick<Gallery, 'id' | 'password'>) =>
  signValue(`${gallery.id}:${gallery.password ?? ''}`).slice(0, 16)

/** Gallery lookup that bypasses access control. Only call after deciding the visitor may see it. */
export async function getGalleryBySlug(slug: string): Promise<LoadedGallery | null> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'galleries',
    where: { slug: { equals: slug }, status: { equals: 'active' } },
    depth: 1,
    limit: 1,
    overrideAccess: true,
    joins: false,
  })
  const gallery = docs[0]
  if (!gallery) return null

  const photos = (gallery.photos ?? []).filter(
    (photo): photo is ClientPhoto => typeof photo === 'object' && photo !== null,
  )
  const cover =
    (typeof gallery.cover === 'object' && gallery.cover) || photos[0] || null

  return { ...gallery, photos, cover }
}

export const isExpired = (gallery: Pick<Gallery, 'expiresAt'>) =>
  Boolean(gallery.expiresAt && new Date(gallery.expiresAt).getTime() < Date.now())

export async function hasGalleryAccess(gallery: Pick<Gallery, 'id' | 'password'>) {
  if (!gallery.password) return true
  const store = await cookies()
  const claims = readToken<{ g: number; p: string }>(store.get(cookieName(gallery.id))?.value)
  return Boolean(claims && claims.g === gallery.id && claims.p === passwordFingerprint(gallery))
}

export async function grantGalleryAccess(gallery: Pick<Gallery, 'id' | 'password'>) {
  const store = await cookies()
  store.set(cookieName(gallery.id), createToken({ g: gallery.id, p: passwordFingerprint(gallery) }, ACCESS_TTL), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ACCESS_TTL,
  })
}

/** Loads a gallery for an API route, enforcing password, expiry and status. */
export async function requireGallery(slug: string) {
  const gallery = await getGalleryBySlug(slug)
  if (!gallery || isExpired(gallery) || !(await hasGalleryAccess(gallery))) return null
  return gallery
}

export const GALLERIES_PER_PAGE = 9

export type GalleryCard = {
  id: number
  title: string
  slug: string
  eventDate?: string | null
  locked: boolean
  cover: PhotoView | null
}

/** Galleries shown on the homepage: listed, active and not expired. */
const listedWhere = (): Where => ({
  listed: { equals: true },
  status: { equals: 'active' },
  or: [{ expiresAt: { exists: false } }, { expiresAt: { greater_than: new Date().toISOString() } }],
})

export async function getListedGalleries({ page = 1, tag, query }: { page?: number; tag?: string; query?: string }) {
  const payload = await getPayloadClient()
  const where: Where = { and: [listedWhere()] }
  if (tag) where.and!.push({ tags: { in: [tag] } })
  if (query) where.and!.push({ title: { like: query } })

  const result = await payload.find({
    collection: 'galleries',
    where,
    sort: ['-eventDate', '-createdAt'],
    page,
    limit: GALLERIES_PER_PAGE,
    depth: 0,
    overrideAccess: true,
    joins: false,
    select: { title: true, slug: true, eventDate: true, password: true, cover: true, photos: true },
  })

  // Galleries without an explicit cover use their first photo. Load all covers in one query.
  const coverIds = result.docs
    .map((gallery) => (gallery.cover as number | null) ?? (gallery.photos as number[] | undefined)?.[0])
    .filter((id): id is number => typeof id === 'number')
  const { docs: covers } = coverIds.length
    ? await payload.find({
        collection: 'client-photos',
        where: { id: { in: coverIds } },
        limit: coverIds.length,
        depth: 0,
        overrideAccess: true,
      })
    : { docs: [] }
  const coverById = new Map(covers.map((photo) => [photo.id, photo]))

  const cards: GalleryCard[] = await Promise.all(
    result.docs.map(async (gallery) => {
      const coverId = (gallery.cover as number | null) ?? (gallery.photos as number[] | undefined)?.[0]
      const cover = coverId ? coverById.get(coverId) : undefined
      return {
        id: gallery.id,
        title: gallery.title,
        slug: gallery.slug!,
        eventDate: gallery.eventDate,
        locked: Boolean(gallery.password),
        cover: cover ? await privatePhotoView(cover) : null,
      }
    }),
  )

  return { cards, page: result.page ?? 1, totalPages: result.totalPages }
}

/** Every tag used by a listed gallery, for the homepage filter. */
export async function getGalleryTags() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'galleries',
    where: listedWhere(),
    limit: 500,
    depth: 0,
    overrideAccess: true,
    joins: false,
    select: { tags: true },
  })
  const tags = new Map<string, string>()
  for (const tag of docs.flatMap((gallery) => gallery.tags ?? [])) {
    const clean = tag.trim()
    if (clean && !tags.has(clean.toLowerCase())) tags.set(clean.toLowerCase(), clean)
  }
  return [...tags.values()].sort((a, b) => a.localeCompare(b, 'es'))
}
