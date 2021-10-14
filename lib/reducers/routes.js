import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import RoutesTypes from '../constants/routes';

// export const INITIAL_STATE = Immutable({
//   scene: null
// });

const getInitialState = () => ({
  scene: null
})

const ACTION_HANDLERS = {
  
};

export default createReducer(getInitialState(), ACTION_HANDLERS);
