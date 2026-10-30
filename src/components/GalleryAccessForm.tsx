'use client'

import { useActionState } from 'react'

import { accessGallery, unlockGallery, type FormState } from '@/app/(frontend)/actions'

type Props = {
  /** `light`: white text, for use over the gallery cover photo. */
  tone?: 'dark' | 'light'
} & (
  /** Password prompt for a known gallery. */
  | { slug: string }
  /** Generic "client access" form: asks for the gallery code too. */
  | { slug?: undefined }
)

export function GalleryAccessForm({ slug, tone = 'dark' }: Props) {
  const [state, action, pending] = useActionState<FormState, FormData>(slug ? unlockGallery : accessGallery, {})
  const light = tone === 'light'
  const field = light ? 'field border-white/50 text-center text-white placeholder:text-white/70 focus:border-white' : 'field'

  return (
    <form action={action} className="mx-auto flex w-full max-w-sm flex-col gap-6">
      {slug ? (
        <input type="hidden" name="slug" value={slug} />
      ) : (
        <label className="block text-left">
          <span className="label">Código de la galería</span>
          <input name="code" required defaultValue={state.values?.code} key={state.values?.code} className={field} autoCapitalize="none" placeholder="ej. cumple-siulary" />
        </label>
      )}
      <label className={`block ${slug ? '' : 'text-left'}`}>
        {slug ? <span className="sr-only">Contraseña</span> : <span className="label">Contraseña</span>}
        <input
          name="password"
          type="password"
          className={field}
          autoComplete="current-password"
          placeholder={slug ? 'Contraseña de la galería' : undefined}
          required={Boolean(slug)}
        />
      </label>
      {state.error && <p className={`text-center text-sm ${light ? 'text-white' : 'text-red-700'}`}>{state.error}</p>}
      <button type="submit" className={`btn ${light ? 'btn-light' : 'bg-ink text-paper hover:bg-ink/85'}`} disabled={pending}>
        {pending ? 'Verificando…' : 'Ver galería'}
      </button>
    </form>
  )
}
