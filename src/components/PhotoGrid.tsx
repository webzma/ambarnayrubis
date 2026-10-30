'use client'

import { useState, type ReactNode } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import Download from 'yet-another-react-lightbox/plugins/download'
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/plugins/counter.css'
import 'yet-another-react-lightbox/styles.css'

import type { PhotoView } from '@/lib/photo-view'
import { Photo } from './Photo'

type Props = {
  photos: PhotoView[]
  /** Extra controls rendered over each photo (favorites, download…). */
  renderOverlay?: (photo: PhotoView) => ReactNode
  /** Extra button(s) for the lightbox toolbar, for the current photo. */
  renderToolbar?: (photo: PhotoView) => ReactNode
}

export function PhotoGrid({ photos, renderOverlay, renderToolbar }: Props) {
  const [index, setIndex] = useState(-1)
  const hasDownloads = photos.some((photo) => photo.download)

  return (
    <>
      <div className="masonry">
        {photos.map((photo, i) => (
          <figure key={photo.id} className="group relative overflow-hidden bg-line/40">
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="block w-full cursor-zoom-in"
              aria-label={`Ver foto ${i + 1}`}
            >
              <Photo
                photo={photo}
                className="h-auto w-full transition duration-700 group-hover:scale-[1.02] group-hover:opacity-95"
              />
            </button>
            {renderOverlay?.(photo)}
          </figure>
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        on={{ view: ({ index: current }) => setIndex(current) }}
        plugins={[Counter, Fullscreen, Zoom, ...(hasDownloads ? [Download] : [])]}
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
            ...(hasDownloads ? ['download'] : []),
            'fullscreen',
            'close',
          ].filter(Boolean),
        }}
        styles={{ container: { backgroundColor: 'rgba(15, 14, 13, 0.97)' } }}
        controller={{ closeOnBackdropClick: true }}
      />
    </>
  )
}
