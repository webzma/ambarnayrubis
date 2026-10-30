import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '@/access'
import { slugField } from '@/fields/slug'
import { albumCategories } from '@/lib/categories'
import { revalidateAfterChange, revalidateSite } from '@/hooks/revalidateSite'

export const Albums: CollectionConfig = {
  slug: 'albums',
  labels: { singular: 'Álbum', plural: 'Álbumes' },
  admin: {
    group: 'Portafolio',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'published', 'featured', 'updatedAt'],
  },
  defaultSort: 'order',
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateSite],
  },
  fields: [
    { name: 'title', label: 'Título', type: 'text', required: true },
    slugField(),
    {
      name: 'category',
      label: 'Categoría',
      type: 'select',
      options: albumCategories,
    },
    { name: 'description', label: 'Descripción', type: 'textarea' },
    {
      name: 'cover',
      label: 'Portada',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'photos',
      label: 'Fotos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: { description: 'Arrastra varias fotos a la vez para subirlas en lote.' },
    },
    {
      name: 'published',
      label: 'Publicado',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      label: 'Destacado en inicio',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      label: 'Orden',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Menor número = aparece primero.' },
    },
  ],
}
