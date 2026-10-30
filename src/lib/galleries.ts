import 'server-only'

import { cookies } from 'next/headers'

import type { ClientPhoto, Gallery } from '@/payload-types'
import { getPayloadClient } from './payload'
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
