import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { es } from '@payloadcms/translations/languages/es'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Albums } from './collections/Albums'
import { ClientPhotos } from './collections/ClientPhotos'
import { Galleries } from './collections/Galleries'
import { Inquiries } from './collections/Inquiries'
import { Media } from './collections/Media'
import { Selections } from './collections/Selections'
import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'
import {
  R2_PRIVATE_BUCKET,
  R2_PUBLIC_BUCKET,
  R2_PUBLIC_URL,
  r2ClientConfig,
  r2Enabled,
} from './lib/r2'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: { titleSuffix: ' — Admin' },
  },
  i18n: {
    supportedLanguages: { es },
    fallbackLanguage: 'es',
  },
  collections: [Albums, Media, Galleries, ClientPhotos, Selections, Inquiries, Users],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        apiKey: process.env.RESEND_API_KEY,
        defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'onboarding@resend.dev',
        defaultFromName: process.env.EMAIL_FROM_NAME || 'Sitio web',
      })
    : undefined,
  sharp,
  plugins: [
    // Public bucket: files are served directly from R2 (no Vercel bandwidth).
    s3Storage({
      enabled: r2Enabled,
      alwaysInsertFields: true,
      bucket: R2_PUBLIC_BUCKET,
      config: r2ClientConfig,
      clientCacheKey: 'r2-public',
      // Uploads go browser -> R2, bypassing Vercel's 4.5 MB request body limit.
      clientUploads: true,
      collections: {
        media: {
          prefix: 'media',
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) =>
            [R2_PUBLIC_URL, prefix, encodeURIComponent(filename)].filter(Boolean).join('/'),
        },
      },
    }),
    // Private bucket: admin previews go through Payload access control + signed redirects.
    s3Storage({
      enabled: r2Enabled,
      alwaysInsertFields: true,
      bucket: R2_PRIVATE_BUCKET,
      config: r2ClientConfig,
      clientCacheKey: 'r2-private',
      clientUploads: true,
      collections: {
        'client-photos': {
          prefix: 'galleries',
          signedDownloads: { expiresIn: 3600 },
        },
      },
    }),
  ],
})
