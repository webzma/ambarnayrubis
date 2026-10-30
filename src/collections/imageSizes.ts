import type { ImageSize } from 'payload'

const webp = { format: 'webp' as const, options: { quality: 82 } }

/** Shared responsive sizes for portfolio and client photos. The original is kept for downloads. */
export const imageSizes: ImageSize[] = [
  { name: 'thumbnail', width: 480, withoutEnlargement: true, formatOptions: webp },
  { name: 'card', width: 1080, withoutEnlargement: true, formatOptions: webp },
  { name: 'large', width: 2048, withoutEnlargement: true, formatOptions: webp },
]

export type ImageSizeName = 'thumbnail' | 'card' | 'large'
