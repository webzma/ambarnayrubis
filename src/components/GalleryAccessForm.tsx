'use client'

import { useActionState } from 'react'

import { accessGallery, unlockGallery, type FormState } from '@/app/(frontend)/actions'

type Props =
  /** Password prompt for a known gallery. */
  | { slug: string }
  /** Generic "client access" form: asks for the gallery code too. */
  | { slug?: undefined }

export function GalleryAccessForm({ slug }: Props) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    slug ? unlockGallery : accessGallery,
    {},
  )

  return (
    <form action={action} className="mx-auto flex w-full max-w-sm flex-col gap-8 text-left">
      {slug ? (
        <input type="hidden" name="slug" value={slug} />
      ) : (
        <label className="block">
          <span className="eyebrow">Código de la galería</span>
          <input name="code" required defaultValue={state.values?.code} key={state.values?.code} className="field" autoCapitalize="none" placeholder="ej. boda-ana-y-luis" />
        </label>
      )}
      <label className="block">
        <span className="eyebrow">Contraseña</span>
        <input name="password" type="password" className="field" autoComplete="current-password" required={Boolean(slug)} />
      </label>
      {state.error && <p className="text-center text-sm text-red-700">{state.error}</p>}
      <button type="submit" className="btn btn-solid" disabled={pending}>
        {pending ? 'Verificando…' : 'Ver galería'}
      </button>
    </form>
  )
}
