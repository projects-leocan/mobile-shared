import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import UsersTypes from '../constants/users';

// export const INITIAL_STATE = Immutable({
//   users: [],
//   hotelGroups: []
// });

const getInitialState = () => ({
  users: [],
  hotelGroups: [],
  updatesCount: 0
});

const ACTION_HANDLERS = {
  [UsersTypes.USERS_SUCCESS]: (state, { users }) => {
    // return state
    //   .set('users', users);
    return {
      ...state,
      users
    }
  },
  [UsersTypes.GROUPS_SUCCESS]: (state, { groups }) => {
    // return state
    //   .set('hotelGroups', groups);
    return {
      ...state,
      hotelGroups: groups
    }
  },
  [UsersTypes.UPDATE_USERS_INCREMENT]: (state, action) => {
    const updatesCount = (state.updatesCount || 0) + 1;
    
    return {
      ...state,
      updatesCount
    }
  }
}

export default createReducer(getInitialState(), ACTION_HANDLERS);