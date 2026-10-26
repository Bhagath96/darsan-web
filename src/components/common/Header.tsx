import { Link, NavLink } from 'react-router'
import { useT } from '@/i18n'
import type { MessageKey } from '@/i18n'
import { cn } from '@/lib/utils'

export interface NavItem {
  to: string
  label: MessageKey
}

/** Navigation links. Features add their entry here as they are built. */
export const NAV_ITEMS: NavItem[] = [{ to: '/', label: 'nav.home' }]

export function Header() {
  const { t } = useT()
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <Link to="/" className="flex min-w-0 items-center gap-2 rounded-md">
          <span
            aria-hidden="true"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-primary font-heading text-lg text-primary-foreground"
          >
            ॐ
          </span>
          <span className="min-w-0">
            <span className="block font-heading text-lg leading-tight font-semibold text-primary">
              {t('app.name')}
            </span>
            <span className="hidden text-xs text-muted-foreground sm:block">{t('app.tagline')}</span>
          </span>
        </Link>

        <nav aria-label={t('nav.main')} className="ms-auto">
          <ul className="flex flex-wrap items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium hover:bg-secondary',
                      isActive && 'bg-secondary text-secondary-foreground',
                    )
                  }
                >
                  {t(item.label)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
