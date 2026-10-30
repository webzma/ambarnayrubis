type Props = {
  eyebrow: string
  title: string
  intro?: React.ReactNode
}

/** Shared heading block for inner pages. */
export function PageHeader({ eyebrow, title, intro }: Props) {
  return (
    <div className="animate-rise mx-auto mb-16 max-w-2xl text-center md:mb-20">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-4 font-serif text-5xl font-light md:text-6xl">{title}</h1>
      <span className="mx-auto mt-6 block h-px w-12 bg-accent" aria-hidden />
      {intro && <div className="mt-6 leading-relaxed text-muted">{intro}</div>}
    </div>
  )
}
