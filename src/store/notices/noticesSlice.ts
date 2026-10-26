import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'
import { loadJson, STORAGE_KEYS } from '../persistence'
import { asyncState, type AppError, type AsyncState } from '../types'
import type { RootState } from '../rootReducer'
import type { IsoDateTime, Notice, NoticeQuery } from '@/types'

/** How far back a first-time visitor's "new notices" count reaches. */
const NEW_FOR_FIRST_VISIT_MS = 7 * 24 * 60 * 60 * 1000

export interface NoticesState {
  /** Latest notices for every temple: the home page and the header bell use these. */
  latest: AsyncState<Notice[]>
  /** The filtered list on the notifications page. */
  list: AsyncState<Notice[]> & { requestId: string | null; query: NoticeQuery }
  /** The notice opened on its own page. */
  detail: AsyncState<Notice | null>
  /** When the visitor last opened the notifications page (persisted). */
  lastSeenAt: IsoDateTime | null
}

const isIsoString = (value: unknown): value is string =>
  typeof value === 'string' && !Number.isNaN(Date.parse(value))

export function loadNoticesSeen(): IsoDateTime | null {
  return loadJson(STORAGE_KEYS.noticesSeen, isIsoString) ?? null
}

export const initialNoticesState: NoticesState = {
  latest: asyncState<Notice[]>([]),
  list: { ...asyncState<Notice[]>([]), requestId: null, query: {} },
  detail: asyncState<Notice | null>(null),
  lastSeenAt: null,
}

const noticesSlice = createSlice({
  name: 'notices',
  initialState: initialNoticesState,
  reducers: {
    latestNoticesRequested(state) {
      state.latest.status = 'loading'
      state.latest.error = null
    },
    latestNoticesLoaded(state, action: PayloadAction<Notice[]>) {
      state.latest.data = action.payload
      state.latest.status = 'success'
    },
    latestNoticesFailed(state, action: PayloadAction<AppError>) {
      state.latest.status = 'error'
      state.latest.error = action.payload
    },

    noticesRequested: {
      reducer(state, action: PayloadAction<{ query: NoticeQuery; requestId: string }>) {
        state.list.status = 'loading'
        state.list.error = null
        state.list.query = action.payload.query
        state.list.requestId = action.payload.requestId
      },
      prepare(query: NoticeQuery) {
        return { payload: { query, requestId: nanoid() } }
      },
    },
    noticesLoaded(state, action: PayloadAction<{ notices: Notice[]; requestId: string }>) {
      // A slow answer to an older filter must not replace the current one.
      if (action.payload.requestId !== state.list.requestId) return
      state.list.data = action.payload.notices
      state.list.status = 'success'
    },
    noticesFailed(state, action: PayloadAction<{ error: AppError; requestId: string }>) {
      if (action.payload.requestId !== state.list.requestId) return
      state.list.status = 'error'
      state.list.error = action.payload.error
    },

    noticeRequested(state, _action: PayloadAction<string>) {
      state.detail.status = 'loading'
      state.detail.error = null
      state.detail.data = null
    },
    noticeLoaded(state, action: PayloadAction<Notice>) {
      state.detail.data = action.payload
      state.detail.status = 'success'
    },
    noticeFailed(state, action: PayloadAction<AppError>) {
      state.detail.status = 'error'
      state.detail.error = action.payload
    },

    /** The visitor has looked at the notifications page: everything up to now is "seen". */
    noticesSeen: {
      reducer(state, action: PayloadAction<IsoDateTime>) {
        state.lastSeenAt = action.payload
      },
      prepare(at?: IsoDateTime) {
        return { payload: at ?? new Date().toISOString() }
      },
    },
  },
})

export const {
  latestNoticesRequested,
  latestNoticesLoaded,
  latestNoticesFailed,
  noticesRequested,
  noticesLoaded,
  noticesFailed,
  noticeRequested,
  noticeLoaded,
  noticeFailed,
  noticesSeen,
} = noticesSlice.actions
export default noticesSlice.reducer

export const selectLatestNotices = (state: RootState) => state.notices.latest
export const selectNoticeList = (state: RootState) => state.notices.list
export const selectNoticeDetail = (state: RootState) => state.notices.detail

/** Number of notices published since the visitor last opened the notifications page. */
export function selectUnreadNoticeCount(state: RootState, now: number = Date.now()): number {
  const { latest, lastSeenAt } = state.notices
  const since = lastSeenAt ? Date.parse(lastSeenAt) : now - NEW_FOR_FIRST_VISIT_MS
  return latest.data.filter((n) => Date.parse(n.publishedAt) > since).length
}
