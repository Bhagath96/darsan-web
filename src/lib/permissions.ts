import type { UserRole } from '@/types'

/** Every action the app guards. One list for the UI, the route guards and the mock server. */
export type Permission =
  | 'booking:create'
  | 'booking:viewOwn'
  | 'booking:viewAny'
  | 'booking:cancelOwn'
  | 'booking:cancelAny'
  | 'order:create'
  | 'order:viewAny'
  | 'order:cancelAny'
  | 'catalog:manage'
  | 'dashboard:view'

const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  DEVOTEE: ['booking:create', 'booking:viewOwn', 'booking:cancelOwn', 'order:create'],
  STAFF: [
    'booking:create',
    'booking:viewOwn',
    'booking:viewAny',
    'booking:cancelOwn',
    'booking:cancelAny',
    'order:create',
    'order:viewAny',
    'order:cancelAny',
  ],
  ADMIN: [
    'booking:create',
    'booking:viewOwn',
    'booking:viewAny',
    'booking:cancelOwn',
    'booking:cancelAny',
    'order:create',
    'order:viewAny',
    'order:cancelAny',
    'catalog:manage',
    'dashboard:view',
  ],
}

export function can(role: UserRole | null | undefined, permission: Permission): boolean {
  return role ? ROLE_PERMISSIONS[role].includes(permission) : false
}
