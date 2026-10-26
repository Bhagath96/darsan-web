import { LogOut, UserRound } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLogout } from '@/hooks/useLogout'
import { useT } from '@/i18n'
import type { AuthUser } from '@/types'

export function RoleBadge({ user }: { user: AuthUser }) {
  const { t } = useT()
  return (
    <Badge variant={user.role === 'DEVOTEE' ? 'secondary' : 'default'}>{t(`role.${user.role}`)}</Badge>
  )
}

/** Account button with name, role and "Log out" (desktop header). */
export function UserMenu({ user }: { user: AuthUser }) {
  const { t } = useT()
  const logout = useLogout()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-11 max-w-48 gap-2 px-3" aria-label={t('user.menu', { name: user.name })}>
          <UserRound aria-hidden="true" />
          <span className="truncate">{user.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="space-y-1">
          <span className="block font-medium">{user.name}</span>
          <span className="block text-xs text-muted-foreground">{user.phone}</span>
          <RoleBadge user={user} />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={logout}>
          <LogOut aria-hidden="true" />
          {t('user.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
