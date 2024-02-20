import AuthTypes from '../constants/authLoader';



export function loaderHotelRequest() {
  return {
    type: AuthTypes.LOADER_HOTEL_REQUEST,
  }
}

export function loaderHotelSuccess() {
  return {
    type: AuthTypes.LOADER_HOTEL_SUCCESS,
  }
}

export function loaderHotelFailure() {
  return {
    type: AuthTypes.LOADER_HOTEL_FAILURE,
  }
}


export default {
    loaderHotelRequest,
    loaderHotelSuccess,
    loaderHotelFailure,
}
