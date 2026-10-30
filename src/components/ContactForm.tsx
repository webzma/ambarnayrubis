'use client'

import { useActionState } from 'react'

import { submitInquiry, type FormState } from '@/app/(frontend)/actions'

const sessionTypes = ['Boda', 'Retrato', 'Familia', 'Maternidad', 'Evento', 'Comercial', 'Otro']

export function ContactForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(submitInquiry, {})

  const v = state.values ?? {}

  if (state.ok) {
    return (
      <div className="animate-rise flex flex-col items-center border border-line px-8 py-20 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sand text-accent" aria-hidden>
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </span>
        <p className="mt-8 font-serif text-4xl font-light">¡Gracias por escribir!</p>
        <p className="mt-4 text-muted">Te responderé lo antes posible.</p>
      </div>
    )
  }

  return (
    <form action={action} key={JSON.stringify(v)} className="grid gap-x-10 gap-y-9 md:grid-cols-2">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <label className="block">
        <span className="eyebrow">Nombre *</span>
        <input name="name" defaultValue={v.name} required className="field" autoComplete="name" />
      </label>
      <label className="block">
        <span className="eyebrow">Email *</span>
        <input name="email" defaultValue={v.email} type="email" required className="field" autoComplete="email" />
      </label>
      <label className="block">
        <span className="eyebrow">Teléfono</span>
        <input name="phone" defaultValue={v.phone} type="tel" className="field" autoComplete="tel" />
      </label>
      <label className="block">
        <span className="eyebrow">Tipo de sesión</span>
        <select name="eventType" className="field" defaultValue={v.eventType ?? ''}>
          <option value="" disabled>
            Selecciona…
          </option>
          {sessionTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </label>
      <label className="block md:col-span-2">
        <span className="eyebrow">Fecha del evento</span>
        <input name="eventDate" defaultValue={v.eventDate} type="date" className="field" />
      </label>
      <label className="block md:col-span-2">
        <span className="eyebrow">Cuéntame tu idea *</span>
        <textarea name="message" defaultValue={v.message} required rows={5} className="field resize-none" placeholder="Lugar, número de personas, estilo que te gusta…" />
      </label>
      <div className="flex flex-col items-start gap-4 md:col-span-2">
        {state.error && <p className="text-sm text-red-700">{state.error}</p>}
        <button type="submit" className="btn btn-solid w-full sm:w-auto" disabled={pending}>
          {pending ? 'Enviando…' : 'Enviar mensaje'}
        </button>
      </div>
    </form>
  )
}
