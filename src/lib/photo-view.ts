import type { ClientPhoto, Media } from '@/payload-types'

/** Serializable photo shape shared by the portfolio and client galleries. */
export type PhotoView = {
  id: number
  alt: string
  width: number
  height: number
  thumb: string
  card: string
  large: string
  /** Original file, only present when downloads are allowed. */
  download?: string
}

export const publicPhotoView = (media: Media): PhotoView => {
  const original = media.url || ''
  return {
    id: media.id,
    alt: media.alt || '',
    width: media.width || 1600,
    height: media.height || 1067,
    thumb: media.sizes?.thumbnail?.url || original,
    card: media.sizes?.card?.url || original,
    large: media.sizes?.large?.url || original,
  }
}

/** Server-only: builds signed URLs for a private photo. */
export const privatePhotoView = async (
  photo: ClientPhoto,
  options: { allowDownload?: boolean | null } = {},
): Promise<PhotoView> => {
  const { privatePhotoURL } = await import('./private-files')
  const [original, thumb, card, large, download] = await Promise.all([
    privatePhotoURL(photo),
    photo.sizes?.thumbnail?.filename ? privatePhotoURL(photo, 'thumbnail') : null,
    photo.sizes?.card?.filename ? privatePhotoURL(photo, 'card') : null,
    photo.sizes?.large?.filename ? privatePhotoURL(photo, 'large') : null,
    options.allowDownload ? privatePhotoURL(photo, undefined, { download: true }) : undefined,
  ])
  return {
    id: photo.id,
    alt: photo.alt || '',
    width: photo.width || 1600,
    height: photo.height || 1067,
    thumb: thumb || original,
    card: card || original,
    large: large || original,
    download,
  }
}
