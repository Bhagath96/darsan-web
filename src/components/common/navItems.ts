import type { MessageKey } from '@/i18n'
import { can, type Permission } from '@/lib/permissions'
import type { AuthUser } from '@/types'

export interface NavItem {
  to: string
  label: MessageKey
  /** Match the path exactly (for "/"). */
  end?: boolean
  /** Shown only to logged-in users. */
  requiresLogin?: boolean
  /** Shown only to users who have this permission. */
  permission?: Permission
}

/** Main navigation. Each module adds its links here. */
export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'nav.home', end: true },
  { to: '/temples', label: 'nav.temples' },
  { to: '/notifications', label: 'nav.notifications' },
]

/** The links this user is allowed to see. Guards still protect the routes themselves. */
export function visibleNavItems(user: AuthUser | null, items: NavItem[] = NAV_ITEMS): NavItem[] {
  return items.filter((item) => {
    if (item.requiresLogin && !user) return false
    if (item.permission && !can(user?.role, item.permission)) return false
    return true
  })
}
