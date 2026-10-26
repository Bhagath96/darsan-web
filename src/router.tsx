import type { RouteObject } from 'react-router'
import { AdminLayout } from '@/layouts/AdminLayout'
import { AppLayout } from '@/layouts/AppLayout'
import { RequireAuth, RequirePermission, RequireRole } from '@/layouts/guards'
import { AccountPage } from '@/pages/AccountPage'
import { AdminBookingsPage } from '@/pages/admin/AdminBookingsPage'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminHomePage } from '@/pages/admin/AdminHomePage'
import { AdminNoticesPage } from '@/pages/admin/AdminNoticesPage'
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage'
import { AdminRatesPage } from '@/pages/admin/AdminRatesPage'
import { AdminSlotsPage } from '@/pages/admin/AdminSlotsPage'
import { ForbiddenPage } from '@/pages/ForbiddenPage'
import { DarshanPage } from '@/pages/darshan/DarshanPage'
import { MyBookingsPage } from '@/pages/darshan/MyBookingsPage'
import { HomePage } from '@/pages/HomePage'
import { LoginPage, StaffLoginPage } from '@/pages/LoginPage'
import { NoticeDetailPage } from '@/pages/NoticeDetailPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { NotificationsPage } from '@/pages/NotificationsPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { RouteErrorPage } from '@/pages/RouteErrorPage'
import { TempleDetailPage } from '@/pages/TempleDetailPage'
import { TemplesPage } from '@/pages/TemplesPage'
import { CheckoutPage } from '@/pages/vazhipadu/CheckoutPage'
import { MyOrdersPage } from '@/pages/vazhipadu/MyOrdersPage'
import { ReceiptPage } from '@/pages/vazhipadu/ReceiptPage'
import { VazhipaduPage } from '@/pages/vazhipadu/VazhipaduPage'

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

          // Devotee services: browsing is public, booking needs a login
          { path: 'darshan', element: <DarshanPage /> },
          { path: 'vazhipadu', element: <VazhipaduPage /> },
          {
            element: <RequireAuth />,
            children: [
              { path: 'darshan/my-bookings', element: <MyBookingsPage /> },
              { path: 'vazhipadu/checkout', element: <CheckoutPage /> },
              { path: 'vazhipadu/orders/:orderNumber', element: <ReceiptPage /> },
              { path: 'vazhipadu/my-orders', element: <MyOrdersPage /> },
            ],
          },

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
                children: [
                  { index: true, element: <AdminHomePage /> },
                  {
                    element: <RequirePermission permission="dashboard:view" />,
                    children: [{ path: 'dashboard', element: <AdminDashboardPage /> }],
                  },
                  {
                    element: <RequirePermission permission="booking:viewAny" />,
                    children: [{ path: 'bookings', element: <AdminBookingsPage /> }],
                  },
                  {
                    element: <RequirePermission permission="order:viewAny" />,
                    children: [{ path: 'orders', element: <AdminOrdersPage /> }],
                  },
                  {
                    element: <RequirePermission permission="catalog:manage" />,
                    children: [
                      { path: 'slots', element: <AdminSlotsPage /> },
                      { path: 'rates', element: <AdminRatesPage /> },
                    ],
                  },
                  {
                    element: <RequirePermission permission="notice:manage" />,
                    children: [{ path: 'notices', element: <AdminNoticesPage /> }],
                  },
                ],
              },
            ],
          },

          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]
