import { Alert } from 'react-native';
import { REHYDRATE } from 'redux-persist';
import { call, put, select, fork, take, cancel } from 'redux-saga/effects';
import { delay, takeLatest, takeEvery } from 'redux-saga';
import { isEmpty } from 'lodash/lang';
import { logError } from '../utils/request';
import moment from 'moment';

import {
  offlineQueueSelector,
  nextOfflineQueueSelector,
  isRunningOfflineQueueSelector,
  sizeOfflineQueueSelector,
  currentRunningOfflineQueueSelector,
  delayOfflineQueueSelector,
  totalAttemptsOfflineQueueSelector,
  currentAttemptOfflineQueueSelector,
} from './selectors';
import { dequeue, start, stop, currentRunning, nextAttempt, clearForToday } from './actions';
import Types from './constants';

// TODO: add work to clear queue at new day start
export default function({ requireSaga, customTriggers }) {
  const watchTriggers = function * () {
    // let triggers = [REHYDRATE, Types.ENQUEUE];
    let triggers = [Types.ENQUEUE];
    if (!isEmpty(customTriggers)) {
      triggers = triggers.concat(customTriggers);
    }
    while(true) {
      const action = yield take(triggers);
      yield put(start());
    }
  }

  const watchQueue = function * () {
    while(true) {
      yield take(Types.START)
      const watcher = yield fork(runQueue);
      yield take(Types.STOP)
      yield cancel(watcher)
    }
  }

  const runQueue = function * () {
    // Check for old items and clear them
    yield put(clearForToday())

    const attempts = yield select(totalAttemptsOfflineQueueSelector);
    let queueSize = yield select(sizeOfflineQueueSelector);

    while (queueSize > 0) {
      const response = yield runQueueItem()

      if (!response) {
        let currentAttempt = yield select(currentAttemptOfflineQueueSelector)
        currentAttempt = currentAttempt || 1
        yield put(nextAttempt(currentAttempt + 1))

        if (currentAttempt >= attempts) {
          yield put(stop())
        }
      }

      queueSize = yield select(sizeOfflineQueueSelector);
    }

    yield put(stop())
  }

  const runQueueItem = function * () {
    const nextItem = yield select(nextOfflineQueueSelector);
    const delayTime = yield select(delayOfflineQueueSelector);
    let response

    if (!nextItem) {
      yield put(stop())
    }

    const { saga, args, ts } = nextItem;
    yield put(currentRunning(nextItem))

    try {
      sagaFunc = requireSaga(saga);
    } catch(err) {
      // console.log(`Function Not Found: ${saga}`, err)
      yield call(logError, saga, { args, ts, err });
      yield put(stop())
    }

    yield delay(delayTime);

    try {
      response = yield call(sagaFunc, ...[...args, { queued: true }])
    } catch (err) {
      // console.log(`Error with calling sagaFunc: ${saga}`, err)
      yield call(logError, saga, { args, ts, err });
    }

    if (!response) {
      // console.warn('Looks like you are missing response value, if it is okay and you know what you are doing, just ignore. Otherwise please check this saga for return value: ', saga)
    }

    if (response) {
      yield put(dequeue(nextItem));
    }

    return response;
  }

  const root = function * () {
    yield fork(watchQueue);
    yield fork(watchTriggers);
 }

  return {
    root,
    watchers: {
      watchQueue,
      watchTriggers,
    },
    sagas: {
      runQueue,
      runQueueItem,
    }
  };
}
