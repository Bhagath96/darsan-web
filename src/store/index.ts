import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { loadI18nState } from './i18n/i18nSlice'
import { rootReducer, type RootState } from './rootReducer'
import { rootSaga } from './rootSaga'

/** Builds a store. Tests pass their own `preloadedState`; the app loads saved preferences. */
export function makeStore(preloadedState?: Partial<RootState>) {
  const sagaMiddleware = createSagaMiddleware()
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefault) => getDefault({ thunk: false }).concat(sagaMiddleware),
  })
  sagaMiddleware.run(rootSaga)
  return store
}

export function loadPersistedState(): Partial<RootState> {
  return { i18n: loadI18nState() }
}

export type AppStore = ReturnType<typeof makeStore>
export type AppDispatch = AppStore['dispatch']
export type { RootState }
