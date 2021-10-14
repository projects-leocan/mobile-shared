import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import moment from 'moment';

import RoomsTypes from '../constants/rooms';

// export const INITIAL_STATE = Immutable({
//   items: null
// });

const getInitialState = () => ({
  items: null
})

const ACTION_HANDLERS = {
  [RoomsTypes.PLANNINGS_UPDATES]: (state, { updates }) => {
    if (!updates) {
      // return state;
      return { ...state }
    }
    // return state.set('items', updates);
    return {
      ...state,
      items: updates
    }
  },
  [RoomsTypes.PLANNINGS_UPDATE_READ]: (state, { updateId }) => {
    // return state
    //   .setIn(['items', updateId, 'alertWasRead'], true)
    //   .setIn(['items', updateId, 'alertReadTs'], moment().unix());

    const newItems = {
      ...state.items,
      [updateId]: {
        ...state.items[updateId],
        alertWasRead: true,
        alertReadTs: moment().unix()
      }
    }

    return {
      ...state,
      items: newItems
    }
  },
}

export default createReducer(getInitialState(), ACTION_HANDLERS);
