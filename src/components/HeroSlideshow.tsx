'use client'

import { useEffect, useState } from 'react'

import type { PhotoView } from '@/lib/photo-view'
import { Photo } from './Photo'

/** Full-screen crossfading hero. */
export function HeroSlideshow({ photos, interval = 6000 }: { photos: PhotoView[]; interval?: number }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (photos.length < 2) return
    const timer = setInterval(() => setCurrent((i) => (i + 1) % photos.length), interval)
    return () => clearInterval(timer)
  }, [photos.length, interval])

  if (photos.length === 0) return <div className="absolute inset-0 bg-ink" />

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink">
      {photos.map((photo, i) => (
        <div
          key={photo.id}
          className={`absolute inset-0 transition-opacity duration-[2000ms] ${i === current ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden={i !== current}
        >
          <Photo photo={photo} sizes="100vw" priority={i === 0} className="h-full w-full object-cover" />
        </div>
      ))}
    </div>
  )
}
