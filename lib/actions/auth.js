import AuthTypes from '../constants/auth';

export function hotelRequest(hotel, hotelGroupname) {
  return {
    type: AuthTypes.HOTEL_REQUEST,
    hotel
  }
}

export function hotelSuccess({ loginHotelName, name, images, users }) {
  return {
    type: AuthTypes.HOTEL_SUCCESS,
    loginHotelName,
    name,
    images,
    users
  }
}

export function hotelFailure(error) {
  return {
    type: AuthTypes.HOTEL_FAILURE,
    error
  }
}

export function userRequest({ hotelUsername, username, password, loginHotelName }) {
  return {
    type: AuthTypes.USER_REQUEST,
    loginHotelName,
    hotelUsername,
    username,
    password
  }
}

export function getAuthToken({ access_token, refresh_token, expires_in }) {
  return {
    type: AuthTypes.USER_TOKEN_SUCESS,
    access_token,
    refresh_token,
    expires_in
  }
}


export function userSuccess({ user, hotel, groups, config }) {
  return {
    type: AuthTypes.USER_SUCCESS,
    // token,
    user,
    hotel,
    groups,
    config
  }
}

export function userFailure(error) {
  return {
    type: AuthTypes.USER_FAILURE,
    error
  }
}

export function hotelFetch() {
  return {
    type: AuthTypes.HOTEL_FETCH
  }
}

export function hotelFetchSuccess({ hotel }) {
  return {
    type: AuthTypes.HOTEL_FETCH_SUCCESS,
    hotel
  }
}

export function hotelFetchFailure(error) {
  return {
    type: AuthTypes.HOTEL_FETCH_SUCCESS,
    error
  }
}

export function userFetch() {
  return {
    type: AuthTypes.USER_FETCH
  }
}

export function userFetchSuccess(user) {
  return {
    type: AuthTypes.USER_FETCH_SUCCESS,
    user
  }
}

export function userFetchFailure(error) {
  return {
    type: AuthTypes.USER_FETCH_SUCCESS,
    error
  }
}

export function configFetch() {
  return {
    type: AuthTypes.CONFIG_FETCH
  }
}

export function configFetchSuccess(data) {
  return {
    type: AuthTypes.CONFIG_FETCH_SUCCESS,
    data
  }
}

export function configFetchFailure(error) {
  return {
    type: AuthTypes.CONFIG_FETCH_FAILURE,
    error
  }
}

export function hotelReset() {
  return {
    type: AuthTypes.HOTEL_RESET
  }
}

export function userReset() {
  return {
    type: AuthTypes.USER_RESET
  }
}

export function logout() {
  return {
    type: AuthTypes.LOGOUT
  }
}

export function toggleDuty(isOnDuty) {
  return {
    type: AuthTypes.TOGGLE_DUTY,
    isOnDuty
  }
}

export function setApi(api) {
  return {
    type: AuthTypes.HOTEL_API,
    api
  }
}

export default {
  hotelRequest,
  hotelSuccess,
  hotelFailure,
  userRequest,
  getAuthToken,
  userSuccess,
  userFailure,
  hotelFetch,
  hotelFetchSuccess,
  hotelFetchFailure,
  userFetch,
  userFetchSuccess,
  userFetchFailure,
  hotelReset,
  userReset,
  logout,
  toggleDuty,
  setApi,
}
