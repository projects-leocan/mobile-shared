import DeviceInfo from 'react-native-device-info';
import { takeLatest, put, call, select, fork, take } from 'redux-saga/effects';
import { startAsyncValidation, stopAsyncValidation } from 'redux-form'
import { api as defaultApi, mobileApiRootUrl, mobileApiUrl } from '../api';

import AuthTypes from '../constants/auth';
import AvailHotelTaskTypes from '../constants/hotelsTask';
import AuthActions from '../actions/auth';
import RoomsActions from '../actions/rooms';
import AssetsActions from '../actions/assets';
import GlitchesActions from '../actions/glitches';
import UpdateActions from '../actions/updates';
import DifferencesActions from '../actions/differences';
import BackendActions from '../actions/backend';
import { Actions as OfflineActions } from '../offline';
import OutboundActions from '../actions/outbound';
import filtersActions from '../actions/filters';
import inspectorFiltersActions from '../actions/inspectorFilters';
import HotelsTaskActions from '../actions/hotelsTask';

import request, { logError, authRequest, parseJSON } from '../utils/request';
import { forkWatchers } from '../utils/sagas';

import {
  apiSelector,
  deviceFCMTokenSelector,
  userIdSelector
} from "../selectors/auth";
import { get } from 'lodash/object';
import { isEmpty } from 'lodash';
import moment from 'moment';

const OFFLINE_ERROR_MESSAGE = "Unable to connect. Please check internet!"
const HOTEL_ERROR_MESSAGE = "Unable to locate hotel users."
const USER_ERROR_MESSAGE = "Wrong username or password."
const NO_HOTEL_ERROR_MESSAGE = "Unable to find hotel."

