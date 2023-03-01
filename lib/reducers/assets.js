import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import AssetsTypes from '../constants/assets';

// export const INITIAL_STATE = Immutable({
//   hotelAssets: [],
//   hotelVirtualAssets: [],
//   hotelDurableAssets: [],
//   hotelAssetRooms: [],
//   hotelCustomActions: [],
//   hotelRoomAreas: [],
//   hotelInventoryWithdrawals: [],
//   hotelSublocations: []
// });

const getInitialState = () => ({
  hotelAssets: [],
  hotelVirtualAssets: [],
  hotelDurableAssets: [],
  hotelAssetRooms: [],
  hotelCustomActions: [],
  hotelRoomAreas: [],
  hotelInventoryWithdrawals: [],
  hotelSublocations: [],
  hotelAllCustomActionData: []
})

const ACTION_HANDLERS = {
  [AssetsTypes.ASSETS_RESET]: (state) => {
    return getInitialState();
  },
  [AssetsTypes.ASSETS_SUCCESS]: (state, { assets }) => {
    return {
      ...state,
      hotelAssets: assets
    }
  },
  [AssetsTypes.VIRTUAL_ASSETS_SUCCESS]: (state, { virtualAssets }) => {
    return {
      ...state,
      hotelVirtualAssets: virtualAssets
    }
  },
  [AssetsTypes.DURABLE_ASSETS_SUCCESS]: (state, { durableAssets }) => {
    return {
      ...state,
      hotelDurableAssets: durableAssets
    }
  },
  [AssetsTypes.SUBLOCATIONS_SUCCESS]: (state, { assetSublocations }) => {
    // return state.set('hotelSublocations', assetSublocations);
    return {
      ...state,
      hotelSublocations: assetSublocations
    }
  },
  [AssetsTypes.ASSET_ROOMS_SUCCESS]: (state, { assetsroom }) => {
    // return state.set('hotelAssetRooms', assetRooms);
    return {
      ...state,
      hotelAssetRooms: assetsroom
    }
  },
  [AssetsTypes.CUSTOM_ACTIONS_SUCCESS]: (state, { customActions, userHotelId }) => {
    // return state.set('hotelCustomActions', customActions);
    const filterHotelData = customActions.filter((data) => {
      return (
        data.hotelId === userHotelId
      )
    })
    return {
      ...state,
      hotelAllCustomActionData: customActions,
      hotelCustomActions: filterHotelData
    }
  },
  [AssetsTypes.FILTER_ASSET_ACTION_HOTEL_CHANGE]: (state, { hotelId }) => {
    const filterHotelData = state.hotelAllCustomActionData.filter((data) => {
      return (
        data.hotelId === hotelId
      )
    })
    return {
      ...state,
      hotelCustomActions: filterHotelData
    }
  },
  [AssetsTypes.ROOM_AREAS_SUCCESS]: (state, { roomAreas }) => {
    // return state.set('hotelRoomAreas', roomAreas);
    return {
      ...state,
      hotelRoomAreas: roomAreas
    }
  },
  [AssetsTypes.INVENTORY_WITHDRAWAL_SUCCESS]: (state, { results }) => {
    // return state.set('hotelInventoryWithdrawals', results);
    return {
      ...state,
      hotelInventoryWithdrawals: results
    }
  }
}

export default createReducer(getInitialState(), ACTION_HANDLERS);
