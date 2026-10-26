import { combineReducers } from '@reduxjs/toolkit'
import i18n from './i18n/i18nSlice'
import ui from './ui/uiSlice'

export const rootReducer = combineReducers({
  i18n,
  ui,
})

export type RootState = ReturnType<typeof rootReducer>
