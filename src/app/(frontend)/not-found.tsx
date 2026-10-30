import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 text-center">
      <p className="label">Error 404</p>
      <h1 className="heading mt-4 text-2xl">Página no encontrada</h1>
      <p className="mt-5 max-w-sm text-muted">Puede que el enlace haya cambiado o que la galería ya no esté disponible.</p>
      <Link href="/" className="btn mt-10">
        Ver todas las galerías
      </Link>
    </div>
  )
}
