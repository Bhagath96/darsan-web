import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { loadJson, STORAGE_KEYS } from '../persistence'
import type { AppError } from '../types'
import type { RootState } from '../rootReducer'
import type { AuthUser, LoginRequest, RequestStatus, Session, UserRole } from '@/types'

export interface AuthState {
  user: AuthUser | null
  token: string | null
  /** Status of the last login attempt. */
  status: RequestStatus
  error: AppError | null
  /** True while a saved session is being checked with the server after a reload. */
  restoring: boolean
}

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  status: 'idle',
  error: null,
  restoring: false,
}

const ROLES: readonly UserRole[] = ['DEVOTEE', 'STAFF', 'ADMIN']

function isSession(value: unknown): value is Session {
  if (typeof value !== 'object' || value === null) return false
  const { token, user } = value as Partial<Session>
  return (
    typeof token === 'string' &&
    typeof user === 'object' &&
    user !== null &&
    typeof user.id === 'string' &&
    typeof user.name === 'string' &&
    ROLES.includes(user.role)
  )
}

/**
 * The saved session is used straight away, so the header and guards don't flash
 * "logged out" on reload; the saga then checks it with the server.
 */
export function loadAuthState(): AuthState {
  const saved = loadJson(STORAGE_KEYS.session, isSession)
  if (!saved) return initialAuthState
  return { ...initialAuthState, user: saved.user, token: saved.token, status: 'success', restoring: true }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    loginRequested(state, _action: PayloadAction<LoginRequest>) {
      state.status = 'loading'
      state.error = null
    },
    loginSucceeded(state, action: PayloadAction<Session>) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.status = 'success'
      state.error = null
      state.restoring = false
    },
    loginFailed(state, action: PayloadAction<AppError>) {
      state.status = 'error'
      state.error = action.payload
    },
    /** Clears a login error, e.g. when the user starts typing again. */
    loginErrorCleared(state) {
      if (state.status === 'error') state.status = 'idle'
      state.error = null
    },
    sessionRestored(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload
      state.restoring = false
    },
    /** The server could not be reached; keep the saved user and stop showing "checking". */
    sessionRestoreGaveUp(state) {
      state.restoring = false
    },
    /** The server said the token is no longer valid. */
    sessionExpired() {
      return initialAuthState
    },
    logoutRequested() {
      return initialAuthState
    },
  },
})

export const {
  loginRequested,
  loginSucceeded,
  loginFailed,
  loginErrorCleared,
  sessionRestored,
  sessionRestoreGaveUp,
  sessionExpired,
  logoutRequested,
} = authSlice.actions
export default authSlice.reducer

export const selectAuth = (state: RootState) => state.auth
export const selectCurrentUser = (state: RootState) => state.auth.user
