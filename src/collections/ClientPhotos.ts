import path from 'path'
import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access'
import { imageSizes } from './imageSizes'

/**
 * Private client photos. Stored in the private R2 bucket; only admins can read
 * them through the API. Clients get short-lived signed URLs once they unlock a gallery.
 */
export const ClientPhotos: CollectionConfig = {
  slug: 'client-photos',
  labels: { singular: 'Foto de cliente', plural: 'Fotos de clientes' },
  admin: {
    group: 'Clientes',
    description: 'Fotos privadas. Súbelas directamente desde cada galería.',
  },
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [{ name: 'alt', label: 'Texto alternativo', type: 'text' }],
  upload: {
    // Only used in local development, when R2 isn't configured.
    staticDir: path.resolve(process.cwd(), 'uploads/client-photos'),
    mimeTypes: ['image/*'],
    imageSizes,
    adminThumbnail: 'thumbnail',
  },
}
