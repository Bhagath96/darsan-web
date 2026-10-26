import type { PayloadAction } from '@reduxjs/toolkit'
import { call, put, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects'
import { toAppError } from '../errors'
import { saveJson, STORAGE_KEYS } from '../persistence'
import {
  latestNoticesFailed,
  latestNoticesLoaded,
  latestNoticesRequested,
  noticeFailed,
  noticeLoaded,
  noticeRequested,
  noticesFailed,
  noticesLoaded,
  noticesRequested,
  noticesSeen,
} from './noticesSlice'
import { noticeApi } from '@/api'
import type { Notice, NoticeQuery } from '@/types'

/** Enough for the home page and the unread count. */
const LATEST_LIMIT = 20

function* loadLatest() {
  try {
    const notices: Notice[] = yield call(noticeApi.getNotices, { limit: LATEST_LIMIT })
    yield put(latestNoticesLoaded(notices))
  } catch (error) {
    yield put(latestNoticesFailed(toAppError(error)))
  }
}

function* loadList(action: PayloadAction<{ query: NoticeQuery; requestId: string }>) {
  const { query, requestId } = action.payload
  try {
    const notices: Notice[] = yield call(noticeApi.getNotices, query)
    yield put(noticesLoaded({ notices, requestId }))
  } catch (error) {
    yield put(noticesFailed({ error: toAppError(error), requestId }))
  }
}

function* loadOne(action: PayloadAction<string>) {
  try {
    const notice: Notice = yield call(noticeApi.getNotice, action.payload)
    yield put(noticeLoaded(notice))
  } catch (error) {
    yield put(noticeFailed(toAppError(error)))
  }
}

function* persistSeen(action: PayloadAction<string>) {
  yield call(saveJson, STORAGE_KEYS.noticesSeen, action.payload)
}

export function* noticesSaga() {
  yield takeLeading(latestNoticesRequested.type, loadLatest)
  // Changing a filter cancels the request for the previous one.
  yield takeLatest(noticesRequested.type, loadList)
  yield takeLatest(noticeRequested.type, loadOne)
  yield takeEvery(noticesSeen.type, persistSeen)
}
