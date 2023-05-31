import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import FiltersTypes from '../constants/filters';
import { includes, filter } from 'lodash';

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
  activeFloorRooms: [],
  isViewNonGuest: false,
  isActiveFilter: false,
  isActiveFloorFilter: false,
  selectedRoomType: ['Private'],

  taskSearchQuery: "",
  assigneeGroup: [],
  activeAssigneeGroup: [],

  isActiveAllFilter: false,
  activeAllRooms: [],
  roomsSearchQueryAll: ""
});

const ACTION_HANDLERS = {
  [FiltersTypes.RESET_ROOM_FILTERS]: (state) => {
    return getInitialState();
  },
  [FiltersTypes.RESET_ALL_ROOM_FILTERS]: (state) => {
    return {
      ...state,
      isActiveAllFilter: false,
      activeAllRooms: [],
      roomsSearchQueryAll: ""
    };
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
  [FiltersTypes.UPDATE_ALL_SEARCH_ROOMS]: (state, { searchQuery }) => {
    if (!searchQuery) {
      const isStillActive = state.activeFloor || state.activeAllRooms.length;
      // return state
      //   .set('roomsSearchQuery', null)
      //   .set('isActiveFilter', isStillActive);
      return {
        ...state,
        roomsSearchQueryAll: null,
        isActiveAllFilter: isStillActive
      }
    }

    // return state
    //   .set('roomsSearchQuery', searchQuery)
    //   .set('isActiveFilter', true);

    return {
      ...state,
      roomsSearchQueryAll: searchQuery,
      isActiveAllFilter: true
    }
  },
  [FiltersTypes.UPDATE_ACTIVE_FLOOR]: (state, { activeFloor }) => {
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
        activeRooms: activeRooms,
        // isActiveFilter: isStillActive
        isActiveFilter: true
      }
    }

    // return state
    //   .set('activeRooms', activeRooms)
    //   .set('isActiveFilter', true);
    return {
      ...state,
      activeRooms: activeRooms,
      isActiveFilter: true
    }
  },

  [FiltersTypes.SET_ACTIVE_ALL_ROOMS]: (state, { activeRooms }) => {
    if (!activeRooms || !activeRooms.length) {
      return {
        ...state,
        activeAllRooms: activeRooms,
        isActiveAllFilter: true
      }
    }
    return {
      ...state,
      activeAllRooms: activeRooms,
      isActiveAllFilter: true
    }
  },

  [FiltersTypes.SET_ACTIVE_FLOOR_ROOMS]: (state, { activeRooms }) => {
    if (!activeRooms || !activeRooms.length) {
      const isStillActive = state.roomsSearchQuery || state.activeFloor || state.activeSection;
      // return state
      //   .set('activeRooms', [])
      //   .set('isActiveFilter', isStillActive);
      return {
        ...state,
        activeRooms: [...activeRooms],
        activeFloorRooms: [...activeRooms],
        isActiveFilter: true
      }
    }

    // return state
    //   .set('activeRooms', activeRooms)
    //   .set('isActiveFilter', true);
    return {
      ...state,
      activeRooms: [...activeRooms],
      activeFloorRooms: [...activeRooms],
      isActiveFilter: true
    }
  },
  [FiltersTypes.SET_ROOM_TYPE]: (state, { roomType }) => {
    const { selectedRoomType } = state;
    let updateRoomType = [];
    if (includes(selectedRoomType, roomType)) {
      updateRoomType = filter(selectedRoomType, function (o) { return o !== roomType })
    } else {
      updateRoomType = [...selectedRoomType, roomType]
    }

    return {
      ...state,
      selectedRoomType: updateRoomType
    }
  },
  [FiltersTypes.UPDATE_SEARCH_TASK]: (state, { taskSearchQuery }) => {
    return {
      ...state,
      taskSearchQuery: taskSearchQuery
    }
  },
  [FiltersTypes.SET_GROUP_ASSIGNEE]: (state, { assigneeGroup }) => {
    return {
      ...state,
      assigneeGroup: assigneeGroup
    }
  },
  [FiltersTypes.SET_ACTIVE_GROUP_ASSIGNEE]: (state, { assigneeGroup }) => {
    return {
      ...state,
      activeAssigneeGroup: assigneeGroup
    }
  },
}

export default createReducer(getInitialState(), ACTION_HANDLERS);