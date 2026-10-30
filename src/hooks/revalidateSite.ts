import { revalidatePath } from 'next/cache'

/**
 * Public pages are statically cached (ISR). Any content change purges the whole
 * site cache; it is small enough that a granular strategy isn't worth it.
 * Outside a Next.js request (CLI, migrations) revalidatePath throws, so we ignore it.
 */
export const revalidateSite = () => {
  try {
    revalidatePath('/', 'layout')
  } catch {
    // not running inside Next.js
  }
}

export const revalidateAfterChange = <T>({ doc }: { doc: T }): T => {
  revalidateSite()
  return doc
}
