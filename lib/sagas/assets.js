import { delay, take } from 'redux-saga';
import { takeLatest, put, call, select, fork } from 'redux-saga/effects';
import moment from 'moment';

import AssetsTypes from '../constants/assets';
import AssetsActions from '../actions/assets';
import BackendActions from '../actions/backend';

import request, { authRequest } from '../utils/request';
import { forkWatchers } from '../utils/sagas';

export default function({ apiUrl }) {
  const ASSETS_API = `/assets`;
  const VIRTUAL_ASSETS_API = `/virtual_assets`;
  const DURABLE_ASSETS_API = `/durable_assets`;
  const ASSET_ROOMS_API = `/asset_rooms?quantity=true`;
  const CUSTOM_ACTIONS_API = `/custom_actions`;
  const ROOM_AREAS_API = `/room_areas`;
  const SUBLOCATIONS_API = `/asset_sublocations`;
  const INVENTORY_WITHDRAWALS_API = `/hotel_inventory_activity/withdrawal?start_date`;

  // Hotel Assets
  function * fetchAssets() {
    return yield call(authRequest, ASSETS_API);
  }

  function * fetchAssetsFlow() {
    try {
      const { backend: { assets: { lastUpdate }}} = yield select();
      const data = yield call(fetchAssets);
      if (data.ts && lastUpdate > data.ts) {
        return true;
      }

      yield put(AssetsActions.assetsSuccess(data))
      yield put(BackendActions.assetsFetched());
    } catch (e) {
      // console.log(e);
    } finally {

    }
  }

  function * watchAssetsFlow(state) {
    yield takeLatest(AssetsTypes.ASSETS_FETCH, fetchAssetsFlow);
  }

  // Hotel Virtual Assets
  function * fetchVirtualAssets() {
    return yield call(authRequest, VIRTUAL_ASSETS_API);
  }

  function * fetchVirtualAssetsFlow() {
    try {
      const { backend: { virtualAssets: { lastUpdate }}} = yield select();
      const data = yield call(fetchVirtualAssets);
      if (data.ts && lastUpdate > data.ts) {
        return true;
      }

      yield put(AssetsActions.virtualAssetsSuccess(data))
      yield put(BackendActions.virtualAssetsFetched());
    } catch (e) {
      // console.log(e);
    } finally {

    }
  }

  function * watchVirtualAssetsFlow(state) {
    yield takeLatest(AssetsTypes.VIRTUAL_ASSETS_FETCH, fetchVirtualAssetsFlow);
  }

  // Hotel Durable Assets
  function * fetchDurableAssets() {
    return yield call(authRequest, DURABLE_ASSETS_API);
  }

  function * fetchDurableAssetsFlow() {
    try {
      const { backend: { durableAssets: { lastUpdate }}} = yield select();
      const data = yield call(fetchDurableAssets);
      if (data.ts && lastUpdate > data.ts) {
        return true;
      }

      yield put(AssetsActions.durableAssetsSuccess(data))
      yield put(BackendActions.durableAssetsFetched());
    } catch (e) {
      // console.log(e);
    } finally {

    }
  }

  function * watchDurableAssetsFlow(state) {
    yield takeLatest(AssetsTypes.DURABLE_ASSETS_FETCH, fetchDurableAssetsFlow);
  }

  // Hotel Sublocations
  function * fetchSublocations() {
    return yield call(authRequest, SUBLOCATIONS_API);
  }

  function * fetchSublocationsFlow() {
    try {
      const { backend: { sublocations: { lastUpdate }}} = yield select();
      const data = yield call(fetchSublocations);
      if (data.ts && lastUpdate > data.ts) {
        return true;
      }

      yield put(AssetsActions.sublocationsSuccess(data))
      yield put(BackendActions.sublocationsFetched());
    } catch (e) {
      // console.log(e);
    } finally {

    }
  }

  function * watchSublocationsFlow(state) {
    yield takeLatest(AssetsTypes.SUBLOCATIONS_FETCH, fetchSublocationsFlow);
  }

  function * fetchAssetRooms() {
    return yield call(authRequest, ASSET_ROOMS_API);
  }

  function * fetchAssetRoomsFlow() {
    try {
      const { backend: { assetRooms: { lastUpdate }}} = yield select();
      const data = yield call(fetchAssetRooms);
      if (data.ts && lastUpdate > data.ts) {
        return true;
      }

      yield put(AssetsActions.assetRoomsSuccess(data));
      yield put(BackendActions.assetRoomsFetched());
    } catch (e) {
      // console.log(e);
    } finally {

    }
  }

  function * watchAssetRoomsFlow(state) {
    yield takeLatest(AssetsTypes.ASSET_ROOMS_FETCH, fetchAssetRoomsFlow);
  }

  // Hotel Custom Actions
  function * fetchCustomActions() {
    return yield call(authRequest, CUSTOM_ACTIONS_API);
  }

  function * fetchCustomActionsFlow() {

    try {
      const { backend: { customActions: { lastUpdate }}} = yield select();
      const data = yield call(fetchCustomActions);
      if (data.ts && lastUpdate > data.ts) {
        return true;
      }

      yield put(AssetsActions.customActionsSuccess(data))
      yield put(BackendActions.customActionsFetched());
    } catch (e) {
      // console.log(e);
    } finally {

    }
  }

  function * watchCustomActionsFlow(state) {
    yield takeLatest(AssetsTypes.CUSTOM_ACTIONS_FETCH, fetchCustomActionsFlow);
  }

  // Hotel Room Areas
  function * fetchRoomAreas() {
    return yield call(authRequest, ROOM_AREAS_API);
  }

  function * fetchRoomAreasFlow() {

    try {
      const { backend: { roomAreas: { lastUpdate }}} = yield select();
      const data = yield call(fetchRoomAreas);
      if (data.ts && lastUpdate > data.ts) {
        return true;
      }

      yield put(AssetsActions.roomAreasSuccess(data))
      yield put(BackendActions.roomAreasFetched());
    } catch (e) {
      // console.log(e);
    } finally {

    }
  }

  function * watchRoomAreasFlow(state) {
    yield takeLatest(AssetsTypes.ROOM_AREAS_FETCH, fetchRoomAreasFlow);
  }

  // Hotel Inventory Withdrawals
  function * fetchInventoryWithdrawals() {
    const today = moment().format('YYYY-MM-DD');
    const getUrl = `${INVENTORY_WITHDRAWALS_API}=${today}`;

    return yield call(authRequest, getUrl);
  }

  function * fetchInventoryWithdrawalsFlow() {

    try {
      const { backend: { inventoryWithdrawal: { lastUpdate }}} = yield select();
      const data = yield call(fetchInventoryWithdrawals);
      if (data.ts && lastUpdate > data.ts) {
        return true;
      }

      yield put(AssetsActions.inventoryWithdrawalSuccess(data))
      yield put(BackendActions.inventoryWithdrawalFetched());
    } catch (e) {
      // console.log(e);
    } finally {

    }
  }

  function * watchInventoryWithdrawalsFlow(state) {
    yield takeLatest(AssetsTypes.INVENTORY_WITHDRAWAL_FETCH, fetchInventoryWithdrawalsFlow);
  }

  const watchers = {
    watchAssetsFlow,
    watchVirtualAssetsFlow,
    watchDurableAssetsFlow,
    watchSublocationsFlow,
    watchAssetRoomsFlow,
    watchCustomActionsFlow,
    watchRoomAreasFlow,
    watchInventoryWithdrawalsFlow
  }

  const root = forkWatchers(watchers);

  return {
    root,
    watchers,
    sagas: {
      fetchAssets,
      fetchAssetsFlow,
      fetchVirtualAssets,
      fetchVirtualAssetsFlow,
      fetchDurableAssets,
      fetchDurableAssetsFlow,
      fetchSublocations,
      fetchSublocationsFlow,
      fetchAssetRooms,
      fetchAssetRoomsFlow,
      fetchCustomActions,
      fetchCustomActionsFlow,
      fetchRoomAreas,
      fetchRoomAreasFlow,
      fetchInventoryWithdrawals,
      fetchInventoryWithdrawalsFlow
    }
  }
}
