import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import Types from './constants';

// const initial = {
//   isOnline: false
// };
// const INITIAL_STATE = Immutable(initial);

const getInitialState = () => ({
  isOnline: false,
  isConnected: false
})

const ACTION_HANDLERS = {
  [Types.NETWORK_STATUS]: (state, { isOnline }) => {
    return {
      ...state,
      isOnline
    }
  },
  [Types.SOCKET_STATUS]: (state, { isConnected }) => {
    return {
      ...state,
      isConnected
    }
  },
}

export default createReducer(getInitialState(), ACTION_HANDLERS);
