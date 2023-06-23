import FiltersTypes from '../constants/filters';

export function resetRoomsFilters() {
  return {
    type: FiltersTypes.RESET_ROOM_FILTERS
  }
}

export function resetAllRoomsFilter() {
  return {
    type: FiltersTypes.RESET_ALL_ROOM_FILTERS
  }
}

export function updateSearchRooms({ searchQuery }) {
  return {
    type: FiltersTypes.UPDATE_SEARCH_ROOMS,
    searchQuery
  }
}

export function updateAllSearchRooms({ searchQuery }) {
  return {
    type: FiltersTypes.UPDATE_ALL_SEARCH_ROOMS,
    searchQuery
  }
}

export function updateActiveFloor({ activeFloor }) {
  return {
    type: FiltersTypes.UPDATE_ACTIVE_FLOOR,
    activeFloor
  }
}

export function updateActiveSection({ activeSection }) {
  return {
    type: FiltersTypes.UPDATE_ACTIVE_SECTION,
    activeSection
  }
}

export function toggleNonGuestRooms() {
  return {
    type: FiltersTypes.TOGGLE_NON_GUEST_ROOMS
  }
}

export function setActiveRooms({ activeRooms }) {
  return {
    type: FiltersTypes.SET_ACTIVE_ROOMS,
    activeRooms
  }
}

export function setActiveFromAllRooms({ activeRooms }) {
  return {
    type: FiltersTypes.SET_ACTIVE_ALL_ROOMS,
    activeRooms
  }
}

export function setActiveRoomsForFloor({ activeRooms }) {
  return {
    type: FiltersTypes.SET_ACTIVE_FLOOR_ROOMS,
    activeRooms
  }
}

export function setRoomType({ roomType }) {
  return {
    type: FiltersTypes.SET_ROOM_TYPE,
    roomType
  }
}

export function updateSearchTask({ taskSearchQuery }) {
  return {
    type: FiltersTypes.UPDATE_SEARCH_TASK,
    taskSearchQuery
  }
}

export function setGroupAssignee({ assigneeGroup }) {
  return {
    type: FiltersTypes.SET_GROUP_ASSIGNEE,
    assigneeGroup
  }
}

export function setActiveGroupAssignee({ assigneeGroup }) {
  return {
    type: FiltersTypes.SET_ACTIVE_GROUP_ASSIGNEE,
    assigneeGroup
  }
}

export function setRoomLocation(data) {
  return {
    type: FiltersTypes.SET_ROOM_LOCATION,
    data
  }
}

export default {
  resetRoomsFilters,
  updateSearchRooms,
  updateActiveFloor,
  updateActiveSection,
  toggleNonGuestRooms,
  setActiveRooms,

  setActiveRoomsForFloor,
  setRoomType,

  updateSearchTask,

  setGroupAssignee,
  setRoomLocation,
  setActiveGroupAssignee,

  //filterapply in filter in attendant rooms in drawer
  setActiveFromAllRooms,
  updateAllSearchRooms,
  resetAllRoomsFilter
}
