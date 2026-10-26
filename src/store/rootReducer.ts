import { combineReducers } from '@reduxjs/toolkit'
import bookings from './admin/bookingsSlice'
import catalog from './admin/catalogSlice'
import dashboard from './admin/dashboardSlice'
import orders from './admin/ordersSlice'
import auth from './auth/authSlice'
import i18n from './i18n/i18nSlice'
import notices from './notices/noticesSlice'
import temples from './temples/templesSlice'
import ui from './ui/uiSlice'

export const rootReducer = combineReducers({
  adminBookings: bookings,
  adminCatalog: catalog,
  adminDashboard: dashboard,
  adminOrders: orders,
  auth,
  i18n,
  notices,
  temples,
  ui,
})

export type RootState = ReturnType<typeof rootReducer>
