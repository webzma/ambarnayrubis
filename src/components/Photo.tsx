import type { PhotoView } from '@/lib/photo-view'

type Props = {
  photo: PhotoView
  sizes?: string
  className?: string
  priority?: boolean
}

/**
 * Responsive <img> built from the sizes Payload generates at upload time.
 * Deliberately not next/image: files already come resized/WebP from R2, so
 * there's no need to pay for Vercel's image optimization.
 */
export function Photo({ photo, sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw', className, priority }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={photo.card}
      srcSet={`${photo.thumb} 480w, ${photo.card} 1080w, ${photo.large} 2048w`}
      sizes={sizes}
      width={photo.width}
      height={photo.height}
      alt={photo.alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      className={className}
    />
  )
}
