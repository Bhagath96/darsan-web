import { ApiError } from './errors'
import { getDb } from './db'
import { simulate } from './mockClient'
import type { Notice, NoticeQuery } from '@/types'

/**
 * Public: notices, newest first. Filtering by a temple also includes the notices
 * that apply to every temple (templeId null).
 */
export function getNotices(query: NoticeQuery = {}): Promise<Notice[]> {
  return simulate('content', () => {
    const { templeId, category, limit } = query
    if (templeId && !getDb().temples.some((t) => t.id === templeId)) {
      throw new ApiError('NOT_FOUND', 'Temple not found.')
    }
    const matches = getDb().notices.filter(
      (n) =>
        (!templeId || n.templeId === templeId || n.templeId === null) &&
        (!category || n.category === category),
    )
    return limit === undefined ? matches : matches.slice(0, Math.max(0, limit))
  })
}

/** Public: one notice. */
export function getNotice(noticeId: string): Promise<Notice> {
  return simulate('content', () => {
    const notice = getDb().notices.find((n) => n.id === noticeId)
    if (!notice) throw new ApiError('NOT_FOUND', 'This notice does not exist or has been removed.')
    return notice
  })
}
