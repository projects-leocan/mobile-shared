import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import InspectorFiltersTypes from '../constants/inspectorFilters';
import _, { includes, filter, some, isEqual, isMatch, findIndex, map, compact } from 'lodash';
import { get } from 'lodash/object';

const getInitialState = () => ({
  roomsSearchQuery: "",
  allRooms: [],
  privateRoom: [],
  activeRooms: [],
  isHeaderFilter: false,
  isActiveFilter: false,
  filterOperation: {
    roomOperation: [],
    floorOperation: [],
    floorSectionOperation: [],
    cleanerSelectionOperation: false,
    roomTypeOperation: ['Private'],
    roomsSearchQuery: "",
    attendantSelectedFilter: [],
    attendantSelectedFilterNight: []
  },
  isNightyCleaningOperation: false,
  selectedFloor: [],
  selectedFloorSectionVise: [],
  attendantFilter: [],
  attendantNightyFilter: [],
  selectedRoomType: ['Private'],
  selectedFiltersAre: []
});

const validateFilterStatus = (filterOperation, header) => {
  try {
    const isRoomOperation = get(filterOperation, 'roomOperation', []).length > 0;
    const isFloorOperation = get(filterOperation, 'floorOperation', []).length > 0;
    const isFloorSectionOperation = get(filterOperation, 'floorSectionOperation', []).length > 0;
    const isRoomTypeOperation = filter(get(filterOperation, 'roomTypeOperation', []), function (o) { return o !== 'Private' }).length > 0;
    const cleanerSelectionOperation = get(filterOperation, 'cleanerSelectionOperation.isSelectCleanerFilter');
    const roomSearchQuery = get(filterOperation, 'roomsSearchQuery', '').length > 0;
    const isAttendantFilter = get(filterOperation, 'attendantSelectedFilter', []).length > 0;
    const isAttendantNightyFilter = get(filterOperation, 'attendantSelectedFilterNight', []).length > 0;

    if (isRoomOperation || isFloorOperation || isFloorSectionOperation || isRoomTypeOperation || cleanerSelectionOperation || roomSearchQuery || isAttendantFilter || isAttendantNightyFilter || header) {
      return true
    } else {
      return false
    }
  } catch (error) {

  }
}

