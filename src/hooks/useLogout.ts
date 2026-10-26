import { toast } from 'sonner'
import { useT } from '@/i18n'
import { logoutRequested } from '@/store/auth/authSlice'
import { useAppDispatch } from '@/store/hooks'

/** Logs out and confirms it with a toast. Shared by the desktop menu and the mobile sheet. */
export function useLogout() {
  const { t } = useT()
  const dispatch = useAppDispatch()
  return () => {
    dispatch(logoutRequested())
    toast.success(t('user.loggedOut'))
  }
}
