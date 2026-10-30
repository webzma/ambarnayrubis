'use client'

import { useEffect, useState } from 'react'

import type { PhotoView } from '@/lib/photo-view'
import { Photo } from './Photo'

/** Full-screen crossfading hero with a slow zoom and progress indicators. */
export function HeroSlideshow({ photos, interval = 6000 }: { photos: PhotoView[]; interval?: number }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (photos.length < 2) return
    const timer = setTimeout(() => setCurrent((i) => (i + 1) % photos.length), interval)
    return () => clearTimeout(timer)
  }, [current, photos.length, interval])

  if (photos.length === 0) return <div className="absolute inset-0 bg-ink" />

  return (
    <>
      <div className="absolute inset-0 overflow-hidden bg-ink">
        {photos.map((photo, i) => (
          <div
            key={photo.id}
            className={`absolute inset-0 transition-opacity duration-[2000ms] ${i === current ? 'opacity-100' : 'opacity-0'}`}
            aria-hidden={i !== current}
          >
            {/* Remount on activation so the zoom restarts with each slide. */}
            <div key={i === current ? `on-${current}` : 'off'} className={`h-full w-full ${i === current ? 'animate-ken-burns' : ''}`}>
              <Photo photo={photo} sizes="100vw" priority={i === 0} className="h-full w-full object-cover" />
            </div>
          </div>
        ))}
      </div>

      {photos.length > 1 && (
        <div className="absolute bottom-10 left-6 z-10 flex gap-2 md:left-10">
          {photos.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setCurrent(i)}
              className="group py-3"
              aria-label={`Ver foto ${i + 1}`}
              aria-current={i === current}
            >
              <span className="block h-px w-10 overflow-hidden bg-white/35 md:w-14">
                {i === current && (
                  <span
                    key={current}
                    className="animate-progress block h-full w-full bg-white"
                    style={{ animationDuration: `${interval}ms` }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </>
  )
}
