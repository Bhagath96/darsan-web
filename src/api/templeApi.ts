import { ApiError } from './errors'
import { getDb } from './db'
import { simulate } from './mockClient'
import type { Offering, Temple } from '@/types'

export function getTemples(): Promise<Temple[]> {
  return simulate('vazhipadu', () => getDb().temples)
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
