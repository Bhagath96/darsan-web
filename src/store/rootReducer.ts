import { combineReducers } from '@reduxjs/toolkit'
import auth from './auth/authSlice'
import i18n from './i18n/i18nSlice'
import notices from './notices/noticesSlice'
import temples from './temples/templesSlice'
import ui from './ui/uiSlice'

export const rootReducer = combineReducers({
  auth,
  i18n,
  notices,
  temples,
  ui,
})

export type RootState = ReturnType<typeof rootReducer>
