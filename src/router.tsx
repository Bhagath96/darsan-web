import type { RouteObject } from 'react-router'
import { AppLayout } from '@/layouts/AppLayout'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { NoticeDetailPage } from '@/pages/NoticeDetailPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { NotificationsPage } from '@/pages/NotificationsPage'
import { RouteErrorPage } from '@/pages/RouteErrorPage'
import { TempleDetailPage } from '@/pages/TempleDetailPage'
import { TemplesPage } from '@/pages/TemplesPage'

/** Route table. Exported as plain objects so tests can mount it in a memory router. */
export const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        errorElement: <RouteErrorPage />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'temples', element: <TemplesPage /> },
          { path: 'temples/:templeId', element: <TempleDetailPage /> },
          { path: 'notifications', element: <NotificationsPage /> },
          { path: 'notifications/:noticeId', element: <NoticeDetailPage /> },
          { path: 'login', element: <LoginPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]
