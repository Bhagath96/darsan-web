import { all, fork } from 'redux-saga/effects'
import { i18nSaga } from './i18n/i18nSaga'

export function* rootSaga() {
  yield all([fork(i18nSaga)])
}
