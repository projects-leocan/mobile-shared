import BackendTypes from '../constants/backend';

export function reset() {
  return {
    type: BackendTypes.RESET
  }
}

export function roomsFetched() {
  return {
    type: BackendTypes.ROOMS_FETCHED
  }
}

export function floorsFetched() {
  return {
    type: BackendTypes.FLOORS_FETCHED
  }
}

export function roomStatusesFetched() {
  return {
    type: BackendTypes.ROOM_STATUSES_FETCHED
  }
}

export function roomHousekeepingsFetched() {
  return {
    type: BackendTypes.ROOM_HOUSEKEEPINGS_FETCHED
  }
}

export function roomCategoriesFetched() {
  return {
    type: BackendTypes.ROOM_CATEGORY_FETCHED
  }
}

export function calendarFetched() {
  return {
    type: BackendTypes.CALENDAR_FETCHED
  }
}

export function planningsFetched() {
  return {
    type: BackendTypes.PLANNINGS_FETCHED
  }
}

export function roomNotesFetched() {
  return {
    type: BackendTypes.ROOM_NOTES_FETCHED
  }
}

export function catalogsFetched() {
  return {
    type: BackendTypes.CATALOGS_FETCHED
  }
}

export function tasksFetched() {
  return {
    type: BackendTypes.TASKS_FETCHED
  }
}

export function assetsFetched() {
  return {
    type: BackendTypes.ASSETS_FETCHED
  }
}

export function virtualAssetsFetched() {
  return {
    type: BackendTypes.VIRTUAL_ASSETS_FETCHED
  }
}

export function durableAssetsFetched() {
  return {
    type: BackendTypes.DURABLE_ASSETS_FETCHED
  }
}

export function roomAreasFetched() {
  return {
    type: BackendTypes.ROOM_AREAS_FETCHED
  }
}

export function customActionsFetched() {
  return {
    type: BackendTypes.CUSTOM_ACTIONS_FETCHED
  }
}
export function assetRoomsBackend() {
  return {
    type: BackendTypes.ASSET_ROOMS_BACKEND
  }
}

export function assetRoomsFetched() {
  return {
    type: BackendTypes.ASSET_ROOMS_FETCHED
  }
}

export function inventoryWithdrawalFetched() {
  return {
    type: BackendTypes.INVENTORY_WITHDRAWAL_FETCHED
  }
}

export function usersFetched() {
  return {
    type: BackendTypes.USERS_FETCHED
  }
}

export function groupsFetched() {
  return {
    type: BackendTypes.GROUPS_FETCHED
  }
}

export function glitchesFetched() {
  return {
    type: BackendTypes.GLITCHES_FETCHED
  }
}

export function historyFetched() {
  return {
    type: BackendTypes.HISTORY_FETCHED
  }
}

export function sublocationsFetched() {
  return {
    type: BackendTypes.SUBLOCATIONS_FETCHED
  }
}

export function glitchesOptionsFetched() {
  return {
    type: BackendTypes.GLITCHES_OPTIONS_FETCHED
  }
}

export function roomsBackend() {
  return {
    type: BackendTypes.ROOMS_BACKEND
  }
}

export function calendarBackend() {
  return {
    type: BackendTypes.CALENDAR_BACKEND
  }
}

export function planningsBackend() {
  return {
    type: BackendTypes.PLANNINGS_BACKEND
  }
}

export function tasksBackend() {
  return {
    type: BackendTypes.TASKS_BACKEND
  }
}

export function historyBackend() {
  return {
    type: BackendTypes.HISTORY_BACKEND
  }
}

export function floorsBackend() {
  return {
    type: BackendTypes.FLOORS_BACKEND
  }
}

export function roomStatusesBackend() {
  return {
    type: BackendTypes.ROOM_STATUSES_BACKEND
  }
}

export function roomHousekeepingsBackend() {
  return {
    type: BackendTypes.ROOM_HOUSEKEEPINGS_BACKEND
  }
}

export function roomCategoriesBackend() {
  return {
    type: BackendTypes.ROOM_CATEGORIES_BACKEND
  }
}

export function roomNotesBackend() {
  return {
    type: BackendTypes.ROOM_NOTES_BACKEND
  }
}

export function catalogsBackend() {
  return {
    type: BackendTypes.CATALOGS_BACKEND
  }
}

export function usersBackend() {
  return {
    type: BackendTypes.USERS_BACKEND
  }
}

export function groupsBackend() {
  return {
    type: BackendTypes.GROUPS_BACKEND
  }
}

export function assetsBackend() {
  return {
    type: BackendTypes.ASSETS_BACKEND
  }
}

export function virtualAssetsBackend() {
  return {
    type: BackendTypes.VIRTUAL_ASSETS_BACKEND
  }
}

export function durableAssetsBackend() {
  return {
    type: BackendTypes.DURABLE_ASSETS_BACKEND
  }
}

export function roomAreasBackend() {
  return {
    type: BackendTypes.ROOM_AREAS_BACKEND
  }
}

export function customActionsBackend() {
  return {
    type: BackendTypes.CUSTOM_ACTIONS_BACKEND
  }
}

export function inventoryWithdrawalBackend() {
  return {
    type: BackendTypes.INVENTORY_WITHDRAWAL_BACKEND
  }
}

export function glitchesBackend() {
  return {
    type: BackendTypes.GLITCHES_BACKEND
  }
}

export function sublocationsBackend() {
  return {
    type: BackendTypes.SUBLOCATIONS_BACKEND
  }
}

export function glitchesOptionsBackend() {
  return {
    type: BackendTypes.GLITCHES_OPTIONS_BACKEND
  }
}

export default {
  reset,
  roomsFetched,
  floorsFetched,
  roomStatusesFetched,
  roomHousekeepingsFetched,
  roomCategoriesFetched,
  calendarFetched,
  planningsFetched,
  roomNotesFetched,
  catalogsFetched,
  tasksFetched,
  assetsFetched,
  virtualAssetsFetched,
  durableAssetsFetched,
  roomAreasFetched,
  customActionsFetched,
  assetRoomsFetched,
  assetRoomsBackend,
  inventoryWithdrawalFetched,
  usersFetched,
  groupsFetched,
  glitchesFetched,
  historyFetched,
  sublocationsFetched,
  glitchesOptionsFetched,
  roomsBackend,
  calendarBackend,
  planningsBackend,
  tasksBackend,
  historyBackend,
  floorsBackend,
  roomStatusesBackend,
  roomHousekeepingsBackend,
  roomCategoriesBackend,
  roomNotesBackend,
  catalogsBackend,
  usersBackend,
  groupsBackend,
  assetsBackend,
  virtualAssetsBackend,
  durableAssetsBackend,
  roomAreasBackend,
  customActionsBackend,
  inventoryWithdrawalBackend,
  glitchesBackend,
  sublocationsBackend,
  glitchesOptionsBackend
}
