import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import { findIndex } from 'lodash/array';
import { get } from 'lodash/object';

import GlitchesTypes from '../constants/glitches';

// export const INITIAL_STATE = Immutable({
//   activeGlitch: null,
//   hotelGlitches: [],
// });

const getInitialState = () => ({
  activeGlitch: null,
  hotelGlitches: [],
  glitchOptions: []
});

const ACTION_HANDLERS = {
  [GlitchesTypes.GLITCHES_RESET]: (state) => {
    return getInitialState();
  },
  [GlitchesTypes.GLITCHES_SUCCESS]: (state, { glitches }) => {
    // return state.set('hotelGlitches', glitches);
    return {
      ...state,
      hotelGlitches: glitches
    }
  },
  [GlitchesTypes.GLITCHES_OPTIONS_SUCCESS]: (state, { glitchOptions }) => {
    return {
      ...state,
      glitchOptions
    }
  },
  [GlitchesTypes.GLITCH_ACTIVATE]: (state, { glitchId }) => {
    // return state.set('activeGlitch', glitchId);
    return {
      ...state,
      activeGlitch: glitchId
    }
  },
  [GlitchesTypes.GLITCH_DEACTIVATE]: (state) => {
    // return state.set('activeGlitch', null);
    return {
      ...state,
      activeGlitch: null
    }
  },
  [GlitchesTypes.GLITCH_ACKNOWLEDGE_OPTIMISTIC]: (state, { glitchId, userId }) => {
    const glitchIndex = findIndex(state.hotelGlitches, { uuid: glitchId });
    // const { hotelGlitches } = state;
    const glitch = {
      ...state.hotelGlitches[glitchIndex],
      assignment: {
        id: get(glitch, 'assignment.id'),
        user_ids: get(glitch, 'assignment.user_ids', []),
        acknowledged: [userId,]    
      }
    }
    
    const hotelGlitches = state.hotelGlitches
      .map(hotelGlitch => hotelGlitch.uuid !== glitchId ? hotelGlitch : glitch)

    return {
      ...state,
      hotelGlitches
    }
  },
  [GlitchesTypes.GLITCH_BATCH_ACKNOWLEDGE_OPTIMISTIC]: (state, { entries, userId }) => {
    const hotelGlitches = state.hotelGlitches
      .map(hotelGlitch => entries.includes(hotelGlitch.uuid) ? ({
        ...hotelGlitch,
        assignment: {
          ...hotelGlitch.assignment,
          acknowledged: [userId,]
        }
      }) : hotelGlitch)

    return {
      ...state,
      hotelGlitches
    }
  }
}

export default createReducer(getInitialState(), ACTION_HANDLERS);