export default function ({ apiUrl, userType }) {

  const MOBILE_USERS_API = `/mobile_users`;
  const AUTH_API = `/session`;
  // const USER_API = `/users`;
  const USER_DETAILS_API = `/User/GetDetails`;
  const USER_DUTY_STATUS_API = `/User/UpdateOnDutyStatus`;
  const UPDATE_FIREBASE_DEVICE_KEY = `/User/UpdateFirebaseDeviceKey`;
  const HOTEL_API = `/hotel`;
  const MOBILE_CONFIGURE_API = `/AppConfiguration/GetAttendantMobileAppConfiguration`;

  // Logout
  function* logoutFlow({ hotel }) {
    try {
      yield call(removeFirebaseDeviceKey)

      yield put(AuthActions.userReset());
      yield put(RoomsActions.resetRooms());
      yield put(AssetsActions.resetAssets());
      yield put(GlitchesActions.glitchesReset());
      yield put(UpdateActions.resetUpdates());
      yield put(DifferencesActions.resetDifferences());
      yield put(OfflineActions.clear());
      yield put(BackendActions.reset());
      yield put(filtersActions.resetRoomsFilters());
      yield put(inspectorFiltersActions.resetRoomsFilters());
      yield put(OutboundActions.resetOffline());
      yield put(HotelsTaskActions.resetAvailHotel());

    } catch (e) {
      // console.log(e);
      yield call(logError, e, null, userType);
    } finally {

    }
  }

  function* watchLogout() {
    yield takeLatest(AuthTypes.LOGOUT, logoutFlow);
  }

  function* switchHotelFlow({ hotel }) {
    try {
      yield put(RoomsActions.resetRooms());
      // yield put(AssetsActions.resetAssets());
      yield put(GlitchesActions.glitchesReset());
      // yield put(UpdateActions.resetUpdates());
      yield put(DifferencesActions.resetDifferences());
      // yield put(OfflineActions.clear());
      yield put(BackendActions.reset());
      // yield put(OutboundActions.resetOffline());
      // yield put(OutboundActions.resetOffline());
    } catch (e) {
      // console.log(e);
      yield call(logError, e, null, userType);
    } finally {

    }
  }

  function* watchSwitchHotel() {
    yield takeLatest(AvailHotelTaskTypes.ACTIVE_AVAIL_HOTEL, switchHotelFlow);
  }

  // HOTEL SUBMISSION
  function* submitHotelLogin({ hotel, hotelGroupname }) {
    const url = `${mobileApiUrl}/User/GetAvailableUsersForHotel`;
    // console.log("POSTING: ", hotel, userType);

    try {
      return yield call(request, url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hotelName: hotel,
          hotelGroupKey: hotelGroupname,
          userType: userType
        })
      });
    }
    catch (exception) {
      console.log("POST FAILED: ", exception);
    }
  }

  function* submitHotelFlow({ hotel, hotelGroupname }) {
    yield put(AuthActions.setApi(defaultApi));

    try {
      yield put(startAsyncValidation('hotelLogin'));
      const data = yield call(submitHotelLogin, { hotel, hotelGroupname });
      const listUser = get(data, 'users', []);
      const response = {
        ...data,
        loginHotelGroup: hotelGroupname
      }
      if (!isEmpty(listUser)) {
        yield put(AuthActions.hotelSuccess(response));
        yield put(stopAsyncValidation('hotelLogin', {}));
      } else {
        yield put(stopAsyncValidation('hotelLogin', { _error: NO_HOTEL_ERROR_MESSAGE }));
        yield put(AuthActions.hotelFailure());
      }
    } catch (e) {
      console.log(e);
      if (e && e.status === "Network request failed") {
        yield put(stopAsyncValidation('hotelLogin', { _error: OFFLINE_ERROR_MESSAGE }));
      } else {
        yield put(stopAsyncValidation('hotelLogin', { _error: HOTEL_ERROR_MESSAGE }));
      }
      yield put(AuthActions.hotelFailure(e));
    } finally {
    }
  }

  function* watchHotelFlow() {
    yield takeLatest(AuthTypes.HOTEL_REQUEST, submitHotelFlow);
  }

  function* submitUserLogin2({ hotelUsername, username, password }) {
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

  function* onUserLogin(data) {

    const { hotelGroupname, hotelUsername, access_token, sub } = data;

    const url = `${defaultApi}/AppConfiguration/GetAttendantMobileAppConfigurationForHotel`;
    try {
      return yield call(request, url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'hotel_group_key': hotelGroupname,
          'Authorization': `Bearer ${access_token}`
        },
        body: JSON.stringify({
          hotelName: hotelUsername
        })
      });
    }
    catch (exception) {
      console.log("POST FAILED: ", exception);
    }

  }

  // USER SUBMISSION
  function* submitUserLogin({ hotelGroupname, hotelUsername, username, password }) {
    // console.log(hotelUsername, username, password);

    // Request Headers
    // Content-Type: application/x-www-form-urlencoded
    // User-Agent: PostmanRuntime/7.28.0
    // Accept: */*
    // Cache-Control: no-cache
    // Postman-Token: c948ca51-b36f-426b-a5e6-bf3fd69fe137
    // Host: localhost:5001
    // Accept-Encoding: gzip, deflate, br
    // Connection: keep-alive
    // Request Body
    // grant_type: "password"
    // username: "rcadmin"
    // password: "rcadmintest123123"
    // scope: "api openid offline_access hotelid hotelgroupid"
    // client_id: "roomchecking-mobile-client"
    // client_secret: ""

    const url = `${mobileApiRootUrl}/connect/token`;

    let headers = {};
    headers["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
    headers["Accept"] = "application/json";
    headers["Cache-Control"] = "no-cache";
    headers["hotel_group_key"] = hotelGroupname;

    var requestObject = {};
    requestObject["grant_type"] = "password";
    requestObject["username"] = username;
    requestObject["password"] = password;
    requestObject["scope"] = "api openid offline_access hotelid hotelgroupid";
    requestObject["client_id"] = "roomchecking-mobile-client";

    var formBody = [];
    for (var property in requestObject) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(requestObject[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }

    let formBodyString = formBody.join("&");

    let requestOptions = {
      method: 'POST',
      headers: headers,
      body: formBodyString,
    };

    const getTokenData = yield call(request, url, requestOptions);
    yield put(AuthActions.getAuthToken(getTokenData));

    const { access_token } = getTokenData;
    const userInfoURL = `${mobileApiRootUrl}/connect/userinfo?access_token=${access_token}`;
    // const userInfo = request(userInfoURL)
    // const userInfo = yield fetch(userInfoURL);

    const userInfo = yield call(request, userInfoURL, {});
    const { sub } = userInfo;

    return yield call(onUserLogin, { hotelGroupname, hotelUsername, access_token, sub });
  }

  // USER VERSION
  // function * submitUserVersion(userId) {
  //   const version = DeviceInfo.getVersion();
  //   return yield call(authRequest, `${USER_API}/${userId}/version`, {
  //     method: 'PUT',
  //     body: JSON.stringify({ version })
  //   });
  // }

  function* updateFirebaseDeviceKey() {
    var utcMoment = moment.utc();
    const deviceFCMToken = yield select(deviceFCMTokenSelector);
    return yield call(authRequest, UPDATE_FIREBASE_DEVICE_KEY, {
      method: 'POST',
      body: JSON.stringify({
        deviceKey: deviceFCMToken,
        issuedAtUtc: utcMoment.format()
      })
    });
  }

  function* removeFirebaseDeviceKey() {
    const deviceFCMToken = yield select(deviceFCMTokenSelector);
    return yield call(authRequest, UPDATE_FIREBASE_DEVICE_KEY, {
      method: 'POST',
      body: JSON.stringify({
        key: null,
        issuedAt: null
      })
    });
  }

  function* submitUserFlow({ hotelGroupname, hotelUsername, username, password }) {
    try {
      yield put(startAsyncValidation('userLogin'));
      // console.log("SUBMITTING USER LOGIN");
      const data = yield call(submitUserLogin, { hotelGroupname, hotelUsername, username, password });
      // console.log("DATA AFTER USER LOGIN: ", data);
      yield put(AuthActions.userSuccess(data));
      const authHotelId = get(data, 'hotel.id', null)
      yield put(HotelsTaskActions.activeAvailHotel(authHotelId))
      // yield call(submitUserVersion, data._id);
      const isSucess = yield call(updateFirebaseDeviceKey);
      yield put(stopAsyncValidation('userLogin', {}));
    } catch (e) {
      yield put(stopAsyncValidation('userLogin', { _error: USER_ERROR_MESSAGE }));
      yield put(AuthActions.userFailure(e));
    } finally {
    }
  }

  function* watchUserFlow() {
    yield takeLatest(AuthTypes.USER_REQUEST, submitUserFlow)
  }

  // HOTEL FETCH
  function* fetchHotel() {
    const { auth: { hotelId, token } } = yield select();

    return yield call(authRequest, `${HOTEL_API}/${hotelId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  function* fetchHotelFlow() {
    try {
      const data = yield call(fetchHotel, null);
      yield put(AuthActions.hotelFetchSuccess(data));
    } catch (e) {
      // console.log(e);
      yield put(AuthActions.hotelFetchFailure(e));
    } finally {

    }
  }

  function* watchFetchHotelFlow() {
    yield takeLatest(AuthTypes.HOTEL_FETCH, fetchHotelFlow)
  }

  // USER FETCH
  function* fetchUser() {
    const { auth: { hotelId, token, userId } } = yield select();

    // return yield call(authRequest, `${USER_DETAILS_API}`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${token}`
    //   }
    // });
    return yield call(authRequest, USER_DETAILS_API, {
      method: 'POST',
      body: JSON.stringify({
        id: userId
      })
    });
  }

  function* fetchUserFlow() {
    try {
      const data = yield call(fetchUser, null);
      yield put(AuthActions.userFetchSuccess(data));
    } catch (e) {
      // console.log(e);
      yield put(AuthActions.userFetchFailure(e));
    } finally {

    }
  }

  function* watchFetchUserFlow() {
    yield takeLatest(AuthTypes.USER_FETCH, fetchUserFlow)
  }

  function* toggleDutyFlow({ isOnDuty }) {
    try {
      const { auth: { hotelId, token, userId } } = yield select();
      console.log('ON DUTY FLOW', userId, isOnDuty);

      // return yield call(authRequest, `${USER_API}/${userId}/on_duty`, {
      //   method: 'PUT',
      //   body: JSON.stringify({ userId, status: isOnDuty })
      // });
      return yield call(authRequest, USER_DUTY_STATUS_API, {
        method: 'POST',
        body: JSON.stringify({
          hotelId: hotelId,
          userId: userId,
          status: isOnDuty
        })
      });
    } catch (e) {
      // console.log(e);
    } finally {

    }
  }

  function* watchToggleDutyFlow() {
    yield takeLatest(AuthTypes.TOGGLE_DUTY, toggleDutyFlow)
  }

  function* fetchHotelConfig() {
    const userId = yield select(userIdSelector);
    return yield call(authRequest, MOBILE_CONFIGURE_API, {
      method: 'POST',
      body: JSON.stringify({
        userId: userId
      })
    });
  }

  function* hotelConfigFlow() {
    try {
      const data = yield call(fetchHotelConfig);
      yield put(AuthActions.userSuccess(data));
    } catch (e) {
      console.log(e);
    }
  }

  function* watchHotelConfigFlow() {
    yield takeLatest(AuthTypes.CONFIG_FETCH, hotelConfigFlow)
  }

  function* updateFCMTokenFlow() {
    try {
      yield call(updateFirebaseDeviceKey);
    } catch (e) {
      console.log(e);
    }
  }

  function* watchUpdateFCMToken() {
    yield takeLatest(AuthTypes.REQUEST_UPDATE_FCM_TOKEN, updateFCMTokenFlow)
  }

  const watchers = {
    watchLogout,
    watchSwitchHotel,
    watchHotelFlow,
    watchUserFlow,
    watchFetchHotelFlow,
    watchFetchUserFlow,
    watchToggleDutyFlow,
    watchHotelConfigFlow,
    watchUpdateFCMToken
  };

  const root = forkWatchers(watchers);

  return {
    root,
    watchers,
    sagas: {
      logoutFlow,
      switchHotelFlow,
      submitHotelLogin,
      submitHotelFlow,
      submitUserLogin,
      submitUserFlow,
      fetchHotel,
      fetchHotelFlow,
      fetchUser,
      fetchUserFlow,
      toggleDutyFlow,
      fetchHotelConfig,
      hotelConfigFlow,
      updateFCMTokenFlow,
      updateFirebaseDeviceKey,
      removeFirebaseDeviceKey
    }
  }
}
