import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import Types from './constants';

// const initial = {
//   isOnline: false
// };
// const INITIAL_STATE = Immutable(initial);

const getInitialState = () => ({
  isOnline: false,
  isConnected: false,
  onlineOfflineTimeoutValue: {intervalTime: '20000', offlineIntervalTime: '1000', timeOutTime: "24000"}
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
  [Types.OFFLINE_ONLINE_TIMEOUT_VALUE]: (state, { data }) => {
    return {
      ...state,
      onlineOfflineTimeoutValue:data
    }
  },
}

export default createReducer(getInitialState(), ACTION_HANDLERS);
