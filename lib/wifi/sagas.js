import { put, call, delay, takeLatest, select } from 'redux-saga/effects';

import Types from './types';
import Actions from './actions';

export default function(options = {}) {
  // const powerFlow = function * ({ payload }) {
  //   try {
  //     const value = payload.on
  //     yield wifi.setEnabled(value);
  //     yield put(Actions.powerSuccess(value))
  //   } catch (e) {
  //     console.log('WIFI power error', e)
  //     yield put(Actions.powerFailure(e))
  //   }
  // }

  // const watchPower = function * () {
  //   yield takeLatest(Types.POWER, powerFlow);
  // }

  const powerToggleFlow = function * () {
    const { wifi: { isRunning }} = yield select();

    if (isRunning) {
      return;
    }

    try {
      // yield put(Actions.powerToggleRunning());
      // console.log('isEnabled', isEnabled);

      
      // yield put(Actions.powerToggleFinished());
    
    } catch (error) {
      console.log('WIFI power error', error)
      // yield put(Actions.powerFailure(error))
    }
  }

  const watchTogglePower = function * () {
    yield takeLatest(Types.TOGGLE_POWER, powerToggleFlow);
  }

  const root = function * () {
    // yield fork(watchPower);
    yield fork(watchTogglePower)
 }

  return {
    root,
    watchers: {
      // watchPower,
      watchTogglePower
    },
    sagas: {
      // powerFlow,
      powerToggleFlow
    }
  };
}
