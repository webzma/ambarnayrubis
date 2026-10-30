'use server'

import { redirect } from 'next/navigation'

import { slugify } from '@/fields/slug'
import { getGalleryBySlug, grantGalleryAccess, isExpired } from '@/lib/galleries'
import { getPayloadClient } from '@/lib/payload'
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

const inquiryFields = ['name', 'email', 'phone', 'eventType', 'eventDate', 'message']

export async function submitInquiry(_prev: FormState, formData: FormData): Promise<FormState> {
  // Honeypot: bots fill every field, humans never see this one.
  if (text(formData, 'website')) return { ok: true }

  const name = text(formData, 'name')
  const email = text(formData, 'email')
  const message = text(formData, 'message')
  if (!name || !email || !message) return { error: 'Completa nombre, email y mensaje.', values: echo(formData, inquiryFields) }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'El email no es válido.', values: echo(formData, inquiryFields) }

  const eventDate = text(formData, 'eventDate')
  const payload = await getPayloadClient()
  try {
    await payload.create({
      collection: 'inquiries',
      overrideAccess: true,
      data: {
        name: name.slice(0, 200),
        email,
        phone: text(formData, 'phone').slice(0, 50),
        eventType: text(formData, 'eventType').slice(0, 100),
        eventDate: eventDate ? new Date(eventDate).toISOString() : undefined,
        message: message.slice(0, 5000),
      },
    })
  } catch (err) {
    payload.logger.error({ err, msg: 'Error guardando consulta' })
    return { error: 'No pudimos enviar tu mensaje. Inténtalo de nuevo.', values: echo(formData, inquiryFields) }
  }
  return { ok: true }
}

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
