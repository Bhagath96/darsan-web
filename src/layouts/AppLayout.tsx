import { useEffect } from 'react'
import { Outlet } from 'react-router'
import { Announcer } from '@/components/common/Announcer'
import { Footer } from '@/components/common/Footer'
import { Header } from '@/components/common/Header'
import { MAIN_CONTENT_ID, SkipLink } from '@/components/common/SkipLink'
import { Toaster } from '@/components/ui/sonner'
import { useT } from '@/i18n'

/** Page frame shared by every route: skip link, header, main landmark, footer, toasts. */
export function AppLayout() {
  const { lang } = useT()

  // Keep <html lang> in sync so screen readers use the right voice.
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink />
      <Header />
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 outline-none">
        <Outlet />
      </main>
      <Footer />
      <Announcer />
      <Toaster position="top-center" richColors closeButton />
    </div>
  )
}
