'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { PhotoView } from '@/lib/photo-view'
import { DownloadIcon, HeartIcon, PlayIcon, ShareIcon } from './icons'
import { PhotoGrid } from './PhotoGrid'

type Props = {
  slug: string
  title: string
  siteName: string
  photos: PhotoView[]
  allowDownloads: boolean
  allowFavorites: boolean
}

const emailKey = 'gallery-email'

export function GalleryView({ slug, title, siteName, photos, allowDownloads, allowFavorites }: Props) {
  const [email, setEmail] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [askEmailFor, setAskEmailFor] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [index, setIndex] = useState(-1)
  const [autoplay, setAutoplay] = useState(false)
  const [downloadMenu, setDownloadMenu] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

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

  const visible = useMemo(
    () => (onlyFavorites ? photos.filter((photo) => favorites.has(photo.id)) : photos),
    [onlyFavorites, photos, favorites],
  )

  // Shared photo links (#foto-<id>) open that photo in the lightbox.
  useEffect(() => {
    const match = /^#foto-(\d+)$/.exec(window.location.hash)
    if (!match) return
    const target = photos.findIndex((photo) => photo.id === Number(match[1]))
    if (target < 0) return
    const frame = requestAnimationFrame(() => setIndex(target))
    return () => cancelAnimationFrame(frame)
  }, [photos])

  const notify = (message: string) => {
    clearTimeout(toastTimer.current)
    setToast(message)
    toastTimer.current = setTimeout(() => setToast(null), 2500)
  }

  const share = async (url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        // dismissed by the user
      }
      return
    }
    await navigator.clipboard.writeText(url)
    notify('Enlace copiado')
  }

  const galleryURL = () => `${window.location.origin}/g/${slug}`

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

  const changeIndex = (i: number) => {
    // Closing the lightbox ends the slideshow; a later click opens it paused.
    if (i < 0) setAutoplay(false)
    setIndex(i)
  }

  const startSlideshow = () => {
    if (visible.length === 0) return
    setAutoplay(true)
    setIndex(0)
  }

  const canDownloadFavorites = allowDownloads && allowFavorites && email && favorites.size > 0
  const overlayButton = 'flex h-9 w-9 items-center justify-center text-white transition-transform hover:scale-110'

  return (
    <div>
      <div className="sticky top-0 z-30 flex items-center justify-between gap-4 bg-white/95 px-4 py-3 backdrop-blur md:px-6">
        <div className="min-w-0">
          <p className="truncate font-display text-lg tracking-wide">{title}</p>
          <p className="text-[10px] tracking-[0.2em] text-muted uppercase">{siteName}</p>
        </div>
        <div className="flex shrink-0 items-center">
          {allowFavorites && (
            <button
              type="button"
              onClick={() => setOnlyFavorites((v) => !v)}
              className="icon-btn relative"
              aria-pressed={onlyFavorites}
              aria-label={onlyFavorites ? 'Ver todas las fotos' : `Ver favoritas (${favorites.size})`}
              title={onlyFavorites ? 'Ver todas' : 'Ver favoritas'}
            >
              <HeartIcon filled={onlyFavorites} />
              {favorites.size > 0 && (
                <span className="absolute top-1 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[9px] text-white">
                  {favorites.size}
                </span>
              )}
            </button>
          )}
          {allowDownloads && (
            <div className="relative">
              {canDownloadFavorites ? (
                <button type="button" onClick={() => setDownloadMenu((v) => !v)} className="icon-btn" aria-label="Descargar" aria-expanded={downloadMenu} title="Descargar">
                  <DownloadIcon />
                </button>
              ) : (
                <a href={`/g/${slug}/descargar`} className="icon-btn" aria-label="Descargar todas las fotos" title="Descargar todas">
                  <DownloadIcon />
                </a>
              )}
              {downloadMenu && canDownloadFavorites && (
                <div className="absolute right-0 mt-2 w-56 border border-line bg-white py-2 text-sm shadow-lg" onMouseLeave={() => setDownloadMenu(false)}>
                  <a href={`/g/${slug}/descargar`} className="block px-4 py-2 hover:bg-line/50" onClick={() => setDownloadMenu(false)}>
                    Todas las fotos ({photos.length})
                  </a>
                  <a
                    href={`/g/${slug}/descargar?email=${encodeURIComponent(email!)}`}
                    className="block px-4 py-2 hover:bg-line/50"
                    onClick={() => setDownloadMenu(false)}
                  >
                    Mis favoritas ({favorites.size})
                  </a>
                </div>
              )}
            </div>
          )}
          <button type="button" onClick={() => share(galleryURL())} className="icon-btn" aria-label="Compartir galería" title="Compartir">
            <ShareIcon />
          </button>
          <button type="button" onClick={startSlideshow} className="icon-btn" aria-label="Ver presentación" title="Presentación">
            <PlayIcon />
          </button>
        </div>
      </div>

      {error && <p className="py-2 text-center text-sm text-red-700">{error}</p>}

      <div className="px-1.5 pt-1.5">
        {visible.length === 0 ? (
          <p className="py-24 text-center text-muted">Aún no has marcado ninguna foto como favorita.</p>
        ) : (
          <PhotoGrid
            photos={visible}
            index={index}
            onIndexChange={changeIndex}
            autoplay={autoplay}
            renderOverlay={(photo) => {
              const favorite = favorites.has(photo.id)
              return (
                <>
                  {favorite && (
                    <span className="pointer-events-none absolute top-2 right-2 text-white drop-shadow md:group-hover:opacity-0">
                      <HeartIcon filled className="h-4 w-4" />
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-gradient-to-t from-black/35 to-transparent px-1 pt-6 pb-0.5 md:from-black/45 md:px-2 md:pt-8 md:pb-1.5 opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
                    {allowFavorites && (
                      <button
                        type="button"
                        onClick={() => toggle(photo.id)}
                        className={overlayButton}
                        aria-pressed={favorite}
                        aria-label={favorite ? 'Quitar de favoritas' : 'Añadir a favoritas'}
                      >
                        <HeartIcon filled={favorite} />
                      </button>
                    )}
                    {photo.download && (
                      <a href={photo.download} className={`${overlayButton} max-md:hidden`} aria-label="Descargar foto">
                        <DownloadIcon />
                      </a>
                    )}
                    <button type="button" onClick={() => share(`${galleryURL()}#foto-${photo.id}`)} className={`${overlayButton} max-md:hidden`} aria-label="Compartir foto">
                      <ShareIcon />
                    </button>
                  </div>
                </>
              )
            }}
            renderToolbar={
              allowFavorites
                ? (photo) => (
                    <button
                      type="button"
                      onClick={() => toggle(photo.id)}
                      className="yarl__button"
                      aria-pressed={favorites.has(photo.id)}
                      aria-label={favorites.has(photo.id) ? 'Quitar de favoritas' : 'Añadir a favoritas'}
                    >
                      <HeartIcon filled={favorites.has(photo.id)} className="h-7 w-7" />
                    </button>
                  )
                : undefined
            }
          />
        )}
      </div>

      {askEmailFor !== null && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-6" onClick={() => setAskEmailFor(null)}>
          <form action={submitEmail} onClick={(event) => event.stopPropagation()} className="w-full max-w-sm bg-white p-8 text-center shadow-2xl">
            <p className="heading text-base">Guarda tus favoritas</p>
            <p className="mt-3 text-sm text-muted">Escribe tu email para guardar tu selección y verla desde cualquier dispositivo.</p>
            <input name="email" type="email" required autoFocus placeholder="tu@email.com" className="field mt-6 text-center" />
            <button type="submit" className="btn mt-8 w-full bg-ink text-paper hover:bg-ink/85">
              Continuar
            </button>
          </form>
        </div>
      )}

      <div
        role="status"
        className={`fixed bottom-6 left-1/2 z-[10001] -translate-x-1/2 bg-ink px-5 py-2.5 text-sm text-white transition-opacity duration-300 ${toast ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      >
        {toast}
      </div>
    </div>
  )
}
