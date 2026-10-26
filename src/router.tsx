import type { RouteObject } from 'react-router'
import { AdminLayout } from '@/layouts/AdminLayout'
import { AppLayout } from '@/layouts/AppLayout'
import { RequireAuth, RequireRole } from '@/layouts/guards'
import { AccountPage } from '@/pages/AccountPage'
import { AdminHomePage } from '@/pages/admin/AdminHomePage'
import { ForbiddenPage } from '@/pages/ForbiddenPage'
import { HomePage } from '@/pages/HomePage'
import { LoginPage, StaffLoginPage } from '@/pages/LoginPage'
import { NoticeDetailPage } from '@/pages/NoticeDetailPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { NotificationsPage } from '@/pages/NotificationsPage'
import { RegisterPage } from '@/pages/RegisterPage'
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
          // Public website
          { index: true, element: <HomePage /> },
          { path: 'temples', element: <TemplesPage /> },
          { path: 'temples/:templeId', element: <TempleDetailPage /> },
          { path: 'notifications', element: <NotificationsPage /> },
          { path: 'notifications/:noticeId', element: <NoticeDetailPage /> },

          // Accounts
          { path: 'login', element: <LoginPage /> },
          { path: 'admin/login', element: <StaffLoginPage /> },
          { path: 'register', element: <RegisterPage /> },
          { path: '403', element: <ForbiddenPage /> },
          {
            element: <RequireAuth />,
            children: [{ path: 'account', element: <AccountPage /> }],
          },

          // Admin portal: staff and admins only
          {
            path: 'admin',
            element: <RequireRole roles={['STAFF', 'ADMIN']} />,
            children: [
              {
                element: <AdminLayout />,
                children: [{ index: true, element: <AdminHomePage /> }],
              },
            ],
          },

          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]
