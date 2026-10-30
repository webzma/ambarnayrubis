import { SiteHeader } from '@/components/SiteHeader'
import { getSettings } from '@/lib/content'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()
  return (
    <>
      <SiteHeader settings={settings} />
      {children}
    </>
  )
}
