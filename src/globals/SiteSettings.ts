import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '@/access'
import { revalidateAfterChange } from '@/hooks/revalidateSite'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Ajustes del sitio',
  admin: { group: 'Configuración' },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateAfterChange] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            { name: 'siteName', label: 'Nombre del sitio', type: 'text', required: true, defaultValue: 'Ambar Nayrubis' },
            { name: 'tagline', label: 'Frase principal', type: 'text', defaultValue: 'Fotografía' },
            { name: 'description', label: 'Descripción (SEO)', type: 'textarea' },
            { name: 'logo', label: 'Logo', type: 'upload', relationTo: 'media' },
            {
              name: 'heroImages',
              label: 'Fotos de portada (inicio)',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              admin: { description: 'Se muestran en un carrusel a pantalla completa.' },
            },
          ],
        },
        {
          label: 'Sobre mí',
          fields: [
            { name: 'aboutTitle', label: 'Título', type: 'text', defaultValue: 'Hola, soy Ambar' },
            { name: 'aboutText', label: 'Texto', type: 'textarea', admin: { rows: 10 } },
            { name: 'aboutImage', label: 'Foto', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: 'Contacto',
          fields: [
            { name: 'email', label: 'Email (recibe las consultas)', type: 'email' },
            { name: 'phone', label: 'Teléfono', type: 'text' },
            { name: 'whatsapp', label: 'WhatsApp (solo números, con código de país)', type: 'text' },
            { name: 'location', label: 'Ubicación', type: 'text' },
            { name: 'instagram', label: 'Instagram (URL)', type: 'text' },
            { name: 'facebook', label: 'Facebook (URL)', type: 'text' },
            { name: 'tiktok', label: 'TikTok (URL)', type: 'text' },
          ],
        },
      ],
    },
  ],
}
