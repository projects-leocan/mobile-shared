import AssetsTypes from '../constants/assets';

export function resetAssets() {
  return {
    type: AssetsTypes.ASSETS_RESET
  }
}

export function assetsFetch() {
  return {
    type: AssetsTypes.ASSETS_FETCH
  }
}

export function assetsSuccess(assets) {
  return {
    type: AssetsTypes.ASSETS_SUCCESS,
    assets
  }
}

export function virtualAssetsFetch() {
  return {
    type: AssetsTypes.VIRTUAL_ASSETS_FETCH
  }
}

export function virtualAssetsSuccess({ virtualAssets }) {
  return {
    type: AssetsTypes.VIRTUAL_ASSETS_SUCCESS,
    virtualAssets
  }
}

export function durableAssetsFetch() {
  return {
    type: AssetsTypes.DURABLE_ASSETS_FETCH
  }
}

export function durableAssetsSuccess({ durableAssets }) {
  return {
    type: AssetsTypes.DURABLE_ASSETS_SUCCESS,
    durableAssets
  }
}

export function sublocationsFetch() {
  return {
    type: AssetsTypes.SUBLOCATIONS_FETCH
  }
}

export function sublocationsSuccess({ assetSublocations }) {
  return {
    type: AssetsTypes.SUBLOCATIONS_SUCCESS,
    assetSublocations
  }
}

export function assetRoomsFetch() {
  return {
    type: AssetsTypes.ASSET_ROOMS_FETCH
  }
}

export function assetRoomsSuccess({ assetsroom }) {
  return {
    type: AssetsTypes.ASSET_ROOMS_SUCCESS,
    assetsroom
  }
}

export function customActionsFetch() {
  return {
    type: AssetsTypes.CUSTOM_ACTIONS_FETCH
  }
}

export function customActionsSuccess(customActions , userHotelId) {
  return {
    type: AssetsTypes.CUSTOM_ACTIONS_SUCCESS,
    customActions,
    userHotelId
  }
}

export function roomAreasFetch() {
  return {
    type: AssetsTypes.ROOM_AREAS_FETCH
  }
}

export function roomAreasSuccess({ roomAreas }) {
  return {
    type: AssetsTypes.ROOM_AREAS_SUCCESS,
    roomAreas
  }
}

export function inventoryWithdrawalFetch() {
  return {
    type: AssetsTypes.INVENTORY_WITHDRAWAL_FETCH
  }
}

export function inventoryWithdrawalSuccess({ results }) {
  return {
    type: AssetsTypes.INVENTORY_WITHDRAWAL_SUCCESS,
    results
  }
}

export function filterAssetActionOnHotelChange(hotelId) {
  return {
    type: AssetsTypes.FILTER_ASSET_ACTION_HOTEL_CHANGE,
    hotelId
  }
}

export default {
  resetAssets,
  assetsFetch,
  assetsSuccess,
  virtualAssetsFetch,
  virtualAssetsSuccess,
  durableAssetsFetch,
  durableAssetsSuccess,
  sublocationsFetch,
  sublocationsSuccess,
  assetRoomsFetch,
  assetRoomsSuccess,
  customActionsFetch,
  customActionsSuccess,
  roomAreasFetch,
  roomAreasSuccess,
  inventoryWithdrawalFetch,
  inventoryWithdrawalSuccess,
  filterAssetActionOnHotelChange
}
