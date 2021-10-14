import { delay, take } from 'redux-saga';
import { takeLatest, throttle, put, call, select, fork } from 'redux-saga/effects';
import { get } from 'lodash/object';
import moment from 'moment';

import RoomsTypes from '../constants/rooms';
import RoomsActions from '../actions/rooms';
import BackendActions from '../actions/backend';
import DifferencesActions from '../actions/differences';

import request, { authRequest } from '../utils/request';
import { forkWatchers } from '../utils/sagas';
import { offlineable } from '../offline';

import { planningsForUser, attendantRooms, planningsSelector, roomsSelector } from '../selectors/rooms';
import { findUpdates as findPlanningUpdates } from '../utils/plannings';
import { findUpdates as findRoomUpdates } from '../utils/rooms';
import { cleanRooms } from '../utils/models/rooms';
import {
  rooms as roomDifferences,
  plannings as planningDifferences,
  calendar as calendarDifferences
} from '../utils/differences';

export default function({ apiUrl, userType }) {
  const ROOMS_API = `/rooms`;
  const FLOORS_API = `/floors`;
  const ROOM_STATUSES_API = `/room_statuses`;
  const ROOM_HOUSEKEEPINGS_API = `/room_housekeepings`;
  const ROOM_CATEGORIES_API = `/room_categories`;
  const PLANNINGS_API = `/attendant_plannings`;
  const PLANNINGS_NIGHT_API = `/attendant_planning_nights`;
  const PLANNINGS_RUNNER_API = `/runner_plannings`;
  const CALENDAR_API = `/calendar`;
  const ROOM_NOTES_API = `/room_notes`;
  const CATALOGS_API = `/catalog_by_hotel`;
  const TASKS_API = `/tasks`;
  const HISTORY_API = `/hotel_history`;
  const GUEST_BOOK_API = `/guest_book`;
  const PLANNING_HOSTS_IN_API = `/host_plannings_in`;
  const PLANNING_HOSTS_OUT_API = `/host_plannings_out`;
  const LOST_ITEMS_API = `/lost_found/losts`;
  const FOUND_ITEMS_API = `/lost_found/founds`;

  const isInspector = userType === 'inspector';
  const isRunner = userType === 'runner';
  const isMaintenance = userType === 'maintenance';
  const isAttendant = userType === 'attendant';

  // Hotel Rooms
  function * fetchRooms() {
    return yield call(authRequest, ROOMS_API);
  }

  function * fetchRoomsFlow() {
    // console.log('CALLING FETCH ROOMS', moment().format('mm:ss'));

    try {
      const { backend: { rooms: { lastUpdate }}, auth: { config }} = yield select();
      const data = yield call(fetchRooms);
      if (data.ts && lastUpdate > data.ts) {
        return true;
      }
      
      const cleaned = cleanRooms(data.rooms);
      let updates;

      const old = userType === 'attendant' ?
        yield select(attendantRooms) :
        yield select(roomsSelector);

      if (isAttendant) {
        updates = findRoomUpdates(old, cleaned);
      }
      if (isInspector) {
        updates = roomDifferences(old, cleaned);
      }

      yield put(RoomsActions.roomsSuccess({ rooms: cleaned }));
      yield put(BackendActions.roomsFetched());

      if (isAttendant && updates) {
        yield put(RoomsActions.roomsUpdates(updates));
      }

      if (isInspector) {
        const isDisableMessagesDifferences = get(config, 'isDisableMessagesDifferences') || false;
        const isDisableUnblocksDifferences = get(config, 'isDisableUnblocksDifferences') || false;
        const isDisableRestocksDifferences = get(config, 'isDisableRestocksDifferences') || false;

        if (updates && get(updates, 'messages') && !isDisableMessagesDifferences) {
          yield put(DifferencesActions.roomMessageDifference(updates.messages));
        }
        if (updates && get(updates, 'unblocks') && !isDisableUnblocksDifferences) {
          yield put(DifferencesActions.roomUnblockDifference(updates.unblocks));
        }
        if (updates && get(updates, 'restocks') && !isDisableRestocksDifferences) {
          yield put(DifferencesActions.roomRestockDifference(updates.restocks));
        }
      }

      yield put(RoomsActions.updateRoomsIncrement('rooms'));
    } catch (e) {
      
      console.log('rooms failure', e);
      // yield put(RoomsActions.roomsFailure(e));
    } finally {

    }
  }

  function * watchRoomsFlow(state) {
    // yield takeLatest(RoomsTypes.ROOMS_FETCH, fetchRoomsFlow);
    yield throttle(10000, RoomsTypes.ROOMS_FETCH, fetchRoomsFlow);
  }

  // Hotel Floors
  function * fetchFloors() {
    return yield call(authRequest, FLOORS_API);
  }

  function * fetchFloorsFlow() {
    try {
      const { backend: { floors: { lastUpdate }}} = yield select();
      const data = yield call(fetchFloors);
      if (data.ts && lastUpdate > data.ts) {
        return true;
      }

      yield put(RoomsActions.floorsSuccess(data))
      yield put(BackendActions.floorsFetched());
      yield put(RoomsActions.updateRoomsIncrement('floors'));
    } catch (e) {
      console.log(e);
      yield put(RoomsActions.floorsFailure(e))
    } finally {

    }
  }

  function * watchFloorsFlow(state) {
    yield takeLatest(RoomsTypes.FLOORS_FETCH, fetchFloorsFlow);
  }

  // Hotel Room Status
  function * fetchRoomStatuses() {
    return yield call(authRequest, ROOM_STATUSES_API);
  }

  function * fetchRoomStatusesFlow() {
    try {
      const { backend: { roomStatuses: { lastUpdate }}} = yield select();
      const data = yield call(fetchRoomStatuses);
      if (data.ts && lastUpdate > data.ts) {
        return true;
      }

      yield put(RoomsActions.roomStatusesSuccess(data))
      yield put(BackendActions.roomStatusesFetched());
      yield put(RoomsActions.updateRoomsIncrement('roomStatus'));
    } catch (e) {
      console.log(e);
      yield put(RoomsActions.roomStatusesFailure(e))
    } finally {

    }
  }

  function * watchRoomStatusesFlow(state) {
    yield takeLatest(RoomsTypes.ROOM_STATUSES_FETCH, fetchRoomStatusesFlow);
  }

  // Hotel Room Housekeepings
  function * fetchRoomHousekeepings() {
    return yield call(authRequest, ROOM_HOUSEKEEPINGS_API);
  }

  function * fetchRoomHousekeepingsFlow() {
    try {
      const { backend: { roomHousekeepings: { lastUpdate }}} = yield select();
      const data = yield call(fetchRoomHousekeepings);
      if (data.ts && lastUpdate > data.ts) {
        return true;
      }

      yield put(RoomsActions.roomHousekeepingsSuccess(data))
      yield put(BackendActions.roomHousekeepingsFetched());
      yield put(RoomsActions.updateRoomsIncrement('roomHousekeepings'));
    } catch (e) {
      console.log(e);
      yield put(RoomsActions.roomHousekeepingsFailure(e))
    } finally {

    }
  }

  function * watchRoomHousekeepingsFlow(state) {
    yield takeLatest(RoomsTypes.ROOM_HOUSEKEEPINGS_FETCH, fetchRoomHousekeepingsFlow);
  }

  // Hotel Room Categories
  function * fetchRoomCategories() {
    return yield call(authRequest, ROOM_CATEGORIES_API);
  }

  function * fetchRoomCategoriesFlow() {
    try {
      const { backend: { roomCategories: { lastUpdate }}} = yield select();
      const data = yield call(fetchRoomCategories);
      if (data.ts && lastUpdate > data.ts) {
        return true;
      }

      yield put(RoomsActions.roomCategoriesSuccess(data));
      yield put(BackendActions.roomCategoriesFetched());
      yield put(RoomsActions.updateRoomsIncrement('roomCategories'));
    } catch(e) {
      console.log(e)
      yield put(RoomsActions.roomCategoriesFailure(e));
    } finally {

    }
  }

  function * watchRoomCategoriesFlow(state) {
    yield takeLatest(RoomsTypes.ROOM_CATEGORY_FETCH, fetchRoomCategoriesFlow);
  }

  // Hotel Plannings
  function * fetchPlannings() {
    return yield call(authRequest, PLANNINGS_API);
  }

  function * fetchPlanningsFlow() {
    try {
      const { backend: { plannings: { lastUpdate }}, auth: { config }} = yield select();
      const data = yield call(fetchPlannings);
      if (data.ts && lastUpdate > data.ts) {
        return true;
      }

      let updates;

      const previous = isAttendant ?
        yield select(planningsForUser) :
        yield select(planningsSelector);

      if (isAttendant) {
        updates = findPlanningUpdates(previous, data.plannings);
      }
      if (isInspector) {
        updates = planningDifferences(previous, data.plannings);
      }

      yield put(RoomsActions.planningsSuccess(data))
      yield put(BackendActions.planningsFetched());

      if (isAttendant && updates) {
        yield put(RoomsActions.planningsUpdates(updates));
      }
      if (isInspector) {
        const isDisablePriorityDifferences = get(config, 'isDisablePriorityDifferences') || false;
        
        if (updates && get(updates, 'priorities') && !isDisablePriorityDifferences) {
          yield put(DifferencesActions.planningPriorityDifference(updates.priorities));
        }
      }

      yield put(RoomsActions.updateRoomsIncrement('plannings'));
    } catch (e) {
      console.log(e);
      yield put(RoomsActions.planningsFailure(e))
    } finally {

    }
  }

  function * watchPlanningsFlow(state) {
    // yield takeLatest(RoomsTypes.PLANNINGS_FETCH, fetchPlanningsFlow);
    yield throttle(3000, RoomsTypes.PLANNINGS_FETCH, fetchPlanningsFlow);
  }

  // Hotel Plannings Night
  function * fetchPlanningsNight() {
    return yield call(authRequest, PLANNINGS_NIGHT_API);
  }

  function * fetchPlanningsNightFlow() {
    try {
      const data = yield call(fetchPlanningsNight);

      yield put(RoomsActions.planningsNightSuccess(data))
      yield put(RoomsActions.updateRoomsIncrement('planningsNight'));
    } catch (e) {
      console.log(e);
      yield put(RoomsActions.planningsNightFailure(e))
    } finally {

    }
  }

  function * watchPlanningsNightFlow(state) {
    // yield takeLatest(RoomsTypes.PLANNINGS_NIGHT_FETCH, fetchPlanningsNightFlow);
    yield throttle(3000, RoomsTypes.PLANNINGS_NIGHT_FETCH, fetchPlanningsNightFlow);
  }

  // Hotel Plannings Runner
  function * fetchPlanningsRunner() {
    return yield call(authRequest, PLANNINGS_RUNNER_API);
  }

  function * fetchPlanningsRunnerFlow() {
    try {
      const data = yield call(fetchPlanningsRunner);
      yield put(RoomsActions.planningsRunnerSuccess(data))
      yield put(RoomsActions.updateRoomsIncrement('planningsRunner'));
    } catch (e) {
      console.log(e);
      yield put(RoomsActions.planningsRunnerFailure(e))
    } finally {

    }
  }

  function * watchPlanningsRunnerFlow(state) {
    yield takeLatest(RoomsTypes.PLANNINGS_RUNNER_FETCH, fetchPlanningsRunnerFlow);
  }

  // Hotel Calender
  function * fetchCalendar() {
    return yield call(authRequest, CALENDAR_API);
  }

  function * fetchCalendarFlow() {
    try {
      const { backend: { calendar: { lastUpdate }}} = yield select();
      const data = yield call(fetchCalendar);
      if (data.ts && lastUpdate > data.ts) {
        return true;
      }

      yield put(RoomsActions.calendarSuccess(data));
      yield put(BackendActions.calendarFetched());
      yield put(RoomsActions.updateRoomsIncrement('calendar'));
    } catch (e) {
      console.log(e);
      yield put(RoomsActions.calendarFailure(e));
    } finally {

    }
  }

  function * watchCalendarFlow(state) {
    // yield takeLatest(RoomsTypes.CALENDAR_FETCH, fetchCalendarFlow);
    yield throttle(3000, RoomsTypes.CALENDAR_FETCH, fetchCalendarFlow);
  }

  // Hotel Room Notes
  function * fetchRoomNotes() {
    return yield call(authRequest, ROOM_NOTES_API);
  }

  function * fetchRoomNotesFlow() {
    try {
      const { backend: { roomNotes: { lastUpdate }}} = yield select();
      const data = yield call(fetchRoomNotes);
      if (data.ts && lastUpdate > data.ts) {
        return true;
      }

      yield put(RoomsActions.roomNotesSuccess(data));
      yield put(BackendActions.roomNotesFetched());
      yield put(RoomsActions.updateRoomsIncrement('roomNotes'));
    } catch (e) {
      console.log('ROOM NOTES ERR',e);
      yield put(RoomsActions.roomNotesFailure(e));
    } finally {

    }
  }

  function * watchRoomNotesFlow(state) {
    // yield takeLatest(RoomsTypes.ROOM_NOTES_FETCH, fetchRoomNotesFlow);
    yield throttle(3000, RoomsTypes.ROOM_NOTES_FETCH, fetchRoomNotesFlow);
  }

  // Hotel Catalogs
  function * fetchCatalogs() {
    return yield call(authRequest, CATALOGS_API);
  }

  function * fetchCatalogsFlow() {
    try {
      const { backend: { catalogs: { lastUpdate }}} = yield select();
      const data = yield call(fetchCatalogs);
      if (data.ts && lastUpdate > data.ts) {
        return true;
      }

      yield put(RoomsActions.catalogsSuccess(data))
      yield put(BackendActions.catalogsFetched());
    } catch (e) {
      console.log(e);
      yield put(RoomsActions.catalogsFailure(e))
    } finally {

    }
  }

  function * watchCatalogsFlow(state) {
    yield takeLatest(RoomsTypes.CATALOGS_FETCH, fetchCatalogsFlow);
  }

  // Hotel Lost Items
  function * fetchLostItems() {
    return yield call(authRequest, LOST_ITEMS_API);
  }

  function * fetchLostItemsFlow() {
    try {
      // const { backend: { catalogs: { lastUpdate }}} = yield select();
      const data = yield call(fetchLostItems);
      // if (data.ts && lastUpdate > data.ts) {
      //   return true;
      // }

      yield put(RoomsActions.lostFetchSuccess(data))
      // yield put(BackendActions.catalogsFetched());
    } catch (e) {
      console.log(e);
      yield put(RoomsActions.lostFetchFailure(e))
    } finally {

    }
  }

  function * watchLostItemsFlow(state) {
    yield takeLatest(RoomsTypes.LOST_FETCH, fetchLostItemsFlow);
  }

  // Hotel Found Items
  function * fetchFoundItems() {
    return yield call(authRequest, FOUND_ITEMS_API);
  }

  function * fetchFoundItemsFlow() {
    try {
      // const { backend: { catalogs: { lastUpdate }}} = yield select();
      const data = yield call(fetchFoundItems);
      // if (data.ts && lastUpdate > data.ts) {
      //   return true;
      // }

      yield put(RoomsActions.foundFetchSuccess(data))
      // yield put(BackendActions.catalogsFetched());
    } catch (e) {
      console.log(e);
      yield put(RoomsActions.foundFetchFailure(e))
    } finally {
      
    }
  }

  function * watchFoundItemsFlow(state) {
    yield takeLatest(RoomsTypes.FOUND_FETCH, fetchFoundItemsFlow);
  }

  // Hotel Tasks
  function * fetchTasks() {
    return yield call(authRequest, TASKS_API);
  }

  function * fetchTasksFlow() {
    try {
      const { backend: { tasks: { lastUpdate }}} = yield select();
      const data = yield call(fetchTasks);
      // console.log(data.ts, lastUpdate, lastUpdate > data.ts);
      if (data.ts && lastUpdate > data.ts) {
        return true;
      }

      yield put(RoomsActions.tasksSuccess(data));
      yield put(BackendActions.tasksFetched());
      yield put(RoomsActions.updateRoomsIncrement('tasks'));
    } catch (e) {
      console.log(e);
      yield put(RoomsActions.tasksFailure(e));
    } finally {

    }
  }

  function * watchTasksFlow() {
    // yield takeLatest(RoomsTypes.TASKS_FETCH, fetchTasksFlow);
    yield throttle(3000, RoomsTypes.TASKS_FETCH, fetchTasksFlow);
  }

  // Hotel History
  function * fetchHistory() {
    return yield call(authRequest, HISTORY_API);
  }

  function * fetchHistoryFlow() {
    try {
      const { backend: { history: { lastUpdate }}} = yield select();
      const data = yield call(fetchHistory);
      if (data.ts && lastUpdate > data.ts) {
        return true;
      }

      yield put(RoomsActions.historySuccess(data));
      yield put(BackendActions.historyFetched());
    } catch (e) {
      console.log(e);
      yield put(RoomsActions.historyFailure(e));
    } finally {

    }
  }

  function * watchHistoryFlow() {
    // yield takeLatest(RoomsTypes.HISTORY_FETCH, fetchHistoryFlow);
    yield throttle(3000, RoomsTypes.HISTORY_FETCH, fetchHistoryFlow);
  }

  function * fetchGuestBook() {
    return yield call(authRequest, GUEST_BOOK_API);
  }

  function * fetchGuestBookFlow() {
    try {
      // const { backend: { history: { lastUpdate }}} = yield select();
      const data = yield call(fetchGuestBook);
      // if (data.ts && lastUpdate > data.ts) {
      //   return true;
      // }

      yield put(RoomsActions.guestBookFetchSuccess(data));
      // yield put(BackendActions.historyFetched());
    
    } catch (error) {
      console.log(error);
      yield put(RoomsActions.guestBookFetchFailure(error));
    }
  }

  function * watchGuestBookFlow() {
    yield throttle(3000, RoomsTypes.GUEST_BOOK_FETCH, fetchGuestBookFlow);
  }

  function * fetchPlanningsHostsIn() {
    return yield call(authRequest, PLANNING_HOSTS_IN_API);
  }

  function * fetchPlanningsHostsInFlow() {
    try {
      // const { backend: { history: { lastUpdate }}} = yield select();
      const data = yield call(fetchPlanningsHostsIn);
      // if (data.ts && lastUpdate > data.ts) {
      //   return true;
      // }

      yield put(RoomsActions.planningsHostInSuccess(data));
      // yield put(BackendActions.historyFetched());
    
    } catch (error) {
      yield put(RoomsActions.planningsHostInFailure(error));
    }
  }

  function * watchPlanningsHostsInFlow() {
    yield throttle(3000, RoomsTypes.PLANNINGS_HOSTS_IN_FETCH, fetchPlanningsHostsInFlow);
  }

  function * fetchPlanningsHostsOut() {
    return yield call(authRequest, PLANNING_HOSTS_OUT_API);
  }

  function * fetchPlanningsHostsOutFlow() {
    try {
      // const { backend: { history: { lastUpdate }}} = yield select();
      const data = yield call(fetchPlanningsHostsOut);
      // if (data.ts && lastUpdate > data.ts) {
      //   return true;
      // }

      yield put(RoomsActions.planningsHostOutSuccess(data));
      // yield put(BackendActions.historyFetched());
    
    } catch (error) {
      yield put(RoomsActions.planningsHostOutFailure(error));
    }
  }

  function * watchPlanningsHostsOutFlow() {
    yield throttle(3000, RoomsTypes.PLANNINGS_HOSTS_OUT_FETCH, fetchPlanningsHostsOutFlow);
  }

  function * bookmarksSideEffectFlow() {
    try {
      yield put(RoomsActions.updateRoomsIncrement('bookmark')); 
    
    } catch (error) {
      console.log(error)
    }
  }

  function * watchBookmarksAdd() {
    yield takeLatest(RoomsTypes.BOOKMARK_ADD, bookmarksSideEffectFlow);
  }
  function * watchBookmarksRemove() {
    yield takeLatest(RoomsTypes.BOOKMARK_REMOVE, bookmarksSideEffectFlow);
  }
  function * watchBookmarksClear() {
    yield takeLatest(RoomsTypes.BOOKMARKS_CLEAR, bookmarksSideEffectFlow);
  }

  function * optimisticSideEffectFlow() {
    try {
      yield put(RoomsActions.updateRoomsIncrement('optimistic')); 
    } catch (error) {
      console.log(error);
    }
  }

  function * watchRoomOptimisticFlow() {
    yield takeLatest(RoomsTypes.ROOM_UPDATE_OPTIMISTIC, optimisticSideEffectFlow);
  }
  function * watchPlanningOptimisticFlow() {
    yield takeLatest(RoomsTypes.PLANNING_UPDATE_OPTIMISTIC, optimisticSideEffectFlow);
  }
  function * watchTaskOptimisticFlow() {
    yield takeLatest(RoomsTypes.TASK_UPDATE_OPTIMISTIC, optimisticSideEffectFlow);
  }
  function * watchExtraOptionOptimisticFlow() {
    yield takeLatest(RoomsTypes.EXTRA_OPTION_UPDATE_OPTIMISTIC, optimisticSideEffectFlow);
  }

  const watchers = {
    watchRoomsFlow,
    watchFloorsFlow,
    watchRoomStatusesFlow,
    watchRoomHousekeepingsFlow,
    watchRoomCategoriesFlow,
    watchPlanningsFlow,
    watchPlanningsNightFlow,
    watchPlanningsRunnerFlow,
    watchCalendarFlow,
    watchRoomNotesFlow,
    watchCatalogsFlow,
    watchLostItemsFlow,
    watchFoundItemsFlow,
    watchTasksFlow,
    watchHistoryFlow,
    watchGuestBookFlow,
    watchPlanningsHostsInFlow,
    watchPlanningsHostsOutFlow,
    watchBookmarksAdd,
    watchBookmarksRemove,
    watchBookmarksClear,
    watchRoomOptimisticFlow,
    watchPlanningOptimisticFlow,
    watchTaskOptimisticFlow,
    watchExtraOptionOptimisticFlow,
  }

  const root = forkWatchers(watchers);

  return {
    root,
    watchers,
    sagas: {
      fetchRooms,
      fetchRoomsFlow,
      fetchFloors,
      fetchFloorsFlow,
      fetchRoomStatuses,
      fetchRoomStatusesFlow,
      fetchRoomHousekeepings,
      fetchRoomHousekeepingsFlow,
      fetchRoomCategories,
      fetchRoomCategoriesFlow,
      fetchPlannings,
      fetchPlanningsFlow,
      fetchPlanningsNight,
      fetchPlanningsNightFlow,
      fetchPlanningsRunner,
      fetchPlanningsRunnerFlow,
      fetchCalendar,
      fetchCalendarFlow,
      fetchRoomNotes,
      fetchRoomNotesFlow,
      fetchCatalogs,
      fetchCatalogsFlow,
      fetchLostItems,
      fetchLostItemsFlow,
      fetchFoundItems,
      fetchFoundItemsFlow,
      fetchTasks,
      fetchTasksFlow,
      fetchHistory,
      fetchHistoryFlow,
      fetchGuestBook,
      fetchGuestBookFlow,
      fetchPlanningsHostsIn,
      fetchPlanningsHostsInFlow,
      fetchPlanningsHostsOut,
      fetchPlanningsHostsOutFlow,
      bookmarksSideEffectFlow,
      optimisticSideEffectFlow
    }
  }
}
