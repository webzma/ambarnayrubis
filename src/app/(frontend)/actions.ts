'use server'

import { redirect } from 'next/navigation'

import { slugify } from '@/fields/slug'
import { getGalleryBySlug, grantGalleryAccess, isExpired } from '@/lib/galleries'
import { safeEqual } from '@/lib/tokens'

export type FormState = {
  ok?: boolean
  error?: string
  /** Submitted values, echoed back on error because React resets forms after an action. */
  values?: Record<string, string>
}

const text = (formData: FormData, key: string) => String(formData.get(key) ?? '').trim()

const echo = (formData: FormData, keys: string[]) =>
  Object.fromEntries(keys.map((key) => [key, text(formData, key)]))

/** Unlocks a password-protected gallery and sets the access cookie. */
export async function unlockGallery(_prev: FormState, formData: FormData): Promise<FormState> {
  const slug = text(formData, 'slug')
  const password = text(formData, 'password')
  const gallery = await getGalleryBySlug(slug)

  const values = echo(formData, ['code'])
  if (!gallery || isExpired(gallery)) return { error: 'Esta galería no está disponible.', values }
  if (gallery.password && !safeEqual(password, gallery.password)) {
    return { error: 'Contraseña incorrecta.', values }
  }

  await grantGalleryAccess(gallery)
  redirect(`/g/${gallery.slug}`)
}

/** "Client access" page: gallery code + password in one step. */
export async function accessGallery(prev: FormState, formData: FormData): Promise<FormState> {
  const slug = slugify(text(formData, 'code'))
  if (!slug) return { error: 'Escribe el código de tu galería.' }
  formData.set('slug', slug)
  return unlockGallery(prev, formData)
}
