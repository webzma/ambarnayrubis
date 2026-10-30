import 'server-only'

import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createReadStream } from 'fs'
import { stat } from 'fs/promises'
import path from 'path'
import { Readable } from 'stream'

import type { ImageSizeName } from '@/collections/imageSizes'
import type { ClientPhoto } from '@/payload-types'
import { R2_PRIVATE_BUCKET, getR2Client, objectKeyFor, r2Enabled } from './r2'
import { createToken } from './tokens'

const URL_TTL = 4 * 60 * 60 // signed URLs stay valid for 3–4 hours
const HOUR = 60 * 60 * 1000

export const LOCAL_PRIVATE_DIR = path.resolve(process.cwd(), 'uploads/client-photos')

export const fileNameFor = (photo: ClientPhoto, size?: ImageSizeName) =>
  (size ? photo.sizes?.[size]?.filename : undefined) || photo.filename || ''

const contentDisposition = (filename: string) =>
  `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`

/**
 * URL a visitor can use to fetch a private photo.
 * With R2 it's a presigned URL pointing straight at the bucket (no Vercel bandwidth).
 * The signing time is rounded to the hour so URLs stay identical — and browser-cacheable —
 * across page loads within that hour.
 */
export async function privatePhotoURL(
  photo: ClientPhoto,
  size?: ImageSizeName,
  options: { download?: boolean } = {},
) {
  const filename = fileNameFor(photo, size)
  if (!filename) return ''

  if (!r2Enabled) {
    const token = createToken({ id: photo.id, s: size ?? null, d: Boolean(options.download) }, URL_TTL)
    return `/archivo-privado?t=${token}`
  }

  const command = new GetObjectCommand({
    Bucket: R2_PRIVATE_BUCKET,
    Key: objectKeyFor(photo, filename),
    ResponseContentDisposition: options.download
      ? contentDisposition(photo.filename || filename)
      : undefined,
  })
  return getSignedUrl(getR2Client(), command, {
    expiresIn: URL_TTL,
    signingDate: new Date(Math.floor(Date.now() / HOUR) * HOUR),
  })
}

/** Readable stream of a private photo, used to build ZIP downloads. */
export async function privatePhotoStream(photo: ClientPhoto, size?: ImageSizeName) {
  const filename = fileNameFor(photo, size)

  if (!r2Enabled) {
    const filePath = path.join(LOCAL_PRIVATE_DIR, path.basename(filename))
    const { size: bytes } = await stat(filePath)
    return { stream: Readable.toWeb(createReadStream(filePath)) as ReadableStream, size: bytes }
  }

  const object = await getR2Client().send(
    new GetObjectCommand({ Bucket: R2_PRIVATE_BUCKET, Key: objectKeyFor(photo, filename) }),
  )
  return {
    stream: object.Body!.transformToWebStream() as ReadableStream,
    size: object.ContentLength,
  }
}

export { contentDisposition }
