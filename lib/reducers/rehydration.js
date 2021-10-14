import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import {REHYDRATE} from 'redux-persist';

// export const INITIAL_STATE = Immutable({
//   isRehydrated: false
// });

const getInitialState = () => ({
  isRehydrated: false
});

const ACTION_HANDLERS = {
  [REHYDRATE]: (state, { payload }) => {
    // return state.set('isRehydrated', true);
    return { isRehydrated: true }
  },
}

export default createReducer(getInitialState(), ACTION_HANDLERS);
