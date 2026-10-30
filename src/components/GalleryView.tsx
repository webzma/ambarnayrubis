'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import type { PhotoView } from '@/lib/photo-view'
import { PhotoGrid } from './PhotoGrid'

type Props = {
  slug: string
  photos: PhotoView[]
  allowDownloads: boolean
  allowFavorites: boolean
}

const emailKey = 'gallery-email'

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.6}>
      <path d="M12 20.5s-7.5-4.6-9.3-9.3C1.4 7.8 3.6 4.5 7 4.5c2 0 3.5 1.1 5 3 1.5-1.9 3-3 5-3 3.4 0 5.6 3.3 4.3 6.7-1.8 4.7-9.3 9.3-9.3 9.3z" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6}>
      <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19.5h14" />
    </svg>
  )
}

export function GalleryView({ slug, photos, allowDownloads, allowFavorites }: Props) {
  const [email, setEmail] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [askEmailFor, setAskEmailFor] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadFavorites = useCallback(
    async (value: string) => {
      const res = await fetch(`/g/${slug}/favoritos?email=${encodeURIComponent(value)}`)
      if (res.ok) setFavorites(new Set(((await res.json()) as { photos: number[] }).photos))
    },
    [slug],
  )

  useEffect(() => {
    if (!allowFavorites) return
    const saved = localStorage.getItem(emailKey)
    if (!saved) return
    let cancelled = false
    fetch(`/g/${slug}/favoritos?email=${encodeURIComponent(saved)}`)
      .then((res) => (res.ok ? (res.json() as Promise<{ photos: number[] }>) : { photos: [] }))
      .then(({ photos: ids }) => {
        if (cancelled) return
        setEmail(saved)
        setFavorites(new Set(ids))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [allowFavorites, slug])

  const toggle = useCallback(
    async (photoId: number, withEmail = email) => {
      if (!withEmail) {
        setAskEmailFor(photoId)
        return
      }
      // Optimistic update; the server response is the source of truth.
      setFavorites((prev) => {
        const next = new Set(prev)
        if (next.has(photoId)) next.delete(photoId)
        else next.add(photoId)
        return next
      })
      const res = await fetch(`/g/${slug}/favoritos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: withEmail, photoId }),
      })
      if (res.ok) {
        setFavorites(new Set(((await res.json()) as { photos: number[] }).photos))
        setError(null)
      } else {
        setError('No se pudo guardar el favorito.')
        void loadFavorites(withEmail)
      }
    },
    [email, slug, loadFavorites],
  )

  const submitEmail = async (formData: FormData) => {
    const value = String(formData.get('email') ?? '').trim().toLowerCase()
    if (!value) return
    localStorage.setItem(emailKey, value)
    setEmail(value)
    await loadFavorites(value)
    const pending = askEmailFor
    setAskEmailFor(null)
    if (pending !== null) await toggle(pending, value)
  }

  const visible = useMemo(
    () => (onlyFavorites ? photos.filter((photo) => favorites.has(photo.id)) : photos),
    [onlyFavorites, photos, favorites],
  )

  const heartButton = (photo: PhotoView, className: string) => (
    <button
      type="button"
      onClick={() => toggle(photo.id)}
      className={className}
      aria-pressed={favorites.has(photo.id)}
      aria-label={favorites.has(photo.id) ? 'Quitar de favoritos' : 'Añadir a favoritos'}
    >
      <Heart filled={favorites.has(photo.id)} />
    </button>
  )

  return (
    <div>
      <div className="sticky top-0 z-10 mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-line bg-paper/95 py-4 backdrop-blur">
        <p className="eyebrow">{photos.length} fotos</p>
        <div className="flex flex-wrap items-center gap-3">
          {allowFavorites && (
            <button
              type="button"
              onClick={() => setOnlyFavorites((v) => !v)}
              className={`btn !px-4 !py-2 ${onlyFavorites ? 'bg-ink text-paper' : ''}`}
            >
              <Heart filled={onlyFavorites} /> Favoritas ({favorites.size})
            </button>
          )}
          {allowDownloads && allowFavorites && email && favorites.size > 0 && (
            <a href={`/g/${slug}/descargar?email=${encodeURIComponent(email)}`} className="btn !px-4 !py-2">
              <DownloadIcon /> Descargar favoritas
            </a>
          )}
          {allowDownloads && (
            <a href={`/g/${slug}/descargar`} className="btn !px-4 !py-2">
              <DownloadIcon /> Descargar todo
            </a>
          )}
        </div>
      </div>

      {error && <p className="mb-4 text-center text-sm text-red-700">{error}</p>}

      {visible.length === 0 ? (
        <p className="py-20 text-center text-muted">Aún no has marcado ninguna foto como favorita.</p>
      ) : (
        <PhotoGrid
          photos={visible}
          renderOverlay={(photo) => (
            <div className="absolute right-2 bottom-2 flex gap-1 text-white opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
              {allowFavorites &&
                heartButton(photo, `rounded-full bg-black/35 p-2 backdrop-blur hover:bg-black/55 ${favorites.has(photo.id) ? 'text-red-300' : ''}`)}
              {photo.download && (
                <a href={photo.download} className="rounded-full bg-black/35 p-2 backdrop-blur hover:bg-black/55" aria-label="Descargar foto">
                  <DownloadIcon />
                </a>
              )}
            </div>
          )}
          renderToolbar={
            allowFavorites
              ? (photo) => heartButton(photo, `yarl__button ${favorites.has(photo.id) ? 'text-red-300' : ''}`)
              : undefined
          }
        />
      )}

      {askEmailFor !== null && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-6" onClick={() => setAskEmailFor(null)}>
          <form
            action={submitEmail}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm bg-paper p-8 text-center shadow-2xl"
          >
            <p className="font-serif text-2xl">Guarda tus favoritas</p>
            <p className="mt-3 text-sm text-muted">Escribe tu email para guardar tu selección y verla desde cualquier dispositivo.</p>
            <input name="email" type="email" required autoFocus placeholder="tu@email.com" className="field mt-6 text-center" />
            <button type="submit" className="btn mt-8 w-full">
              Continuar
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
