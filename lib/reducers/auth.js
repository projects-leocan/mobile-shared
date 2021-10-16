import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import AuthTypes from '../constants/auth';
import api from  '../api';

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
  hotelImage: null,
  hotelUsers: [],
  user: null,
  hotel: {},
  groups: [],
  config: {},
  userId: null,
  hotelId: null,
  token: null,
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
  [AuthTypes.HOTEL_SUCCESS]: (state, {name, images, users}) => {
    // return state
    //   .set('isActiveHotel', true)
    //   .set('hotelName', name)
    //   .set('hotelImage', images)
    //   .set('hotelUsers', users);
    return {
      ...state,
      isActiveHotel: true,
      hotelName: name,
      hotelImage: images,
      hotelUsers: users
    }
  },
  [AuthTypes.HOTEL_FAILURE]: (state) => {
    // return state;
    return { ...state }
  },
  [AuthTypes.USER_SUCCESS]: (state, { token, hotel, user, groups, config }) => {
    const { _id: userId } = user;
    const { _id: hotelId } = hotel;

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
      token,
      hotel,
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
    return getInitialState()
  },
  [AuthTypes.USER_RESET]: (state) => {
    // return state
    //   .set('token', null)
    //   .set('hotel', null)
    //   .set('userId', null)

    return {
      ...state,
      token: null,
      hotel: null,
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
