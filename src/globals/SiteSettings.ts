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
          label: 'Perfil',
          fields: [
            { name: 'siteName', label: 'Nombre', type: 'text', required: true, defaultValue: 'Ambarnayrubis' },
            {
              name: 'logo',
              label: 'Foto de perfil o logo',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Se muestra pequeña y cuadrada encima del nombre.' },
            },
            {
              name: 'intro',
              label: 'Presentación',
              type: 'textarea',
              admin: { rows: 6, description: 'Texto bajo el nombre en la página principal. Respeta los saltos de línea.' },
            },
            { name: 'email', label: 'Email de contacto', type: 'email' },
          ],
        },
        {
          label: 'Redes sociales',
          fields: [
            { name: 'facebook', label: 'Facebook (URL)', type: 'text' },
            { name: 'instagram', label: 'Instagram (URL)', type: 'text' },
            { name: 'tiktok', label: 'TikTok (URL)', type: 'text' },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'tagline', label: 'Subtítulo de la pestaña', type: 'text', defaultValue: 'Fotografía' },
            { name: 'description', label: 'Descripción para Google', type: 'textarea' },
          ],
        },
      ],
    },
  ],
}
