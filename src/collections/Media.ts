import path from 'path'
import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '@/access'
import { revalidateAfterChange, revalidateSite } from '@/hooks/revalidateSite'
import { imageSizes } from './imageSizes'

/** Public images: portfolio, hero, about. Stored in the public R2 bucket and served from its CDN URL. */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Imagen pública', plural: 'Imágenes públicas' },
  admin: {
    group: 'Portafolio',
    description: 'Fotos visibles para todo el mundo (portafolio, portada, sobre mí).',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateSite],
  },
  fields: [
    {
      name: 'alt',
      label: 'Texto alternativo',
      type: 'text',
      admin: { description: 'Describe la foto (SEO y accesibilidad).' },
    },
  ],
  upload: {
    // Only used in local development, when R2 isn't configured.
    staticDir: path.resolve(process.cwd(), 'uploads/media'),
    mimeTypes: ['image/*'],
    imageSizes,
    adminThumbnail: 'thumbnail',
    focalPoint: true,
  },
}
