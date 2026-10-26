import { createSeed } from './seed'

/**
 * In-memory "server" database. Lives only in this browser tab:
 * a full page reload re-seeds it.
 */
function createDb(now: Date) {
  const seed = createSeed(now)
  return {
    ...seed,
    /** token → userId */
    sessions: new Map<string, string>(),
    /** idempotency key → first result */
    idempotency: new Map<string, unknown>(),
    counters: { order: 10_000 + seed.orders.length, booking: 1000 + seed.bookings.length },
  }
}

export type Db = ReturnType<typeof createDb>

let db: Db | null = null

export function getDb(): Db {
  db ??= createDb(new Date())
  return db
}

/** Re-seeds all data. Used by tests, and relative to `now` so slots stay "upcoming". */
export function resetDb(now: Date = new Date()): Db {
  db = createDb(now)
  return db
}
