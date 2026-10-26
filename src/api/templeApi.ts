import { ApiError } from './errors'
import { getDb } from './db'
import { simulate } from './mockClient'
import type { Offering, Temple } from '@/types'

/** Public: every temple, in a fixed order. */
export function getTemples(): Promise<Temple[]> {
  return simulate('content', () => getDb().temples)
}

/** Public: one temple with its full details. */
export function getTemple(templeId: string): Promise<Temple> {
  return simulate('content', () => {
    const temple = getDb().temples.find((t) => t.id === templeId)
    if (!temple) throw new ApiError('NOT_FOUND', 'Temple not found.')
    return temple
  })
}

/**
 * All offerings of a temple, including inactive ones (with `isActive: false`).
 * Devotee screens hide inactive offerings; staff screens can still show them.
 */
export function getOfferings(templeId: string): Promise<Offering[]> {
  return simulate('vazhipadu', () => {
    const db = getDb()
    if (!db.temples.some((t) => t.id === templeId)) {
      throw new ApiError('NOT_FOUND', 'Temple not found.')
    }
    return db.offerings.filter((o) => o.templeId === templeId)
  })
}
