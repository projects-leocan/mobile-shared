import DeviceInfo from 'react-native-device-info';
import { delay, take } from 'redux-saga';
import { takeLatest, put, call, select, fork } from 'redux-saga/effects';
import { startAsyncValidation, stopAsyncValidation } from 'redux-form'
import { api as defaultApi } from '../api';

import AuthTypes from '../constants/auth';
import AuthActions from '../actions/auth';
import RoomsActions from '../actions/rooms';
import AssetsActions from '../actions/assets';
import GlitchesActions from '../actions/glitches';
import UpdateActions from '../actions/updates';
import DifferencesActions from '../actions/differences';
import BackendActions from '../actions/backend';
import { Actions as OfflineActions } from '../offline';
import OutboundActions from '../actions/outbound';

import request, { logError, authRequest } from '../utils/request';
import { forkWatchers } from '../utils/sagas';

const OFFLINE_ERROR_MESSAGE = "Unable to connect. Please check internet!"
const HOTEL_ERROR_MESSAGE = "Unable to locate hotel users."
const USER_ERROR_MESSAGE = "Wrong username or password."

export default function({ apiUrl, userType }) {

  const MOBILE_USERS_API = `/mobile_users`;
  const AUTH_API = `/session`;
  const USER_API = `/users`;
  const HOTEL_API = `/hotel`;

  // Logout
  function * logoutFlow({ hotel }) {
    try {
      yield put(AuthActions.userReset());
      yield put(RoomsActions.resetRooms());
      yield put(AssetsActions.resetAssets());
      yield put(GlitchesActions.glitchesReset());
      yield put(UpdateActions.resetUpdates());
      yield put(DifferencesActions.resetDifferences());
      yield put(OfflineActions.clear());
      yield put(BackendActions.reset());
      yield put(OutboundActions.resetOffline());

    } catch (e) {
      // console.log(e);
      yield call(logError, e, null, userType);
    } finally {

    }
  }

  function * watchLogout() {
    yield takeLatest(AuthTypes.LOGOUT, logoutFlow);
  }

  // HOTEL SUBMISSION
  function * submitHotelLogin(hotel) {
    const url = `${MOBILE_USERS_API}?hotelUsername=${hotel && hotel.toLowerCase()}&userType=${userType}`;
    return yield call(authRequest, url, { method: 'GET' });
  }

  function * submitHotelFlow({ hotel }) {
    yield put(AuthActions.setApi(defaultApi));

    try {
      yield put(startAsyncValidation('hotelLogin'));
      const data = yield call(submitHotelLogin, hotel);
      
      yield put(AuthActions.hotelSuccess(data));
      yield put(stopAsyncValidation('hotelLogin', {}));
    } catch (e) {
      console.log(e);
      if (e && e.status === "Network request failed") {
        yield put(stopAsyncValidation('hotelLogin', {_error: OFFLINE_ERROR_MESSAGE}));
      } else {
        yield put(stopAsyncValidation('hotelLogin', {_error: HOTEL_ERROR_MESSAGE}));
      }
      yield put(AuthActions.hotelFailure(e));
    } finally {
    }
  }

  function * watchHotelFlow() {
    yield takeLatest(AuthTypes.HOTEL_REQUEST, submitHotelFlow);
  }

  // USER SUBMISSION
  function * submitUserLogin({ hotelUsername, username, password }) {
    // console.log(hotelUsername, username, password);

    return yield call(authRequest, AUTH_API, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hotel: hotelUsername.toLowerCase(),
        username: username.toLowerCase(),
        password
      })
    });
  }

  // USER VERSION
  // function * submitUserVersion(userId) {
  //   const version = DeviceInfo.getVersion();
  //   return yield call(authRequest, `${USER_API}/${userId}/version`, {
  //     method: 'PUT',
  //     body: JSON.stringify({ version })
  //   });
  // }

  function * submitUserFlow({ hotelUsername, username, password }) {
    try {
      yield put(startAsyncValidation('userLogin'));
      const data = yield call(submitUserLogin, { hotelUsername, username, password });
      // console.log(data);
      yield put(AuthActions.userSuccess(data));
      // yield call(submitUserVersion, data._id);
      yield put(stopAsyncValidation('userLogin', {}));
    } catch (e) {
      yield put(stopAsyncValidation('userLogin', {_error: USER_ERROR_MESSAGE}));
      yield put(AuthActions.userFailure(e));
    } finally {
    }
  }

  function * watchUserFlow() {
    yield takeLatest(AuthTypes.USER_REQUEST, submitUserFlow)
  }

  // HOTEL FETCH
  function * fetchHotel() {
    const { auth: { hotelId, token } } = yield select();

    return yield call(authRequest, `${HOTEL_API}/${hotelId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  function * fetchHotelFlow() {
    try {
      const data = yield call(fetchHotel, null);
      yield put(AuthActions.hotelFetchSuccess(data));
    } catch (e) {
      // console.log(e);
      yield put(AuthActions.hotelFetchFailure(e));
    } finally {

    }
  }

  function * watchFetchHotelFlow() {
    yield takeLatest(AuthTypes.HOTEL_FETCH, fetchHotelFlow)
  }

  // USER FETCH
  function * fetchUser() {
    const { auth: { hotelId, token, userId } } = yield select();

    return yield call(authRequest, `${USER_API}/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  function * fetchUserFlow() {
    try {
      const data = yield call(fetchUser, null);
      yield put(AuthActions.userFetchSuccess(data));
    } catch (e) {
      // console.log(e);
      yield put(AuthActions.userFetchFailure(e));
    } finally {

    }
  }

  function * watchFetchUserFlow() {
    yield takeLatest(AuthTypes.USER_FETCH, fetchUserFlow)
  }

  function * toggleDutyFlow({ isOnDuty }) {
    try {
      const { auth: { hotelId, token, userId } } = yield select();
      console.log('ON DUTY FLOW', userId, isOnDuty);

      return yield call(authRequest, `${USER_API}/${userId}/on_duty`, {
        method: 'PUT',
        body: JSON.stringify({ userId, status: isOnDuty })
      });
    } catch (e) {
      // console.log(e);
    } finally {

    }
  }

  function * watchToggleDutyFlow() {
    yield takeLatest(AuthTypes.TOGGLE_DUTY, toggleDutyFlow)
  }

  const watchers = {
    watchLogout,
    watchHotelFlow,
    watchUserFlow,
    watchFetchHotelFlow,
    watchFetchUserFlow,
    watchToggleDutyFlow,
  };

  const root = forkWatchers(watchers);

  return {
    root,
    watchers,
    sagas: {
      logoutFlow,
      submitHotelLogin,
      submitHotelFlow,
      submitUserLogin,
      submitUserFlow,
      fetchHotel,
      fetchHotelFlow,
      fetchUser,
      fetchUserFlow,
      toggleDutyFlow,
    }
  }
}
