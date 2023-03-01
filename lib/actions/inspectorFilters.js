import InspectorFiltersTypes from '../constants/inspectorFilters';

export function resetRoomsFilters() {
  return {
    type: InspectorFiltersTypes.RESET_ROOM_FILTERS
  }
}

export function resetFloorFilters() {
  return {
    type: InspectorFiltersTypes.RESET_FLOOR_FILTERS
  }
}

export function updateCleanerOperation(data) {
  return {
    type: InspectorFiltersTypes.UPDATE_CLEANER_SELECTION,
    data
  }
}

export function updateFloorOperation({ floorId }) {
  return {
    type: InspectorFiltersTypes.UPDATE_FLOOR_OPERATION,
    floorId
  }
}

export function updateFloorSectionOperation({ sectionData }) {
  return {
    type: InspectorFiltersTypes.UPDATE_FLOOR_SECTION_OPERATION,
    sectionData
  }
}

export function updateRoomFilterOperation({ roomFilterData }) {
  return {
    type: InspectorFiltersTypes.UPDATE_ROOM_FILTER_OPERATION,
    roomFilterData
  }
}

export function updateRoomTypeOperation({ roomType }) {
  return {
    type: InspectorFiltersTypes.UPDATE_ROOM_TYPE_OPERATION,
    roomType
  }
}

export function setActiveRooms({ activeRooms }) {
  return {
    type: InspectorFiltersTypes.SET_ACTIVE_ROOMS,
    activeRooms
  }
}

export function updateSearchRooms({ searchQuery }) {
  return {
    type: InspectorFiltersTypes.UPDATE_SEARCH_ROOMS,
    searchQuery
  }
}

export function updateActiveFloor({ activeFloor }) {
  return {
    type: InspectorFiltersTypes.UPDATE_ACTIVE_FLOOR,
    activeFloor
  }
}

export function updateActiveSection({ activeSection }) {
  return {
    type: InspectorFiltersTypes.UPDATE_ACTIVE_SECTION,
    activeSection
  }
}

export function toggleNonGuestRooms() {
  return {
    type: InspectorFiltersTypes.TOGGLE_NON_GUEST_ROOMS
  }
}

export function setActiveRoomsForFloor({ activeRooms }) {
  return {
    type: InspectorFiltersTypes.SET_ACTIVE_FLOOR_ROOMS,
    activeRooms
  }
}

export function setRoomType({ roomType }) {
  return {
    type: InspectorFiltersTypes.SET_ROOM_TYPE,
    roomType
  }
}

export default {
  resetRoomsFilters,
  resetFloorFilters,
  
  updateFloorOperation,
  updateFloorSectionOperation,
  updateRoomFilterOperation,
  updateRoomTypeOperation,
  updateCleanerOperation,
  
  updateSearchRooms,
  updateActiveFloor,
  updateActiveSection,
  toggleNonGuestRooms,
  setActiveRooms,

  setActiveRoomsForFloor,
  setRoomType
}
