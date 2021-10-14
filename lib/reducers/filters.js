import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import FiltersTypes from '../constants/filters';

// export const INITIAL_STATE = Immutable({
//   roomsSearchQuery: "",
//   activeFloor: null,
//   activeSection: null,
//   activeRooms: [],
//   isActiveFilter: false,
// });

const getInitialState = () => ({
  roomsSearchQuery: "",
  activeFloor: null,
  activeSection: null,
  activeRooms: [],
  isViewNonGuest: false,
  isActiveFilter: false
});

const ACTION_HANDLERS = {
  [FiltersTypes.RESET_ROOM_FILTERS]: (state) => {
    return getInitialState();
  },
  [FiltersTypes.UPDATE_SEARCH_ROOMS]: (state, { searchQuery }) => {
    if (!searchQuery) {
      const isStillActive = state.activeFloor || state.activeSection || state.activeRooms.length;
      // return state
      //   .set('roomsSearchQuery', null)
      //   .set('isActiveFilter', isStillActive);
      return {
        ...state,
        roomsSearchQuery: null,
        isActiveFilter: isStillActive
      }
    }

    // return state
    //   .set('roomsSearchQuery', searchQuery)
    //   .set('isActiveFilter', true);

    return {
      ...state,
      roomsSearchQuery: searchQuery,
      isActiveFilter: true
    }
  },
  [FiltersTypes.UPDATE_ACTIVE_FLOOR]: (state, { activeFloor })  => {
    if (!activeFloor) {
      const isStillActive = state.roomsSearchQuery || state.activeSection || state.activeRooms.length;
      // return state
      //   .set('activeFloor', activeFloor)
      //   .set('isActiveFilter', isStillActive);
      return {
        ...state,
        activeFloor,
        isActiveFilter: isStillActive
      }
    }

    // return state
    //   .set('activeFloor', activeFloor)
    //   .set('isActiveFilter', true)
    return {
      ...state,
      activeFloor,
      isActiveFilter: true
    }
  },
  [FiltersTypes.UPDATE_ACTIVE_SECTION]: (state, { activeSection }) => {
    if (!activeSection) {
      const isStillActive = state.roomsSearchQuery || state.activeFloor || state.activeRooms.length;
      // return state
      //   .set('activeSection', activeSection)
      //   .set('isActiveFilter', isStillActive);
      return {
        ...state,
        activeSection,
        isActiveFilter: isStillActive
      }
    }

    // return state
    //   .set('activeSection', activeSection)
    //   .set('isActiveFilter', true);
    return {
      ...state,
      activeSection,
      isActiveFilter: true
    }
  },
  [FiltersTypes.TOGGLE_NON_GUEST_ROOMS]: (state) => {
    const isViewNonGuest = !state.isViewNonGuest;

    return {
      ...state,
      isViewNonGuest
    }
  },
  [FiltersTypes.SET_ACTIVE_ROOMS]: (state, { activeRooms }) => {
    if (!activeRooms || !activeRooms.length) {
      const isStillActive = state.roomsSearchQuery || state.activeFloor || state.activeSection;
      // return state
      //   .set('activeRooms', [])
      //   .set('isActiveFilter', isStillActive);
      return {
        ...state,
        activeRooms: [],
        isActiveFilter: isStillActive
      }
    }

    // return state
    //   .set('activeRooms', activeRooms)
    //   .set('isActiveFilter', true);
    return {
      ...state,
      activeRooms,
      isActiveFilter: true
    }
  }
}

export default createReducer(getInitialState(), ACTION_HANDLERS);
