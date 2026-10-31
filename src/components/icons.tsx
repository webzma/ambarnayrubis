type IconProps = { className?: string; filled?: boolean }

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

export const HeartIcon = ({ className = 'h-5 w-5', filled }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} fill={filled ? 'currentColor' : 'none'} aria-hidden>
    <path d="M12 20.5s-7.5-4.6-9.3-9.3C1.4 7.8 3.6 4.5 7 4.5c2 0 3.5 1.1 5 3 1.5-1.9 3-3 5-3 3.4 0 5.6 3.3 4.3 6.7-1.8 4.7-9.3 9.3-9.3 9.3z" />
  </svg>
)

export const DownloadIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden>
    <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19.5h14" />
  </svg>
)

export const ShareIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden>
    <path d="M14 5l6 6-6 6M20 11h-8a8 8 0 0 0-8 8" />
  </svg>
)

export const PlayIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden>
    <path d="M7 4.5v15l12-7.5z" />
  </svg>
)

export const LockIcon = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} strokeWidth={2} aria-hidden>
    <rect x="5" y="10.5" width="14" height="10" rx="1.5" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
  </svg>
)

export const SearchIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m20 20-4.8-4.8" />
  </svg>
)

export const MailIcon = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden>
    <rect x="3.5" y="5.5" width="17" height="13" rx="1" />
    <path d="m4 6.5 8 6 8-6" />
  </svg>
)

export const ChevronIcon = ({ className = 'h-4 w-4', direction = 'right' }: IconProps & { direction?: 'left' | 'right' }) => (
  <svg viewBox="0 0 24 24" className={`${className} ${direction === 'left' ? 'rotate-180' : ''}`} {...stroke} strokeWidth={2} aria-hidden>
    <path d="m9 6 6 6-6 6" />
  </svg>
)

export const FacebookIcon = ({ className = 'h-[18px] w-[18px]' }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3Z" />
  </svg>
)

export const InstagramIcon = ({ className = 'h-[18px] w-[18px]' }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} strokeWidth={1.8} aria-hidden>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
  </svg>
)

export const TikTokIcon = ({ className = 'h-[18px] w-[18px]' }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M16.6 3c.3 2.2 1.6 3.6 3.9 3.8v2.6c-1.4.1-2.6-.3-3.9-1.1v5.3c0 6.6-7.2 8.7-10.1 4-1.9-3-.7-8.4 5.4-8.6v2.8c-.5.1-1 .2-1.4.4-1.4.5-2.2 1.4-2 3 .4 3 6 3.9 5.5-1.9V3h2.6Z" />
  </svg>
)

export const SunIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
  </svg>
)

export const MoonIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden>
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
  </svg>
)