const ACTION_HANDLERS = {
  [InspectorFiltersTypes.RESET_ROOM_FILTERS]: (state) => {
    return getInitialState();
  },
  [InspectorFiltersTypes.UPDATE_CLEANER_SELECTION]: (state, { data }) => {
    const updatedFilterOperation = {
      ...state.filterOperation,
      cleanerSelectionOperation: data,
    }
    return {
      ...state,
      isActiveFilter: validateFilterStatus(updatedFilterOperation, state.isHeaderFilter),
      filterOperation: updatedFilterOperation
    }
  },
  [InspectorFiltersTypes.RESET_FLOOR_FILTERS]: (state) => {
    const updatedFilterOperation = {
      ...state.filterOperation,
      floorOperation: [],
      floorSectionOperation: []
    }

    return {
      ...state,
      // isHeaderFilter: false,
      isActiveFilter: validateFilterStatus(updatedFilterOperation, state.isHeaderFilter),
      filterOperation: updatedFilterOperation
    }
  },
  [InspectorFiltersTypes.UPDATE_SEARCH_ROOMS]: (state, { searchQuery }) => {
    const updatedFilterOperation = {
      ...state.filterOperation,
      roomsSearchQuery: searchQuery
    }

    if (!searchQuery) {
      const isStillActive = state.activeFloor || state.activeSection || state.activeRooms.length;

      return {
        ...state,
        roomsSearchQuery: null,
        // isHeaderFilter: false,
        isActiveFilter: validateFilterStatus(updatedFilterOperation, state.isHeaderFilter),
        filterOperation: updatedFilterOperation
      }
    }

    return {
      ...state,
      // isHeaderFilter: false,
      roomsSearchQuery: searchQuery,
      isActiveFilter: validateFilterStatus(updatedFilterOperation, state.isHeaderFilter),
      filterOperation: updatedFilterOperation
    }
  },
  [InspectorFiltersTypes.UPDATE_FLOOR_OPERATION]: (state, { floorId }) => {
    // const floorOperation = get(state, 'filterOperation.floorOperation', []);
    // let updateFloorOperation = [];
    // if (includes(floorOperation, floorId)) {
    //   updateFloorOperation = filter(floorOperation, function (o) { return o !== floorId })
    // } else {
    //   updateFloorOperation = [...floorOperation, floorId]
    // }

    const updatedFilterOperation = {
      ...state.filterOperation,
      floorOperation: floorId,
      floorSectionOperation: state.selectedFloorSectionVise
    }

    return {
      ...state,
      // isHeaderFilter: false,
      isActiveFilter: validateFilterStatus(updatedFilterOperation, state.isHeaderFilter),
      filterOperation: updatedFilterOperation
    }
  },
  [InspectorFiltersTypes.UPDATE_FLOOR_SECTION_OPERATION]: (state, { sectionData }) => {
    const updatedFilterOperation = {
      ...state.filterOperation,
      floorSectionOperation: sectionData
    }

    return {
      ...state,
      // isHeaderFilter: false,
      isActiveFilter: validateFilterStatus(updatedFilterOperation, state.isHeaderFilter),
      filterOperation: updatedFilterOperation
    }
  },
  [InspectorFiltersTypes.UPDATE_FLOOR_SECTION_OPERATION_ON_SELECTION]: (state, { backdrop, selectedFloor }) => {
    let selectedFloorFilter = []
    if (backdrop) {
      selectedFloorFilter = state.filterOperation.floorSectionOperation
    }
    else {
      selectedFloorFilter = selectedFloor
    }
    return {
      ...state,
      selectedFloorSectionVise: selectedFloorFilter
    }
  },
  [InspectorFiltersTypes.UPDATE_ATTENDANT_STATUS_FILTER]: (state, { data }) => {
    const updatedFilterOperation = {
      ...state.filterOperation,
      attendantSelectedFilter: data.map((d) => d.id)
    }

    return {
      ...state,
      attendantFilter: data,
      filterOperation: updatedFilterOperation,
      isActiveFilter: validateFilterStatus(updatedFilterOperation, state.isHeaderFilter),

      // selectedFloorSectionVise: selectedFloorFilter
    }
  },
  [InspectorFiltersTypes.UPDATE_ATTENDANT_NIGHTY_STATUS_FILTER]: (state, { data }) => {
    const updatedFilterOperation = {
      ...state.filterOperation,
      attendantSelectedFilterNight: data.map((d) => d.id)
    }

    return {
      ...state,
      attendantNightyFilter: data,
      filterOperation: updatedFilterOperation,
      isActiveFilter: validateFilterStatus(updatedFilterOperation, state.isHeaderFilter),

      // selectedFloorSectionVise: selectedFloorFilter
    }
  },
  [InspectorFiltersTypes.GET_SELECTED_FILTER]: (state, { data, selected, selectedFilter }) => {
    let selectedData = []
    if (_.isEmpty(state.selectedFiltersAre)) {
      if (!selected) {
        selectedData = [...state.selectedFiltersAre, data]
      }
      else {
        selectedData = state.selectedFiltersAre.filter((se) => se.label !== data.label)
      }
    }
    else {
      if (state.selectedFiltersAre[0].type === selectedFilter) {
        if (!selected) {
          selectedData = [...state.selectedFiltersAre, data]
        }
        else {
          selectedData = state.selectedFiltersAre.filter((se) => se.label !== data.label)
        }
      }
      else {
        if (!selected) {
          selectedData = [data]
        }
        else {
          selectedData = state.selectedFiltersAre.filter((se) => se.label !== data.label)
        }
      }
    }

    return {
      ...state,
      selectedFiltersAre: selectedData

      // selectedFloorSectionVise: selectedFloorFilter
    }
  },

  [InspectorFiltersTypes.UPDATE_FLOOR_SELECTION_SAVE_BTN]: (state, { selectedFloor, backdrop }) => {
    let selectedFloorFilter = []
    if (backdrop) {
      selectedFloorFilter = state.filterOperation.floorOperation
    }
    else {
      selectedFloorFilter = selectedFloor
    }
    return {
      ...state,
      selectedFloor: selectedFloorFilter,
    }
  },
  [InspectorFiltersTypes.UPDATE_ROOM_FILTER_OPERATION]: (state, { roomFilterData }) => {
    const roomOperation = get(state, 'filterOperation.roomOperation', []);
    let updateRoomOperation = [];

    const validateRoomOperation = compact(map(roomOperation, function (o) {
      if (get(o, 'rootType', '') === roomFilterData.rootType) {
        if (get(o, 'filterType', '') === roomFilterData.filterType) {
          return o
        }
      } else {
        return o
      }
    }))
    if (some(validateRoomOperation, roomFilterData)) {
      updateRoomOperation = filter(validateRoomOperation, function (o) { return !isEqual(o, roomFilterData) })
    } else {
      updateRoomOperation = [...validateRoomOperation, roomFilterData]
    }


    const updatedFilterOperation = {
      ...state.filterOperation,
      roomOperation: updateRoomOperation
    }

    return {
      ...state,
      // isHeaderFilter: false,
      isActiveFilter: validateFilterStatus(updatedFilterOperation, state.isHeaderFilter),
      filterOperation: updatedFilterOperation
    }
  },
  [InspectorFiltersTypes.UPDATE_ROOM_TYPE_OPERATION]: (state, { roomType }) => {
    const roomTypeOperation = get(state, 'filterOperation.roomTypeOperation', []);
    let updateRoomTypeOperation = [];
    if (includes(roomTypeOperation, roomType)) {
      updateRoomTypeOperation = filter(roomTypeOperation, function (o) { return o !== roomType })
    } else {
      updateRoomTypeOperation = [...roomTypeOperation, roomType]
    }

    const updatedFilterOperation = {
      ...state.filterOperation,
      roomTypeOperation: updateRoomTypeOperation
    }

    return {
      ...state,
      // isHeaderFilter: false,
      isActiveFilter: validateFilterStatus(updatedFilterOperation, state.isHeaderFilter),
      filterOperation: updatedFilterOperation
    }
  },
  [InspectorFiltersTypes.SET_ACTIVE_ROOMS]: (state, { activeRooms }) => {
    return {
      ...state,
      activeRooms: activeRooms,
      isActiveFilter: true,
      isHeaderFilter: true
    }
  },
  [InspectorFiltersTypes.UPDATE_ACTIVE_FLOOR]: (state, { activeFloor }) => {
    if (!activeFloor) {
      const isStillActive = state.roomsSearchQuery || state.activeSection || state.activeRooms.length;
      return {
        ...state,
        activeFloor,
        isActiveFilter: isStillActive
      }
    }

    return {
      ...state,
      activeFloor,
      isActiveFilter: true
    }
  },
  [InspectorFiltersTypes.UPDATE_ACTIVE_SECTION]: (state, { activeSection }) => {
    if (!activeSection) {
      const isStillActive = state.roomsSearchQuery || state.activeFloor || state.activeRooms.length;

      return {
        ...state,
        activeSection,
        isActiveFilter: isStillActive
      }
    }

    return {
      ...state,
      activeSection,
      isActiveFilter: true
    }
  },
  [InspectorFiltersTypes.TOGGLE_NON_GUEST_ROOMS]: (state) => {
    const isViewNonGuest = !state.isViewNonGuest;

    return {
      ...state,
      isViewNonGuest
    }
  },
  [InspectorFiltersTypes.SET_ACTIVE_FLOOR_ROOMS]: (state, { activeRooms }) => {
    if (!activeRooms || !activeRooms.length) {
      const isStillActive = state.roomsSearchQuery || state.activeFloor || state.activeSection;

      return {
        ...state,
        activeRooms: [...activeRooms],
        activeFloorRooms: [...activeRooms],
        isActiveFilter: true
      }
    }


    return {
      ...state,
      activeRooms: [...activeRooms],
      activeFloorRooms: [...activeRooms],
      isActiveFilter: true
    }
  },
  [InspectorFiltersTypes.SET_ROOM_TYPE]: (state, { roomType }) => {
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
  }
}

export default createReducer(getInitialState(), ACTION_HANDLERS);
