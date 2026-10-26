import { afterEach, describe, expect, it, vi } from 'vitest'
import { authApi } from '@/api'
import { issueToken } from '@/api/session'

describe('authApi', () => {
  afterEach(() => vi.useRealTimers())

  it('logs in with a demo user and never returns the password', async () => {
    const session = await authApi.login({ username: 'devotee', password: 'devotee123' })
    expect(session.user).toMatchObject({ username: 'devotee', role: 'DEVOTEE', name: 'Anil Kumar' })
    expect(session.user).not.toHaveProperty('password')
    expect(session.token).toMatch(/^mock\./)
  })

  it('ignores case and spaces in the username', async () => {
    await expect(authApi.login({ username: '  ADMIN ', password: 'admin123' })).resolves.toMatchObject({
      user: { role: 'ADMIN' },
    })
  })

  it('gives the same message for an unknown user and a wrong password', async () => {
    const wrongPassword = authApi.login({ username: 'devotee', password: 'nope' })
    const unknownUser = authApi.login({ username: 'nobody', password: 'devotee123' })
    await expect(wrongPassword).rejects.toMatchObject({ code: 'UNAUTHORIZED', message: 'Incorrect username or password.' })
    await expect(unknownUser).rejects.toMatchObject({ code: 'UNAUTHORIZED', message: 'Incorrect username or password.' })
  })

  it('me() restores the user behind a token', async () => {
    const { token } = await authApi.login({ username: 'staff', password: 'staff123' })
    await expect(authApi.me(token)).resolves.toMatchObject({ username: 'staff', templeId: 'tm-krishna' })
  })

  it('me() rejects a malformed or expired token', async () => {
    await expect(authApi.me('garbage')).rejects.toMatchObject({ code: 'UNAUTHORIZED' })
    const old = issueToken('u-devotee-1', Date.now() - 8 * 24 * 60 * 60 * 1000)
    await expect(authApi.me(old)).rejects.toMatchObject({ code: 'UNAUTHORIZED' })
  })
})
