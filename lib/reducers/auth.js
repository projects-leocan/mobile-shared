import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import AuthTypes from '../constants/auth';
import api from '../api';

import moment from 'moment';
import { isEmpty } from 'lodash';
import get from 'lodash/get';
import { omit } from 'lodash/object';

// export const INITIAL_STATE = Immutable({
//   isActiveHotel: false,
//   hotelUsername: null,
//   hotelName: null,
//   hotelImage: null,
//   hotelUsers: [],
//   user: null,
//   hotel: null,
//   groups: [],
//   config: {},
//   userId: null,
//   hotelId: null,
//   token: null,
//   error: null
// });

const getInitialState = () => ({
  isActiveHotel: false,
  hotelUsername: null,
  hotelName: null,
  loginHotelName: null,
  hotelImage: null,
  hotelGroupKey: null,
  hotelUsers: [],
  user: null,
  hotel: {},
  groups: [],
  config: {},
  userId: null,
  hotelId: null,
  token: null,
  refresh_token: null,
  error: null,
  api
})

const ACTION_HANDLERS = {
  [AuthTypes.HOTEL_REQUEST]: (state, { hotel }) => {
    // return state
    //   .set('hotelUsername', hotel);
    return {
      ...state,
      hotelUsername: hotel
    }
  },
  [AuthTypes.HOTEL_SUCCESS]: (state, { loginHotelName, name, images, users }) => {
    // return state
    //   .set('isActiveHotel', true)
    //   .set('hotelName', name)
    //   .set('hotelImage', images)
    //   .set('hotelUsers', users);
    return {
      ...state,
      isActiveHotel: isEmpty(users) ? false : true,
      loginHotelName: loginHotelName,
      hotelName: name,
      hotelImage: images,
      hotelUsers: users
    }
  },
  [AuthTypes.HOTEL_FAILURE]: (state) => {
    // return state;
    return { ...state }
  },
  [AuthTypes.USER_TOKEN_SUCESS]: (state, { access_token, refresh_token, expires_in }) => {
    // return state.set('hotel', hotel);
    return {
      ...state,
      token: access_token,
      refresh_token,
      expires_in,
      loginTs: moment().unix()
    }
  },
  [AuthTypes.USER_SUCCESS]: (state, { hotel, user, groups, config }) => {
    const { id: userId } = user;
    // const { id: hotelId } = hotel;

    let hotelId = null;
    const hotelGroupKey = get(user, 'hotelGroupKey', null);
    hotelId = user.availableHotels.length > 0 ? user.availableHotels[0].hotelId : null;
    if (hotelId === '1') {
      hotelId = user.availableHotels[1].hotelId
    }

    // return state
    //   .set('token', token)
    //   .set('hotel', hotel)
    //   .set('user', user)
    //   .set('userId', userId)
    //   .set('hotelId', hotelId)
    //   .set('groups', groups)
    //   .set('config', config || {});

    return {
      ...state,
      // token,
      hotel,
      hotelGroupKey: hotelGroupKey,
      user,
      userId,
      hotelId,
      groups,
      config: config || {}
    }
  },
  [AuthTypes.USER_FAILURE]: (state) => {
    // return state;
    return { ...state }
  },
  [AuthTypes.HOTEL_FETCH_SUCCESS]: (state, { hotel }) => {
    // return state.set('hotel', hotel);
    return {
      ...state,
      hotel
    }
  },
  [AuthTypes.USER_FETCH_SUCCESS]: (state, { user }) => {
    return {
      ...state,
      user
    }
  },
  [AuthTypes.CONFIG_FETCH_SUCCESS]: (state, { config }) => {
    return {
      ...state,
      config
    }
  },
  [AuthTypes.HOTEL_RESET]: (state) => {
    // return INITIAL_STATE;
    // return getInitialState()
    const hotelName = state.loginHotelName;
    return {
      ...getInitialState(),
      hotelName: hotelName
    }
  },
  [AuthTypes.USER_RESET]: (state) => {
    // return state
    //   .set('token', null)
    //   .set('hotel', null)
    //   .set('userId', null)

    return {
      ...state,
      token: null,
      // hotel: null,
      userId: null
    }
  },
  [AuthTypes.TOGGLE_DUTY]: (state, { isOnDuty }) => {
    return {
      ...state,
      user: {
        ...state.user,
        isOnDuty
      }
    }
  },
  [AuthTypes.HOTEL_API]: (state, { api }) => {
    return {
      ...state,
      api
    }
  }
};

export default createReducer(getInitialState(), ACTION_HANDLERS);
