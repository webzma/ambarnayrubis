import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-4 font-serif text-5xl">Página no encontrada</h1>
      <Link href="/" className="btn mt-10">
        Volver al inicio
      </Link>
    </div>
  )
}
