import { ApiError } from './errors'
import { getDb } from './db'
import { simulate } from './mockClient'
import { issueToken, toAuthUser, userFromToken } from './session'
import type { AuthUser, LoginRequest, Session } from '@/types'

export function login({ username, password }: LoginRequest): Promise<Session> {
  return simulate('auth', () => {
    const user = getDb().users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password,
    )
    // Same message for unknown user and wrong password, so usernames can't be guessed.
    if (!user) throw new ApiError('UNAUTHORIZED', 'Incorrect username or password.')
    return { token: issueToken(user.id), user: toAuthUser(user) }
  })
}

/** Restores the user behind a saved token, e.g. after a page refresh. */
export function me(token: string): Promise<AuthUser> {
  return simulate('auth', () => {
    const user = userFromToken(token)
    if (!user) throw new ApiError('UNAUTHORIZED', 'Your session has expired. Please log in again.')
    return toAuthUser(user)
  })
}
