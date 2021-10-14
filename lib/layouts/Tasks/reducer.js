import { createReducer } from 'reduxsauce';

import Types from './constants';

const getInitialState = () => ({
  tab: 0,
})

const ACTION_HANDLERS = {
  [Types.SET_ACTIVE_TAB]: (state, { tab }) => {
    return {
      tab
    }
  },
}

export default createReducer(getInitialState(), ACTION_HANDLERS);
