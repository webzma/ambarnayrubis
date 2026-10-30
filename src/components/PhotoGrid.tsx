'use client'

import type { ReactNode } from 'react'
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

export function PhotoGrid({ photos, index, onIndexChange, autoplay = false, renderOverlay, renderToolbar }: Props) {
  const hasDownloads = photos.some((photo) => photo.download)

  return (
    <>
      <div className="masonry">
        {photos.map((photo, i) => (
          <figure key={photo.id} id={`foto-${photo.id}`} className="group relative overflow-hidden bg-line/50">
            <button type="button" onClick={() => onIndexChange(i)} className="block w-full cursor-zoom-in" aria-label={`Ver foto ${i + 1}`}>
              <Photo photo={photo} sizes="(min-width: 1600px) 20vw, (min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw" className="h-auto w-full" />
            </button>
            {renderOverlay?.(photo)}
          </figure>
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
