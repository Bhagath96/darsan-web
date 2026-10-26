import type { NavItem } from '@/components/common/navItems'

/** Admin portal menu. Each admin feature adds its page here; links are filtered by permission. */
export const ADMIN_NAV_ITEMS: NavItem[] = [{ to: '/admin', label: 'admin.home', end: true, permission: 'admin:access' }]
