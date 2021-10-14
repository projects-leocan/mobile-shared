import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import OverlayTypes from '../constants/overlay';

// export const INITIAL_STATE = Immutable({
//   isVisible: false,
//   icon: 'Wave',
//   message: '',
//   color: '#FFFFFF'
// });

const getInitialState = () => ({
  isVisible: false,
  icon: 'Wave',
  message: '',
  color: '#FFFFFF'
})

const ACTION_HANDLERS = {
  [OverlayTypes.SHOW_OVERLAY]: (state, { icon, message, color }) => {
    // return state
    //   .set('isVisible', true)
    //   .set('icon', icon)
    //   .set('message', message)
    //   .set('color', color);
    return {
      ...state,
      isVisible: true,
      icon,
      message,
      color
    }
  },
  [OverlayTypes.HIDE_OVERLAY]: (state) => {
    // return INITIAL_STATE;
    return getInitialState();
  }
};

export default createReducer(getInitialState(), ACTION_HANDLERS);
