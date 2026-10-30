import type { SiteSetting } from '@/payload-types'
import { FacebookIcon, InstagramIcon, TikTokIcon } from './icons'

type Props = { settings: SiteSetting; className?: string; iconClassName?: string }

/** Facebook / Instagram / TikTok icons for the networks configured in Ajustes del sitio. */
export function SocialLinks({ settings, className = '', iconClassName }: Props) {
  const socials = [
    { href: settings.facebook, label: 'Facebook', Icon: FacebookIcon },
    { href: settings.instagram, label: 'Instagram', Icon: InstagramIcon },
    { href: settings.tiktok, label: 'TikTok', Icon: TikTokIcon },
  ].filter((social) => Boolean(social.href))

  if (socials.length === 0) return null

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {socials.map(({ href, label, Icon }) => (
        <a key={label} href={href!} target="_blank" rel="noopener noreferrer" aria-label={label} className="icon-btn !w-9 text-muted hover:text-ink">
          <Icon className={iconClassName} />
        </a>
      ))}
    </div>
  )
}
