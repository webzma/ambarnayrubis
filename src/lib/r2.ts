import { S3Client, type S3ClientConfig } from '@aws-sdk/client-s3'

/**
 * Cloudflare R2 (S3-compatible). Two buckets:
 * - public:  portfolio images, served straight from R2's public URL / custom domain.
 * - private: client gallery photos, only reachable through signed URLs.
 *
 * When R2 isn't configured (local development) Payload falls back to local disk.
 */
export const r2Enabled = Boolean(
  process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_PUBLIC_BUCKET &&
    process.env.R2_PRIVATE_BUCKET &&
    process.env.R2_PUBLIC_URL,
)

export const r2ClientConfig: S3ClientConfig = {
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true,
}

export const R2_PUBLIC_BUCKET = process.env.R2_PUBLIC_BUCKET || ''
export const R2_PRIVATE_BUCKET = process.env.R2_PRIVATE_BUCKET || ''
export const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '')

let client: S3Client | undefined
export const getR2Client = () => (client ??= new S3Client(r2ClientConfig))

const trimSlashes = (value?: string | null) => (value ?? '').replace(/^\/+|\/+$/g, '')

/** Object key as written by @payloadcms/storage-s3: `<prefix>/<_objectKey>/<filename>`. */
export const objectKeyFor = (
  doc: { prefix?: string | null; _objectKey?: string | null },
  filename: string,
) => [trimSlashes(doc.prefix), trimSlashes(doc._objectKey), filename].filter(Boolean).join('/')
