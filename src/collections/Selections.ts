import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access'

/** Favorites picked by a client (identified by email) inside a gallery. Written by the site via the Local API. */
export const Selections: CollectionConfig = {
  slug: 'selections',
  labels: { singular: 'Selección de favoritos', plural: 'Selecciones de favoritos' },
  admin: {
    group: 'Clientes',
    useAsTitle: 'email',
    defaultColumns: ['email', 'gallery', 'updatedAt'],
  },
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  indexes: [{ fields: ['gallery', 'email'], unique: true }],
  fields: [
    { name: 'gallery', label: 'Galería', type: 'relationship', relationTo: 'galleries', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    {
      name: 'photos',
      label: 'Fotos favoritas',
      type: 'upload',
      relationTo: 'client-photos',
      hasMany: true,
    },
  ],
}
