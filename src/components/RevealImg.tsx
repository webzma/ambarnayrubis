'use client'

import type { ComponentProps } from 'react'

/** Marks the image as loaded so CSS can "develop" it (see `.reveal-img` in styles.css). */
const markWhenLoaded = (img: HTMLImageElement | null) => {
  if (!img) return
  const done = () => img.setAttribute('data-loaded', '')
  // Cached images may finish loading before hydration, when React can't see the event.
  if (img.complete && img.naturalWidth > 0) {
    done()
    return
  }
  img.addEventListener('load', done, { once: true })
  return () => img.removeEventListener('load', done)
}

export function RevealImg({ className = '', alt, ...props }: ComponentProps<'img'>) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img ref={markWhenLoaded} alt={alt} className={`reveal-img ${className}`} {...props} />
}
