import { all, fork } from 'redux-saga/effects'
import { adminSaga } from './admin/adminSaga'
import { authSaga } from './auth/authSaga'
import { i18nSaga } from './i18n/i18nSaga'
import { noticesSaga } from './notices/noticesSaga'
import { templesSaga } from './temples/templesSaga'

export function* rootSaga() {
  yield all([fork(adminSaga), fork(authSaga), fork(i18nSaga), fork(noticesSaga), fork(templesSaga)])
}
