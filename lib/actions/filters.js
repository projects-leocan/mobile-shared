import FiltersTypes from '../constants/filters';

export function resetRoomsFilters() {
  return {
    type: FiltersTypes.RESET_ROOM_FILTERS
  }
}

export function updateSearchRooms({ searchQuery }) {
  return {
    type: FiltersTypes.UPDATE_SEARCH_ROOMS,
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

export default {
  resetRoomsFilters,
  updateSearchRooms,
  updateActiveFloor,
  updateActiveSection,
  toggleNonGuestRooms,
  setActiveRooms
}
