import { SiteTopBar } from '@/components/SiteTopBar'
import { getSettings } from '@/lib/content'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()
  return (
    <>
      <SiteTopBar settings={settings} />
      {children}
    </>
  )
}
