import 'server-only'

import { cache } from 'react'

import type { Media } from '@/payload-types'
import { getPayloadClient } from './payload'

// The Local API skips access control by default, so public queries filter explicitly.

export const getSettings = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
})

export const asMedia = (value: unknown): Media | null =>
  typeof value === 'object' && value !== null && 'url' in value ? (value as Media) : null

export const asMediaList = (value: unknown): Media[] =>
  Array.isArray(value) ? value.map(asMedia).filter((m): m is Media => m !== null) : []
