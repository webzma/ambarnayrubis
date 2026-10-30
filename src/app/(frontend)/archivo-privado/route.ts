import type { ImageSizeName } from '@/collections/imageSizes'
import { getPayloadClient } from '@/lib/payload'
import { contentDisposition, fileNameFor, privatePhotoStream } from '@/lib/private-files'
import { r2Enabled } from '@/lib/r2'
import { readToken } from '@/lib/tokens'

/**
 * Local-development stand-in for R2 presigned URLs: serves a private photo from disk
 * when the request carries a valid signed token. Disabled when R2 is configured.
 */
export async function GET(request: Request) {
  if (r2Enabled) return new Response('Not found', { status: 404 })

  const claims = readToken<{ id: number; s: ImageSizeName | null; d: boolean }>(
    new URL(request.url).searchParams.get('t'),
  )
  if (!claims) return new Response('Enlace expirado', { status: 403 })

  const payload = await getPayloadClient()
  const photo = await payload
    .findByID({ collection: 'client-photos', id: claims.id, overrideAccess: true })
    .catch(() => null)
  if (!photo) return new Response('Not found', { status: 404 })

  const size = claims.s ?? undefined
  const { stream, size: bytes } = await privatePhotoStream(photo, size)
  const mimeType = (size ? photo.sizes?.[size]?.mimeType : photo.mimeType) || 'application/octet-stream'

  return new Response(stream, {
    headers: {
      'Content-Type': mimeType,
      ...(bytes ? { 'Content-Length': String(bytes) } : {}),
      'Cache-Control': 'private, max-age=3600',
      ...(claims.d ? { 'Content-Disposition': contentDisposition(fileNameFor(photo)) } : {}),
    },
  })
}
