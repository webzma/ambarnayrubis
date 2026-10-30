import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access'
import { slugField } from '@/fields/slug'

/** Private client galleries, unlocked on the site with an optional password. */
export const Galleries: CollectionConfig = {
  slug: 'galleries',
  labels: { singular: 'Galería de cliente', plural: 'Galerías de clientes' },
  admin: {
    group: 'Clientes',
    useAsTitle: 'title',
    defaultColumns: ['title', 'clientName', 'eventDate', 'listed', 'status'],
    preview: (doc) => (doc?.slug ? `/g/${doc.slug}` : null),
  },
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    { name: 'title', label: 'Título', type: 'text', required: true },
    slugField(),
    {
      type: 'row',
      fields: [
        { name: 'clientName', label: 'Nombre del cliente', type: 'text' },
        { name: 'clientEmail', label: 'Email del cliente', type: 'email' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'eventDate',
          label: 'Fecha del evento',
          type: 'date',
          admin: { date: { pickerAppearance: 'dayOnly' } },
        },
        {
          name: 'password',
          label: 'Contraseña de acceso',
          type: 'text',
          admin: {
            description: 'Compártela con tu cliente. Déjala vacía para acceder solo con el enlace.',
          },
        },
      ],
    },
    {
      name: 'cover',
      label: 'Portada',
      type: 'upload',
      relationTo: 'client-photos',
    },
    {
      name: 'photos',
      label: 'Fotos',
      type: 'upload',
      relationTo: 'client-photos',
      hasMany: true,
      admin: { description: 'Arrastra todas las fotos de la sesión para subirlas en lote.' },
    },
    {
      name: 'tags',
      label: 'Etiquetas',
      type: 'text',
      hasMany: true,
      admin: { description: 'Ej. Vintaje. Se muestran como filtros en la página principal.' },
    },
    {
      name: 'listed',
      label: 'Mostrar en la página principal',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Si tiene contraseña, se verá la portada con un candado y las fotos seguirán protegidas.',
      },
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Activa', value: 'active' },
        { label: 'Archivada', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'allowDownloads',
      label: 'Permitir descargas',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'allowFavorites',
      label: 'Permitir favoritos',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'expiresAt',
      label: 'Expira el',
      type: 'date',
      admin: { position: 'sidebar', description: 'Opcional.' },
    },
    {
      name: 'selections',
      label: 'Favoritos de clientes',
      type: 'join',
      collection: 'selections',
      on: 'gallery',
    },
  ],
}
