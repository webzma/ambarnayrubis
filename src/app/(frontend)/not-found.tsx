import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center">
      <p className="font-serif text-[9rem] leading-none font-light text-line md:text-[12rem]">404</p>
      <h1 className="-mt-6 font-serif text-4xl font-light md:text-5xl">Página no encontrada</h1>
      <p className="mt-5 max-w-sm text-muted">Puede que el enlace haya cambiado o que la página ya no exista.</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-solid">
          Volver al inicio
        </Link>
        <Link href="/portafolio" className="btn">
          Ver portafolio
        </Link>
      </div>
    </div>
  )
}
