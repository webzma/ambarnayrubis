import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access'

/** Contact form submissions. Created by the site via the Local API; emails the photographer. */
export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: 'Consulta', plural: 'Consultas' },
  admin: {
    group: 'Clientes',
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'eventType', 'eventDate', 'createdAt'],
  },
  defaultSort: '-createdAt',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return doc
        const settings = await req.payload.findGlobal({ slug: 'site-settings', req })
        const to = settings.email || process.env.CONTACT_EMAIL
        if (!to) return doc
        try {
          await req.payload.sendEmail({
            to,
            replyTo: doc.email,
            subject: `Nueva consulta de ${doc.name}`,
            text: [
              `Nombre: ${doc.name}`,
              `Email: ${doc.email}`,
              `Teléfono: ${doc.phone || '-'}`,
              `Tipo de sesión: ${doc.eventType || '-'}`,
              `Fecha: ${doc.eventDate ? new Date(doc.eventDate).toLocaleDateString('es') : '-'}`,
              '',
              doc.message,
            ].join('\n'),
          })
        } catch (err) {
          req.payload.logger.error({ err, msg: 'No se pudo enviar el email de la consulta' })
        }
        return doc
      },
    ],
  },
  fields: [
    { name: 'name', label: 'Nombre', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Teléfono', type: 'text' },
    { name: 'eventType', label: 'Tipo de sesión', type: 'text' },
    { name: 'eventDate', label: 'Fecha', type: 'date' },
    { name: 'message', label: 'Mensaje', type: 'textarea', required: true },
  ],
}
