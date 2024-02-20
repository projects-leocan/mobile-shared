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
import datadogActions from "rc-mobile-base/lib/actions/datadog";
import request, { logError, authRequest, parseJSON } from '../utils/request';
import { forkWatchers } from '../utils/sagas';
import AuthLoaderAction from '../actions/authLoader'

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
const SOMTHING_WENT_WRONG = "Something went wrong. Please try again later!"
let Hotel_Name

export default function ({ apiUrl, userType }) {

  const MOBILE_USERS_API = `/mobile_users`;
  const AUTH_API = `/session`;
  // const USER_API = `/users`;
  const USER_DETAILS_API = `/User/GetDetails`;
  const USER_DUTY_STATUS_API = `/User/UpdateOnDutyStatus`;
  const UPDATE_FIREBASE_DEVICE_KEY = `/User/UpdateFirebaseDeviceKey`;
  const HOTEL_API = `/hotel`;
  const MOBILE_CONFIGURE_API = `/AppConfiguration/GetAttendantMobileAppConfigurationForHotel`;
  // const MOBILE_CONFIGURE_API = `/AppConfiguration/GetAttendantMobileAppConfiguration`;
  // Logout
  function* logoutFlow({ hotel }) {
    const isOnDuty = false;
    try {
      yield put(AuthActions.toggleDuty(isOnDuty))
      yield call(removeFirebaseDeviceKey)
    } catch (e) {
      yield call(logError, e, null, userType);
    } finally {
      yield put(datadogActions.dataDogReset());
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
      yield put(filtersActions.resetRoomsFilters());
      // yield put(OutboundActions.resetOffline());
      // yield put(OutboundActions.resetOffline());
    } catch (e) {
      yield call(logError, e, null, userType);
    } finally {

    }
  }

  function* watchSwitchHotel() {
    yield takeLatest(AvailHotelTaskTypes.ACTIVE_AVAIL_HOTEL, switchHotelFlow);
  }

  // HOTEL SUBMISSION
  function* submitHotelLogin({ hotel, hotelGroupname }) {
    const url = `${mobileApiUrl}/User/GetAvailableUsers`;
    try {
      return yield call(request, url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // hotelName: hotel,
          hotelUsername: hotelGroupname,
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
    yield put(AuthLoaderAction.loaderHotelRequest())
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
        yield put(AuthLoaderAction.loaderHotelSuccess())
      } else if(data === undefined){
        yield put(stopAsyncValidation('hotelLogin', { _error: SOMTHING_WENT_WRONG }));
        yield put(AuthActions.hotelFailure());
        yield put(AuthLoaderAction.loaderHotelFailure())
      }else {
        yield put(stopAsyncValidation('hotelLogin', { _error: NO_HOTEL_ERROR_MESSAGE }));
        yield put(AuthActions.hotelFailure());
        yield put(AuthLoaderAction.loaderHotelFailure())
      }
    } catch (e) {
      if (e && e.status === "Network request failed") {
        yield put(stopAsyncValidation('hotelLogin', { _error: OFFLINE_ERROR_MESSAGE }));
      } else {
        yield put(stopAsyncValidation('hotelLogin', { _error: HOTEL_ERROR_MESSAGE }));
      }
      yield put(AuthActions.hotelFailure(e));
      yield put(AuthLoaderAction.loaderHotelFailure())

    } finally {
    }
  }

  function* watchHotelFlow() {
    yield takeLatest(AuthTypes.HOTEL_REQUEST, submitHotelFlow);
  }

  function* submitUserLogin2({ hotelUsername, username, password }) {
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
    const { hotelGroupname, FirstHotelData, access_token, sub } = data;
    Hotel_Name = FirstHotelData
    const url = `${defaultApi}/AppConfiguration/GetAttendantMobileAppConfigurationForHotel`;
    // const url = `${defaultApi}/AppConfiguration/GetAttendantMobileAppConfiguration`;
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
          // userId: sub
          hotelName: FirstHotelData
        })
      });
    }
    catch (exception) {
      console.log("POST FAILED: ", exception);
    }

  }

  // USER SUBMISSION
  function* submitUserLogin({ hotelGroupname, hotelUsername, username, password }) {
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
    

    const getAvailableHotels =  yield call (getHotelListData , access_token)
    const FirstHotelData  = getAvailableHotels[0].name

    const data =  yield call(onUserLogin, { hotelGroupname, FirstHotelData, access_token, sub });
    return data
  }

  function* getHotelListData(access_token) {

    const url = `${defaultApi}/Hotel/GetListOfHotels`;
    try {
      return yield call(request, url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
        body: JSON.stringify({})
      });
    }
    catch (exception) {
      console.log("POST FAILED: ", exception);
    }

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
      const data = yield call(submitUserLogin, { hotelGroupname, hotelUsername, username, password });
      const isOnDuty = true;
      yield put(AuthActions.userSuccess(data));
      const authHotelId = get(data, 'hotel.id', null)
      yield put(HotelsTaskActions.activeAvailHotel(authHotelId))
      // yield call(submitUserVersion, data._id);
      const isSucess = yield call(updateFirebaseDeviceKey);
      yield put(stopAsyncValidation('userLogin', {}));
      yield put(AuthActions.toggleDuty(isOnDuty))
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
        hotelName: Hotel_Name
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
