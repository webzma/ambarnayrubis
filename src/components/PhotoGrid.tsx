'use client'

import { useMemo, useSyncExternalStore, type ReactNode } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import Download from 'yet-another-react-lightbox/plugins/download'
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/plugins/counter.css'
import 'yet-another-react-lightbox/styles.css'

import type { PhotoView } from '@/lib/photo-view'
import { Photo } from './Photo'

type Props = {
  photos: PhotoView[]
  /** Open photo in the lightbox, or -1 when closed. */
  index: number
  onIndexChange: (index: number) => void
  /** Start the slideshow automatically when the lightbox opens. */
  autoplay?: boolean
  /** Extra controls rendered over each photo (favorites, download…). */
  renderOverlay?: (photo: PhotoView) => ReactNode
  /** Extra button(s) for the lightbox toolbar, for the current photo. */
  renderToolbar?: (photo: PhotoView) => ReactNode
}

// Column count per viewport width, widest first.
const breakpoints: [query: string, columns: number][] = [
  ['(min-width: 1600px)', 5],
  ['(min-width: 1280px)', 4],
  ['(min-width: 768px)', 3],
]

const subscribe = (onChange: () => void) => {
  const lists = breakpoints.map(([query]) => window.matchMedia(query))
  lists.forEach((list) => list.addEventListener('change', onChange))
  return () => lists.forEach((list) => list.removeEventListener('change', onChange))
}
const getColumnCount = () => breakpoints.find(([query]) => window.matchMedia(query).matches)?.[1] ?? 2

/**
 * Masonry layout that reads left to right: each photo goes into the currently shortest column,
 * using the stored image dimensions so it's stable before the images load.
 */
function useMasonry(photos: PhotoView[]) {
  // The server can't know the viewport; the gallery sits below a full-screen cover, so the
  // switch to the real column count after hydration isn't visible.
  const columns = useSyncExternalStore(subscribe, getColumnCount, () => 4)

  return useMemo(() => {
    const heights = Array<number>(columns).fill(0)
    const result = Array.from({ length: columns }, () => [] as { photo: PhotoView; index: number }[])
    photos.forEach((photo, index) => {
      const shortest = heights.indexOf(Math.min(...heights))
      result[shortest].push({ photo, index })
      heights[shortest] += photo.height / photo.width
    })
    return result
  }, [photos, columns])
}

export function PhotoGrid({ photos, index, onIndexChange, autoplay = false, renderOverlay, renderToolbar }: Props) {
  const hasDownloads = photos.some((photo) => photo.download)
  const columns = useMasonry(photos)

  return (
    <>
      <div className="flex items-start gap-1.5">
        {columns.map((column, c) => (
          <div key={c} className="flex min-w-0 flex-1 flex-col gap-1.5">
            {column.map(({ photo, index: i }) => (
              <figure key={photo.id} id={`foto-${photo.id}`} className="group relative overflow-hidden bg-line/50">
                <button type="button" onClick={() => onIndexChange(i)} className="block w-full cursor-zoom-in" aria-label={`Ver foto ${i + 1}`}>
                  <Photo
                    photo={photo}
                    sizes="(min-width: 1600px) 20vw, (min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                    className="block h-auto w-full"
                  />
                </button>
                {renderOverlay?.(photo)}
              </figure>
            ))}
          </div>
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => onIndexChange(-1)}
        on={{ view: ({ index: current }) => onIndexChange(current) }}
        plugins={[Counter, Fullscreen, Slideshow, Zoom, ...(hasDownloads ? [Download] : [])]}
        slideshow={{ autoplay, delay: 3500 }}
        slides={photos.map((photo) => ({
          src: photo.large,
          alt: photo.alt,
          width: photo.width,
          height: photo.height,
          srcSet: [
            { src: photo.card, width: 1080, height: Math.round((photo.height / photo.width) * 1080) },
            { src: photo.large, width: 2048, height: Math.round((photo.height / photo.width) * 2048) },
          ],
          download: photo.download ?? false,
        }))}
        toolbar={{
          buttons: [
            index >= 0 && photos[index] && renderToolbar ? (
              <div key="custom" className="flex items-center">
                {renderToolbar(photos[index])}
              </div>
            ) : null,
            'slideshow',
            ...(hasDownloads ? ['download'] : []),
            'fullscreen',
            'close',
          ].filter(Boolean),
        }}
        controller={{ closeOnBackdropClick: true }}
      />
    </>
  )
}
