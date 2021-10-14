import { createReducer } from 'reduxsauce';

import Types from './types';

const getInitialState = () => ({
  on: true,
  isRunning: false
})

const ACTION_HANDLERS = {
  [Types.POWER]: (state) => {
    return state
  },
  [Types.POWER_FAILURE]: (state) => {
    return state
  },
  [Types.NOT_SUPPORTED]: (state) => {
    return state
  },
  [Types.POWER_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      on: payload.on
    }
  },
  [Types.TOGGLE_POWER_RUNNING]: (state) => {
    return {
      ...state,
      isRunning: true
    }
  },
  [Types.TOGGLE_POWER_FINISHED]: (state) => {
    return {
      ...state,
      isRunning: false
    }
  }
}

export default createReducer(getInitialState(), ACTION_HANDLERS);
