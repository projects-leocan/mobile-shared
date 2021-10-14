import { delay, take } from 'redux-saga';
import { takeLatest, throttle, put, call, select } from 'redux-saga/effects';
import moment from 'moment';

import BackendTypes from '../constants/backend';
import { Types as NetworkTypes } from '../network';
import RoomsActions from '../actions/rooms';
import UsersActions from '../actions/users';
import AssetsActions from '../actions/assets';
import GlitchesActions from '../actions/glitches';
import BackendActions from '../actions/backend';

import { forkWatchers } from '../utils/sagas';

const STALE_TIME = 5 * 60;
const LONG_STALE_TIME = 60 * 60 * 8;

const backendFactory = (backendField, fetcher, timer) => {
  return function* () {
    const { auth: { hotelId, token }, backend: { [backendField]: field } } = yield select();
    const currentTs = moment().unix();

    try {
      if (!field.lastUpdate || currentTs - field.lastUpdate > timer) {
        yield put(fetcher());
      }
    } catch (e) {
      console.log(e);
    }
  }
}


export default function({ apiUrl, userType }) {

  // Online
  function * onlineFlow({ isOnline }) {
    if (!isOnline) {
      return true;
    }

    const { auth: { hotelId, token }, backend: { rooms } } = yield select();

    if (!hotelId || !token) {
      return true;
    }

    yield delay(3000);
    yield put(BackendActions.tasksBackend())
    yield put(BackendActions.roomsBackend())
    yield put(BackendActions.calendarBackend())
    yield put(BackendActions.planningsBackend())

    if (userType === 'inspector') {
      yield put(BackendActions.historyBackend())
    }
  }

  function * watchOnlineFlow() {
    yield throttle(3000, NetworkTypes.NETWORK_STATUS, onlineFlow)
  }

  // Hotel Rooms
  function * backendRoomsFlow() {
    const { auth: { hotelId, token }, backend: { rooms } } = yield select();
    const currentTs = moment().unix();

    try {
      if (!rooms.lastUpdate || currentTs - rooms.lastUpdate > STALE_TIME) {
        yield put(RoomsActions.roomsFetch());
      }
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  function * watchBackendRoomsFlow() {
    yield takeLatest(BackendTypes.ROOMS_BACKEND, backendRoomsFlow);
  }

  // Hotel Calendar
  function * backendCalendarFlow() {
    const { auth: { hotelId, token }, backend: { calendar } } = yield select();
    const currentTs = moment().unix();

    try {
      if (!calendar.lastUpdate || currentTs - calendar.lastUpdate > STALE_TIME) {
        yield put(RoomsActions.calendarFetch());
      }
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  function * watchBackendCalendarFlow() {
    yield takeLatest(BackendTypes.CALENDAR_BACKEND, backendCalendarFlow);
  }

  // Hotel Plannings
  function * backendPlanningsFlow() {
    const { auth: { hotelId, token }, backend: { plannings } } = yield select();
    const currentTs = moment().unix();

    try {
      if (!plannings.lastUpdate || currentTs - plannings.lastUpdate > STALE_TIME) {
        yield put(RoomsActions.planningsFetch());
      }
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  function * watchBackendPlanningsFlow() {
    yield takeLatest(BackendTypes.PLANNINGS_BACKEND, backendPlanningsFlow);
  }

  // Hotel Tasks
  function * backendTasksFlow() {
    const { auth: { hotelId, token }, backend: { tasks } } = yield select();
    const currentTs = moment().unix();

    try {
      if (!tasks.lastUpdate || currentTs - tasks.lastUpdate > STALE_TIME) {
        yield put(RoomsActions.tasksFetch());
      }
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  function * watchBackendTasksFlow() {
    yield takeLatest(BackendTypes.TASKS_BACKEND, backendTasksFlow);
  }

  // Hotel History
  function * backendHistoryFlow() {
    const { auth: { hotelId, token }, backend: { history } } = yield select();
    const currentTs = moment().unix();

    try {
      if (!history.lastUpdate || currentTs - history.lastUpdate > STALE_TIME) {
        yield put(RoomsActions.historyFetch());
      }
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  function * watchBackendHistoryFlow() {
    yield takeLatest(BackendTypes.HISTORY_BACKEND, backendHistoryFlow);
  }

  const backendInventoryWithdrawalFlow = backendFactory('inventoryWithdrawal', AssetsActions.inventoryWithdrawalFetch, STALE_TIME);
  function * watchBackendInventoryWithdrawalFlow() {
    yield takeLatest(BackendTypes.INVENTORY_WITHDRAWAL_BACKEND, backendInventoryWithdrawalFlow)
  }

  const backendGlitchesFlow = backendFactory('glitches', GlitchesActions.glitchesFetch, STALE_TIME);
  function * watchBackendGlitchesFlow() {
    yield takeLatest(BackendTypes.GLITCHES_BACKEND, backendGlitchesFlow)
  }

  const backendFloorsFlow = backendFactory('floors', RoomsActions.floorsFetch, LONG_STALE_TIME);
  function * watchBackendFloorsFlow() {
    yield takeLatest(BackendTypes.FLOORS_BACKEND, backendFloorsFlow)
  }

  const backendRoomStatusesFlow = backendFactory('roomStatuses', RoomsActions.roomStatusesFetch, LONG_STALE_TIME);
  function * watchBackendRoomStatusesFlow() {
    yield takeLatest(BackendTypes.ROOM_STATUSES_BACKEND, backendRoomStatusesFlow)
  }

  const backendRoomHousekeepingsFlow = backendFactory('roomHousekeepings', RoomsActions.roomHousekeepingsFetch, LONG_STALE_TIME);
  function * watchBackendRoomHousekeepingsFlow() {
    yield takeLatest(BackendTypes.ROOM_HOUSEKEEPINGS_BACKEND, backendRoomHousekeepingsFlow)
  }

  const backendRoomCategoriesFlow = backendFactory('roomCategories', RoomsActions.roomCategoriesFetch, LONG_STALE_TIME);
  function * watchBackendRoomCategoriesFlow() {
    yield takeLatest(BackendTypes.ROOM_CATEGORIES_BACKEND, backendRoomCategoriesFlow)
  }

  const backendRoomNotesFlow = backendFactory('roomNotes', RoomsActions.roomNotesFetch, LONG_STALE_TIME);
  function * watchBackendRoomNotesFlow() {
    yield takeLatest(BackendTypes.ROOM_NOTES_BACKEND, backendRoomNotesFlow)
  }

  const backendCatalogsFlow = backendFactory('catalogs', RoomsActions.catalogsFetch, LONG_STALE_TIME);
  function * watchBackendCatalogsFlow() {
    yield takeLatest(BackendTypes.CATALOGS_BACKEND, backendCatalogsFlow)
  }

  const backendUsersFlow = backendFactory('users', UsersActions.usersFetch, LONG_STALE_TIME);
  function * watchBackendUsersFlow() {
    yield takeLatest(BackendTypes.USERS_BACKEND, backendUsersFlow)
  }

  const backendGroupsFlow = backendFactory('groups', UsersActions.groupsFetch, LONG_STALE_TIME);
  function * watchBackendGroupsFlow() {
    yield takeLatest(BackendTypes.GROUPS_BACKEND, backendGroupsFlow)
  }

  const backendAssetsFlow = backendFactory('assets', AssetsActions.assetsFetch, LONG_STALE_TIME);
  function * watchBackendAssetsFlow() {
    yield takeLatest(BackendTypes.ASSETS_BACKEND, backendAssetsFlow)
  }

  const backendVirtualAssetsFlow = backendFactory('virtualAssets', AssetsActions.virtualAssetsFetch, LONG_STALE_TIME);
  function * watchBackendVirtualAssetsFlow() {
    yield takeLatest(BackendTypes.VIRTUAL_ASSETS_BACKEND, backendVirtualAssetsFlow)
  }

  const backendDurableAssetsFlow = backendFactory('durableAssets', AssetsActions.durableAssetsFetch, LONG_STALE_TIME);
  function * watchBackendDurableAssetsFlow() {
    yield takeLatest(BackendTypes.DURABLE_ASSETS_BACKEND, backendDurableAssetsFlow)
  }

  const backendRoomAreasFlow = backendFactory('roomAreas', AssetsActions.roomAreasFetch, LONG_STALE_TIME);
  function * watchBackendRoomAreasFlow() {
    yield takeLatest(BackendTypes.ROOM_AREAS_BACKEND, backendRoomAreasFlow)
  }

  const backendAssetRoomsFlow = backendFactory('assetRooms', AssetsActions.assetRoomsFetch, LONG_STALE_TIME);
  function * watchBackendAssetRoomsFlow() {
    yield takeLatest(BackendTypes.ASSET_ROOMS_BACKEND, backendAssetRoomsFlow)
  }

  const backendCustomActionsFlow = backendFactory('customActions', AssetsActions.customActionsFetch, LONG_STALE_TIME);
  function * watchBackendCustomActionsFlow() {
    yield takeLatest(BackendTypes.CUSTOM_ACTIONS_BACKEND, backendCustomActionsFlow)
  }

  const backendSublocationsFlow = backendFactory('sublocations', AssetsActions.sublocationsFetch, LONG_STALE_TIME);
  function * watchBackendSublocationsFlow() {
    yield takeLatest(BackendTypes.SUBLOCATIONS_BACKEND, backendSublocationsFlow)
  }

  const backendGlitchesOptionsFlow = backendFactory('glitchesOptions', GlitchesActions.glitchesOptionsFetch, LONG_STALE_TIME);
  function * watchBackendGlitchesOptionsFlow() {
    yield takeLatest(BackendTypes.GLITCHES_OPTIONS_BACKEND, backendGlitchesOptionsFlow)
  }


  const watchers = {
    watchOnlineFlow,
    watchBackendRoomsFlow,
    watchBackendCalendarFlow,
    watchBackendPlanningsFlow,
    watchBackendTasksFlow,
    watchBackendHistoryFlow,
    watchBackendInventoryWithdrawalFlow,
    watchBackendGlitchesFlow,
    watchBackendFloorsFlow,
    watchBackendRoomStatusesFlow,
    watchBackendRoomHousekeepingsFlow,
    watchBackendRoomCategoriesFlow,
    watchBackendRoomNotesFlow,
    watchBackendCatalogsFlow,
    watchBackendUsersFlow,
    watchBackendGroupsFlow,
    watchBackendAssetsFlow,
    watchBackendVirtualAssetsFlow,
    watchBackendDurableAssetsFlow,
    watchBackendRoomAreasFlow,
    watchBackendAssetRoomsFlow,
    watchBackendCustomActionsFlow,
    watchBackendSublocationsFlow,
    watchBackendGlitchesOptionsFlow
  };

  const root = forkWatchers(watchers);

  return {
    root,
    watchers,
    sagas: {
      onlineFlow,
      backendRoomsFlow,
      backendCalendarFlow,
      backendPlanningsFlow,
      backendTasksFlow,
      backendHistoryFlow,
      backendInventoryWithdrawalFlow,
      backendGlitchesFlow,
      backendFloorsFlow,
      backendRoomStatusesFlow,
      backendRoomHousekeepingsFlow,
      backendRoomCategoriesFlow,
      backendRoomNotesFlow,
      backendCatalogsFlow,
      backendUsersFlow,
      backendGroupsFlow,
      backendAssetsFlow,
      backendVirtualAssetsFlow,
      backendDurableAssetsFlow,
      backendRoomAreasFlow,
      backendAssetRoomsFlow,
      backendCustomActionsFlow,
      backendSublocationsFlow,
      backendGlitchesOptionsFlow
    }
  }
}
