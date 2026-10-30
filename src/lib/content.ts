import 'server-only'

import { cache } from 'react'

import type { Media } from '@/payload-types'
import { getPayloadClient } from './payload'

// The Local API skips access control by default, so public queries filter explicitly.

export const getSettings = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
})

export const getAlbums = cache(async (options: { featured?: boolean } = {}) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'albums',
    where: {
      published: { equals: true },
      ...(options.featured ? { featured: { equals: true } } : {}),
    },
    sort: ['order', '-createdAt'],
    depth: 1,
    limit: 100,
    select: { title: true, slug: true, category: true, cover: true, description: true },
  })
  return docs
})

export const getAlbumBySlug = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'albums',
    where: { slug: { equals: slug }, published: { equals: true } },
    depth: 1,
    limit: 1,
  })
  return docs[0] ?? null
})

export const asMedia = (value: unknown): Media | null =>
  typeof value === 'object' && value !== null && 'url' in value ? (value as Media) : null

export const asMediaList = (value: unknown): Media[] =>
  Array.isArray(value) ? value.map(asMedia).filter((m): m is Media => m !== null) : []
