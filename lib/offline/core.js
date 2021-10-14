import { last, initial } from 'lodash/array';
import { call, put } from 'redux-saga/effects';
import { Config } from '../network';

import { enqueue } from './actions';
import { logError } from '../utils/request';

export const checker = (err) => {
  const status = err.status;
  const whenTimeout = status === Config.ERROR_MESSAGE && err.url !== Config.PING_URL;
  if (status >= 500 || status === 404 || status === 'Network request failed' || whenTimeout) {
    return true;
  }
  return false;
}

export const offlineSagaEnchancer = (offlineChecker) => (name, saga) => {
  return function * (...args) {
    const offlineMeta = last(args);
    const clearArgs = initial(args);
    let response;

    try {
      if (offlineMeta && offlineMeta.queued) {
        response = yield call(saga, ...clearArgs);
      } else {
        response = yield call(saga, ...args);
      }

      return response;
    } catch (err) {
      if (offlineChecker(err)) {
        if (!offlineMeta || !offlineMeta.queued) {
          yield put(enqueue(name, args))
        }
      } else {
        yield call(logError, err.toString(), name, "")
        // throw err;
      }
    }
  }
}

export const offlineable = offlineSagaEnchancer(checker)

export default offlineable
