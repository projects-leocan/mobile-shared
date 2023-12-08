import { takeLatest, put, call, select, fork, throttle, all} from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { get } from 'lodash/object';
import moment from 'moment';
import { map, filter } from 'lodash/collection';
import { differenceBy, compact, uniq, difference } from 'lodash/array';
import _, { first,flatten } from "lodash"

import RoomsTypes from '../constants/rooms';
import RoomsActions from '../actions/rooms';
import OutboundActions from '../actions/outbound'
import SocketRoomsActions from '../actions/socketRooms';
import BackendActions from '../actions/backend';
import DifferencesActions from '../actions/differences';
import { availableHotelsSelector } from '../selectors/auth';

import request, { authRequest } from '../utils/request';
import { forkWatchers } from '../utils/sagas';
import { offlineable } from '../offline';

import { planningsForUser, attendantRooms, planningsSelector, roomsSelector, hotelMessageSelector, nightyPlanningsForUser, roomsIdSelector, calendarIdSelector } from '../selectors/rooms';
import { findUpdates as findPlanningUpdates } from '../utils/plannings';
import { findUpdates as findRoomUpdates } from '../utils/rooms';
import { cleanRooms } from '../utils/models/rooms';
import {
  rooms as roomDifferences,
  plannings as planningDifferences,
  calendar as calendarDifferences
} from '../utils/differences';

import {
  hotelIdSelector
} from "../selectors/auth";
import { availHotelsRoomSelector } from 'rc-mobile-base/lib/selectors/hotelsTask';
export default function ({ apiUrl, userType }) {
  const ROOMS_API = `/Room/GetListOfRooms`;
  const FLOORS_API = `/Floor/GetListOfFloors`;
  const ROOM_STATUSES_API = `/Room/GetListOfRoomStatuses`;
  const ROOM_HOUSEKEEPINGS_API = `/Room/GetListOfRoomHousekeepings`;
  const ROOM_CATEGORIES_API = `/RoomCategory/GetListOfRoomCategories`;
  const PLANNINGS_API = `/Cleaning/GetListOfCleanings`;
  const FUTURE_PLANNINGS_API = `/Cleaning/GetListOfFutureCleanings`;
  const PLANNINGS_NIGHT_API = `/attendant_planning_nights`;
  const PLANNINGS_RUNNER_API = `/runner_plannings`;
  const CALENDAR_API = `/Reservation/GetListOfReservations`;
  const ROOM_NOTES_API = `/Room/GetListOfNotes`;
  const CATALOGS_API = `/catalog_by_hotel`;
  const ROOM_CATALOGS_API = `/RoomCatalog/GetListOfRoomCatalogImages`;
  const TASKS_API = `/Task/GetListOfTasks`;
  const FUTURE_TASKS_API = `/Task/GetListOfFutureTasks`;
  const HISTORY_API = `/hotel_history`;
  const GUEST_BOOK_API = `/guest_book`;
  const PLANNING_HOSTS_IN_API = `/host_plannings_in`;
  const PLANNING_HOSTS_OUT_API = `/host_plannings_out`;
  const LOST_ITEMS_API = `/lost_found/losts`;
  const FOUND_ITEMS_API = `/FoundItem/GetListOfFoundItems`;
  const GET_ROOM_MESSAGE = `/Room/GetListOfAllMessages`;
  const GET_INSPECTION_CLEANING = `/Cleaning/GetListOfCleaningsForInspection`;
  const AUDITS_API = `/Audit/GetListOfTemplates`;
  const GET_BREAKFAST = "/Breakfast/GetBreakfastLogs"

  const isInspector = userType === 'inspector';
  const isRunner = userType === 'room_runner';
  const isMaintenance = userType === 'maintenance';
  const isAttendant = userType === 'attendant';

  // Hotel Rooms
  function* fetchRooms(data) {
    const socketData = data.socketData 
    const all = _.isObject(socketData) ? socketData.all : true
    const rids = _.isObject(socketData) ? socketData.rids : []
    const userHotelId = yield select(hotelIdSelector);
    return yield call(authRequest, ROOMS_API, {
      method: 'POST',
      body: JSON.stringify({
        hotelId: userHotelId,
        roomIds: all === false ? rids : []
      })
    });
  }

  function* fetchRoomsFlow(socketData) {
    try {
      const roomUpdateData = socketData.socketData 
      const isAll = _.isObject(roomUpdateData) ? roomUpdateData.all : true
      const { backend: { rooms: { lastUpdate } }, auth: { config, hotel } } = yield select();
      const data = yield call(() => fetchRooms(socketData));
      // if (data.ts && lastUpdate > data.ts) {
      //   return true;
      // }

      const cleaned = cleanRooms(data);
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

      // yield put(RoomsActions.roomsSuccess({ rooms: cleaned }))
      isAll=== true ? yield put(RoomsActions.roomsSuccess({ rooms: cleaned })) : yield put(RoomsActions.singleRoomSuccess({rooms: cleaned}))
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

  function* watchRoomsFlow(state) {
    // yield takeLatest(RoomsTypes.ROOMS_FETCH, fetchRoomsFlow);
    yield throttle(10000, RoomsTypes.ROOMS_FETCH, fetchRoomsFlow);
  }

  // Hotel Floors
  function* fetchFloors() {
    const userHotelId = yield select(hotelIdSelector);
    return yield call(authRequest, FLOORS_API, {
      method: 'POST',
      body: JSON.stringify({
        hotelId: userHotelId
      })
    });
  }

  function* fetchFloorsFlow() {
    try {
      const { backend: { floors: { lastUpdate } } } = yield select();
      const data = yield call(fetchFloors);
      // if (data.ts && lastUpdate > data.ts) {
      //   return true;
      // }

      yield put(RoomsActions.floorsSuccess(data))
      yield put(BackendActions.floorsFetched());
      yield put(RoomsActions.updateRoomsIncrement('floors'));
    } catch (e) {
      console.log(e);
      yield put(RoomsActions.floorsFailure(e))
    } finally {

    }
  }

  function* watchFloorsFlow(state) {
    yield takeLatest(RoomsTypes.FLOORS_FETCH, fetchFloorsFlow);
  }

  // Hotel Room Status
  function* fetchRoomStatuses() {
    const userHotelId = yield select(hotelIdSelector);
    return yield call(authRequest, ROOM_STATUSES_API, {
      method: 'POST',
      body: JSON.stringify({
        hotelId: userHotelId
      })
    });
  }

  function* fetchRoomStatusesFlow() {
    try {
      const { backend: { roomStatuses: { lastUpdate } } } = yield select();
      const data = yield call(fetchRoomStatuses);

      yield put(RoomsActions.roomStatusesSuccess(data))
      yield put(BackendActions.roomStatusesFetched());
      yield put(RoomsActions.updateRoomsIncrement('roomStatus'));
    } catch (e) {
      console.log(e);
      yield put(RoomsActions.roomStatusesFailure(e))
    } finally {

    }
  }

  function* watchRoomStatusesFlow(state) {
    yield takeLatest(RoomsTypes.ROOM_STATUSES_FETCH, fetchRoomStatusesFlow);
  }

  // Hotel Room Housekeepings
  function* fetchRoomHousekeepings(data) {
    const socketData = data.socketData 
    const all = _.isObject(socketData) ? socketData.all : false
    const rids = _.isObject(socketData) ? socketData.rids : []
    const userHotelId = yield select(hotelIdSelector);
    return yield call(authRequest, ROOM_HOUSEKEEPINGS_API, {
      method: 'POST',
      body: JSON.stringify({
        hotelId: userHotelId,
        roomIds: all === false ? rids : []
      })
    });
  }

  function* fetchRoomHousekeepingsFlow(socketData) {
    try {
      const roomUpdateData = socketData.socketData 
      const isAll = _.isObject(roomUpdateData) ? roomUpdateData.all : true
      const { backend: { roomHousekeepings: { lastUpdate } } } = yield select();
      const data = yield call(() => fetchRoomHousekeepings(socketData));
      // yield put(RoomsActions.roomHousekeepingsSuccess(data))
      isAll === true ? yield put(RoomsActions.roomHousekeepingsSuccess(data)) : yield put(RoomsActions.singleRoomHousekeepingsSuccess(data))
      yield put(BackendActions.roomHousekeepingsFetched());
      yield put(RoomsActions.updateRoomsIncrement('roomHousekeepings'));
    } catch (e) {
      console.log(e);
      yield put(RoomsActions.roomHousekeepingsFailure(e))
    } finally {

    }
  }

  function* watchRoomHousekeepingsFlow(state) {
    yield takeLatest(RoomsTypes.ROOM_HOUSEKEEPINGS_FETCH, fetchRoomHousekeepingsFlow);
  }

  // Hotel Room Categories
  function* fetchRoomCategories() {
    const userHotelId = yield select(hotelIdSelector);
    return yield call(authRequest, ROOM_CATEGORIES_API, {
      method: 'POST',
      body: JSON.stringify({
        id: userHotelId
      })
    });
  }

  function* fetchRoomCategoriesFlow() {
    try {
      const { backend: { roomCategories: { lastUpdate } } } = yield select();
      const data = yield call(fetchRoomCategories);

      yield put(RoomsActions.roomCategoriesSuccess(data));
      yield put(BackendActions.roomCategoriesFetched());
      yield put(RoomsActions.updateRoomsIncrement('roomCategories'));
    } catch (e) {
      console.log(e)
      yield put(RoomsActions.roomCategoriesFailure(e));
    } finally {

    }
  }

  function* watchRoomCategoriesFlow(state) {
    yield takeLatest(RoomsTypes.ROOM_CATEGORY_FETCH, fetchRoomCategoriesFlow);
  }

  // Hotel Plannings
  function* fetchPlannings() {
    const userHotelId = yield select(hotelIdSelector);
    return yield call(authRequest, PLANNINGS_API, {
      method: 'POST',
      body: JSON.stringify({
        hotelId: userHotelId,
        includeNightlyCleanings: true
      })
    });
  }

  // All Hotel Plannings
  function* fetchAllHotelPlannings(id) {
    return yield call(authRequest, PLANNINGS_API, {
      method: 'POST',
      body: JSON.stringify({
        hotelId: id,
        includeNightlyCleanings: true
      })
    });
  }

  function* fetchPlanningsFlow() {
    try {
      const { backend: { plannings: { lastUpdate } }, auth: { config } } = yield select();

      const data = yield call(fetchPlannings);
      const regularCleaning = filter(data, (da) => !da?.is_nightly_cleaning && !da?.is_turn_down_cleaning)
      const nightlyCleaning = filter(data, (da) => da?.is_nightly_cleaning || da?.is_turn_down_cleaning);

      // const regularCleaning = filter(data, ['is_nightly_cleaning', false])
      // const nightlyCleaning = filter(data, ['is_nightly_cleaning', true]);

      // if (data.ts && lastUpdate > data.ts) {
      //   return true;
      // }

      let nightyPrevious;
      if (isAttendant) {
        nightyPrevious = yield select(nightyPlanningsForUser)
      }

      let updates;

      const previous = isAttendant ?
        yield select(planningsForUser) :
        yield select(planningsSelector);

      if (isAttendant) {
        updates = findPlanningUpdates(previous, regularCleaning);
        if (updates) {
          let nightyUpdate = findPlanningUpdates(nightyPrevious, nightlyCleaning)
          if (nightyUpdate) {
            updates = { ...updates, ...nightyUpdate }
          }
        }
        else {
          updates = findPlanningUpdates(nightyPrevious, nightlyCleaning)
        }
      }
      if (isRunner) {
        let nightyPreviousInRunner = yield select(nightyPlanningsForUser)
        let nightyUpdate = findPlanningUpdates(nightyPreviousInRunner, nightlyCleaning)
        if (nightyUpdate) {
          yield put(RoomsActions.planningsUpdates(updates));
        }
      }
      if (isInspector) {
        updates = planningDifferences(previous, regularCleaning);
      }

      yield put(RoomsActions.planningsSuccess(regularCleaning))
      yield put(BackendActions.planningsFetched());

      yield put(RoomsActions.planningsNightSuccess(nightlyCleaning))

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
      yield put(RoomsActions.updateRoomsIncrement('planningsNight'));
    } catch (e) {
      console.log(e);
      yield put(RoomsActions.planningsFailure(e))
    } finally {

    }
  }

  function* fetchAllHotelPlanningsFlow(value) {
    try {
      const { backend: { plannings: { lastUpdate } }, auth: { config } } = yield select();
      const availableHotels = yield select(availableHotelsSelector);
      const availableHotelsRooms = yield select(availHotelsRoomSelector)
      
      const data =  yield all(availableHotels.map(hotel => call(fetchAllHotelPlannings, get(hotel, 'hotelId', null)))) 
      const regularCleaning = filter(data, (da) => !da?.is_nightly_cleaning && !da?.is_turn_down_cleaning)
      const nightlyCleaning = filter(data, (da) => da?.is_nightly_cleaning || da?.is_turn_down_cleaning);
      let validateData = []
      availableHotelsRooms.map((room) =>{
          map(flatten(regularCleaning), function (item) {
            if (room.id === item.room_id) {
              if (room.attendantStatus != "finish") {
                validateData.push({...item, room: room})
              }
            }
          });
      })
     
      yield put(RoomsActions.allHotelPlanningsSuccess(validateData))
      yield put(BackendActions.planningsFetched());
    } catch (e) {
      console.log(e);
      yield put(RoomsActions.allHotelPlanningsFailure(e))
    } finally {

    }
  }

  function* watchPlanningsFlow(state) {
    // yield takeLatest(RoomsTypes.PLANNINGS_FETCH, fetchPlanningsFlow);
    yield throttle(3000, RoomsTypes.PLANNINGS_FETCH, fetchPlanningsFlow);
  }

  
  function* watchAllHotelPlanningsFlow(state) {
    yield throttle(3000, RoomsTypes.ALL_HOTEL_PLANNINGS_FETCH, fetchAllHotelPlanningsFlow);
  }


  //hotel breakfast
  function* fetchBreakFastLog() {
    const userHotelId = yield select(hotelIdSelector);
    const roomIds = yield select(roomsIdSelector);
    const reservationIds = yield select(calendarIdSelector)

    const today = new Date();
    const month = today.getMonth()+1;
    const year = today.getFullYear();
    const date = today. getDate();
    const formatedDate = date < 10 ? "0" + date : date
    const currentDate = year + "-" + month + "-" + formatedDate;

    today.setDate(today.getDate() + 1)
    const toYear = today.getFullYear() 
    const toMonth = String(today.getMonth() + 1) 
    const day = String(today.getDate()) 
    const formatedDay = day < 10 ? "0" + day : day
    const formettedTommorowDate = toYear + "-" + toMonth + "-" + formatedDay 

    return yield call(authRequest, GET_BREAKFAST, {
      method: 'POST',
      body: JSON.stringify({
        dateFrom: currentDate,
        dateTo: formettedTommorowDate,
        hotelId: userHotelId,
        reservationIds: [],
        roomIds: []
      })
    });
  }

  function* fetchBreakFastLogFlow() {
    try {
      const data = yield call(fetchBreakFastLog);
      yield put(RoomsActions.fetchBreakfastSuccess(data))
    } catch (e) {
      console.log(e);
      yield put(RoomsActions.fetchBreakfastFailure(e))
    } finally {

    }
  }

  function* watchBreakFastLoFlow(state) {
    yield throttle(3000, RoomsTypes.BREAKFAST_FETCH, fetchBreakFastLogFlow);
  }

  function* fetchFuturePlannings() {
    const userHotelId = yield select(hotelIdSelector);
    return yield call(authRequest, FUTURE_PLANNINGS_API, {
      method: 'POST',
      body: JSON.stringify({
        hotelId: userHotelId,
        numberOfDaysInTheFuture: 10
      })
    });
  }

  function* fetchFuturePlanningsFlow() {
    try {
      const data = yield call(fetchFuturePlannings);
      yield put(RoomsActions.futurePlanningsSuccess(data))
    } catch (e) {
      console.log(e);
      yield put(RoomsActions.futurePlanningsFailure(e))
    } finally {

    }
  }
  //
  function* watchFuturePlanningsFlow(state) {
    yield throttle(3000, RoomsTypes.FUTURE_PLANNINGS_FETCH, fetchFuturePlanningsFlow);
  }

  // Hotel Plannings Night
  function* fetchPlanningsNight() {
    return yield call(authRequest, PLANNINGS_NIGHT_API);
  }

  function* fetchPlanningsNightFlow() {
    try {
      // const data = yield call(fetchPlanningsNight);

      yield put(RoomsActions.planningsNightSuccess([]))
      yield put(RoomsActions.updateRoomsIncrement('planningsNight'));
    } catch (e) {
      console.log(e);
      yield put(RoomsActions.planningsNightFailure(e))
    } finally {

    }
  }

  function* watchPlanningsNightFlow(state) {
    // yield takeLatest(RoomsTypes.PLANNINGS_NIGHT_FETCH, fetchPlanningsNightFlow);
    // yield throttle(3000, RoomsTypes.PLANNINGS_NIGHT_FETCH, fetchPlanningsNightFlow);
  }

  // Hotel Plannings Runner
  function* fetchPlanningsRunner() {
    return yield call(authRequest, PLANNINGS_RUNNER_API);
  }

  function* fetchPlanningsRunnerFlow() {
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

  function* watchPlanningsRunnerFlow(state) {
    yield takeLatest(RoomsTypes.PLANNINGS_RUNNER_FETCH, fetchPlanningsRunnerFlow);
  }

  function* fetchInspectionCleaning() {
    const userHotelId = yield select(hotelIdSelector);
    return yield call(authRequest, GET_INSPECTION_CLEANING, {
      method: 'POST',
      body: JSON.stringify({
        hotelId: userHotelId
      })
    });
  }

  function* fetchInspectionPlanningFlow() {
    try {
      const data = yield call(fetchInspectionCleaning);
      yield put(RoomsActions.inspectionCleanSuccess(data))
      yield put(BackendActions.roomMessageFetched())
    } catch (e) {
    } finally {

    }
  }

  function* watchInspectionPlanningFlow(state) {
    yield takeLatest(RoomsTypes.ROOM_INSPECTION_CLEAN_FETCH, fetchInspectionPlanningFlow);
  }

  // Hotel Calender
  function* fetchCalendar() {
    // return yield call(authRequest, CALENDAR_API);
    const userHotelId = yield select(hotelIdSelector);
    return yield call(authRequest, CALENDAR_API, {
      method: 'POST',
      body: JSON.stringify({
        hotelId: userHotelId
      })
    });
  }

  function* fetchCalendarFlow() {
    try {
      const { backend: { calendar: { lastUpdate } } } = yield select();
      const data = yield call(fetchCalendar);
      // if (data.ts && lastUpdate > data.ts) {
      //   return true;
      // }

      yield put(RoomsActions.calendarSuccess(data));
      yield put(BackendActions.calendarFetched());
      yield put(RoomsActions.updateRoomsIncrement('calendar'));
    } catch (e) {
      console.log(e);
      yield put(RoomsActions.calendarFailure(e));
    } finally {

    }
  }

  function* watchCalendarFlow(state) {
    // yield takeLatest(RoomsTypes.CALENDAR_FETCH, fetchCalendarFlow);
    yield throttle(3000, RoomsTypes.CALENDAR_FETCH, fetchCalendarFlow);
  }

  function* fetchMessages() {
    const userHotelId = yield select(hotelIdSelector);
    return yield call(authRequest, GET_ROOM_MESSAGE, {
      method: 'POST',
      body: JSON.stringify({
        hotelId: userHotelId
      })
    });
  }

  function* fetchMessagesFlow() {
    try {
      const data = yield call(fetchMessages);
      yield put(RoomsActions.messageSuccess(data))
      yield put(BackendActions.roomInspectionCleanFetched())
    } catch (e) {
    } finally {

    }
  }

  function* watchMessagesFlow(state) {
    yield takeLatest(RoomsTypes.ROOM_MESSAGES_FETCH, fetchMessagesFlow);
  }

  function* socketFetchMessagesFlow() {
    try {
      const hotelMessages = yield select(hotelMessageSelector);
      const data = yield call(fetchMessages);
      const hotelPlannings = yield select(planningsSelector);

      if (!isMaintenance) {
        if (!isRunner) {
          if (hotelPlannings.length > 0 && isAttendant) {
            const newlyArrivedMessage = differenceBy(data, hotelMessages, 'id')
            const hotelPlanningsId = map(hotelPlannings, 'room_id');
            const validateArrivedMessage = newlyArrivedMessage.map(item => {
              const roomIds = uniq(map(get(item, 'messageRooms', []), 'roomId'))
              if (difference(roomIds, hotelPlanningsId).length === 0) {
                return item
              }
            })
            yield put(SocketRoomsActions.socketMessageSuccess(compact(validateArrivedMessage)))
          } else {
            const newlyArrivedMessage = differenceBy(data, hotelMessages, 'id')
            yield put(SocketRoomsActions.socketMessageSuccess(newlyArrivedMessage))
          }
        }
      }
    } catch (e) {
    } finally {

    }
  }

  function* watchSocketMessagesFlow(state) {
    yield takeLatest(RoomsTypes.SOCKET_ROOM_MESSAGES_FETCH, socketFetchMessagesFlow);
  }

  // Hotel Room Notes
  function* fetchRoomNotes() {
    const userHotelId = yield select(hotelIdSelector);
    return yield call(authRequest, ROOM_NOTES_API, {
      method: 'POST',
      body: JSON.stringify({
        hotelId: userHotelId
      })
    });
  }

  function* fetchRoomNotesFlow() {
    try {
      const { backend: { roomNotes: { lastUpdate } } } = yield select();
      const data = yield call(fetchRoomNotes);
      // if (data.ts && lastUpdate > data.ts) {
      //   return true;
      // }

      yield put(RoomsActions.roomNotesSuccess(data));
      yield put(BackendActions.roomNotesFetched());
      yield put(RoomsActions.updateRoomsIncrement('roomNotes'));
    } catch (e) {
      yield put(RoomsActions.roomNotesFailure(e));
    } finally {

    }
  }

  function* watchRoomNotesFlow(state) {
    // yield takeLatest(RoomsTypes.ROOM_NOTES_FETCH, fetchRoomNotesFlow);
    yield throttle(3000, RoomsTypes.ROOM_NOTES_FETCH, fetchRoomNotesFlow);
  }

  // Room Catalogs
  function* fetchRoomCatalogs() {
    return yield call(authRequest, ROOM_CATALOGS_API);
  }

  // Hotel Catalogs
  function* fetchCatalogs() {
    return yield call(authRequest, CATALOGS_API);
  }

  function* fetchCatalogsFlow() {
    try {
      // const { backend: { catalogs: { lastUpdate } } } = yield select();
      // const data = yield call(fetchCatalogs);
      // if (data.ts && lastUpdate > data.ts) {
      //   return true;
      // }

      yield put(RoomsActions.catalogsSuccess([]))
      yield put(BackendActions.catalogsFetched());
    } catch (e) {
      console.log(e);
      yield put(RoomsActions.catalogsFailure(e))
    } finally {

    }
  }

  function* watchCatalogsFlow(state) {
    yield takeLatest(RoomsTypes.CATALOGS_FETCH, fetchCatalogsFlow);
  }

  // Hotel Lost Items
  function* fetchLostItems() {
    return yield call(authRequest, LOST_ITEMS_API);
  }

  function* fetchLostItemsFlow() {
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

  function* watchLostItemsFlow(state) {
    yield takeLatest(RoomsTypes.LOST_FETCH, fetchLostItemsFlow);
  }

  // Hotel Found Items
  function* fetchFoundItems() {
    // return yield call(authRequest, FOUND_ITEMS_API);
    const userHotelId = yield select(hotelIdSelector);
    return yield call(authRequest, FOUND_ITEMS_API, {
      method: 'POST',
      body: JSON.stringify({
        hotelId: userHotelId
      })
    });
  }

  function* fetchFoundItemsFlow() {
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

  function* watchFoundItemsFlow(state) {
    yield takeLatest(RoomsTypes.FOUND_FETCH, fetchFoundItemsFlow);
  }

  // Hotel Tasks
  function* fetchTasks(taskId) {
    const userHotelId = yield select(hotelIdSelector);
    return yield call(authRequest, TASKS_API, {
      method: 'POST',
      body: JSON.stringify({
        hotelId: userHotelId,
        includeMyTasks: true,
        includeTasksCreatedByMe: true,
        taskIds: taskId ? taskId : []
      })
    });
  }

  function* fetchTasksFlow(taskId) {
    try {
      const getSpecificTaskId = get(taskId, 'id', [])
      const { backend: { tasks: { lastUpdate } } } = yield select();
      const { rooms: { hotelTasks, taskSocket } } = yield select();
      let filterSpecificUserTask = getSpecificTaskId
      if (!_.isEmpty(getSpecificTaskId)) {
        const { auth: { user } } = yield select();
        const getSpecificTask = get(taskId, 'data', [])
        const filterSpecificUserTaskData = getSpecificTask.filter((d) => {
          return (
            d?.userIds?.includes(user.id) || d?.groupIds?.includes(user?.userGroupId) || d?.subGroupIds?.includes(user?.userSubGroupId) || d?.creator_id === user.id
          )
        }
        )

        filterSpecificUserTask = filterSpecificUserTaskData.map((d) => d.id)
        if (_.isEmpty(filterSpecificUserTask)) {
          let filterHotelTask = hotelTasks.filter(item => !(item?.id?.includes(getSpecificTaskId)));
          let filterSocketTask = taskSocket.filter(item => !(item?.id?.includes(getSpecificTaskId)));
          // const newDataMap = _.keyBy(getSpecificTask, 'id');
          // let filterSocketTask = taskSocket.map(item => newDataMap[item.id] ? newDataMap[item.id] : item);

          const addDueDate = map(filterHotelTask, function (item) {
            return item.due_date ? item : { ...item, due_date: item.start_date };
          });

          if (hotelTasks?.length !== filterHotelTask?.length) {
            yield put(RoomsActions.tasksSuccess(addDueDate));
            yield put(BackendActions.tasksFetched());
            yield put(RoomsActions.updateRoomsIncrement('tasks'));
          }
          if (filterSocketTask?.length !== taskSocket?.length) {
            yield put(RoomsActions.setTaskSocketData(filterSocketTask));
          }
          return
        }
        const filterTask = filterSpecificUserTaskData.filter((d) => !hotelTasks.some(h => h.id === d.id))
        if (!_.isEmpty(filterTask)) {
          yield put(RoomsActions.setTaskSocketData(filterTask));
        }
      }
      const data = yield call(() => fetchTasks(filterSpecificUserTask));

      let newData = []
      if (_.isEmpty(filterSpecificUserTask)) {
        newData = map(data, function (item) {
          return item.due_date ? item : { ...item, due_date: item.start_date };
        });
      }
      else {
        const getSpecificTask = get(taskId, 'data', [])
        const firstTask = get(getSpecificTask, 0, {});
        const addDueDate = map(data, function (item) {
          // return item.due_date || item.id === getSpecificTask.id ? {...item, do_raise_accept_popup:false} : { ...item, due_date: item.start_date, do_raise_accept_popup:false };
          // return item.due_date || item.id === getSpecificTask.id ? {...item, do_raise_accept_popup:firstTask.do_raise_accept_popup} : { ...item, due_date: item.start_date, do_raise_accept_popup:false };
          return item.due_date || item.id === firstTask.id ? {...item, due_date: item.start_date, do_raise_accept_popup: firstTask.do_raise_accept_popup, room_id: item.meta.room_id} : { ...item, due_date: item.start_date, do_raise_accept_popup: false};
        });
        // const getSpecificTask = get(taskId, 'data', [])
        const filterTask = addDueDate.filter((d) => !hotelTasks.some(h => h.id === d.id))


        if (_.isEmpty(filterTask)) {
          //replace
          const newDataMap = _.keyBy(addDueDate, 'id');
          newData = hotelTasks.map(item => newDataMap[item.id] ? newDataMap[item.id] : item);
          const filterData = addDueDate.filter((data) => {
            return !data.is_claimed
          })
          yield put(RoomsActions.setTaskSocketData(filterData));
        }
        else {
          const { auth: { availableHotels } } = yield select();
          const assignHotelTask = get(taskId, 'data', [])
          if (!_.isEmpty(assignHotelTask))
          {
              const isFound = availableHotels.some(element => {
                if (element.hotelId === assignHotelTask[0].hotel_id) {
                  return true;
                }
                return false;
              });
              
              if (isFound === false) {
                newData = [...hotelTasks];
              }
              else{
                newData = [...hotelTasks, ...filterTask];
              }
          }
          else
          {
            newData = [...hotelTasks];
          }
              
         
        }
      }

      yield put(RoomsActions.tasksSuccess(newData));
      yield put(BackendActions.tasksFetched());
      yield put(RoomsActions.updateRoomsIncrement('tasks'));
    } catch (e) {
      console.log(e);
      yield put(RoomsActions.tasksFailure(e));
    } finally {

    }
  }

  function* watchTasksFlow() {
    // yield takeLatest(RoomsTypes.TASKS_FETCH, fetchTasksFlow);
    yield throttle(3000, RoomsTypes.TASKS_FETCH, fetchTasksFlow);
  }

  // Hotel Tasks
  function* fetchFutureTasks() {
    const userHotelId = yield select(hotelIdSelector);
    return yield call(authRequest, FUTURE_TASKS_API, {
      method: 'POST',
      body: JSON.stringify({
        hotelId: userHotelId,
        includeMyTasks: true,
        includeTasksCreatedByMe: false,
        numberOfDaysInTheFuture: 4
      })
    });
  }

  function* fetchFutureTasksFlow() {
    try {
      const { backend: { tasks: { lastUpdate } } } = yield select();
      const data = yield call(fetchFutureTasks);

      let newData = map(data, function (item) {
        return item.due_date ? item : { ...item, due_date: item.start_date };
      });

      yield put(RoomsActions.futureTasksSuccess(newData));
      yield put(BackendActions.futureTasksFetched());
    } catch (e) {
      console.log(e);
      yield put(RoomsActions.tasksFailure(e));
    } finally {

    }
  }

  function* watchFutureTasksFlow() {
    yield throttle(3000, RoomsTypes.FUTURE_TASKS_FETCH, fetchFutureTasksFlow);
  }

  // Hotel Tasks
  function* fetchAudis() {
    const userHotelId = yield select(hotelIdSelector);
    return yield call(authRequest, AUDITS_API, {
      method: 'POST',
      body: JSON.stringify({
        hotelId: userHotelId,
        includeMyTasks: true,
        includeTasksCreatedByMe: true
      })
    });
  }

  function* fetchAudisFlow() {
    try {
      const { backend: { tasks: { lastUpdate } } } = yield select();
      const data = yield call(fetchAudis);
      yield put(RoomsActions.auditSuccess(data));
    } catch (e) {
      console.log(e);
      yield put(RoomsActions.auditFailure(e));
    } finally {

    }
  }

  // function* watchTasksFlow() {
  //   yield throttle(3000, RoomsTypes.AUDIT_FETCH, fetchAudisFlow);
  // }

  function* watchAuditTasksFlow() {
    yield throttle(3000, RoomsTypes.AUDIT_FETCH, fetchAudisFlow);
  }


  // Hotel History
  function* fetchHistory() {
    return yield call(authRequest, HISTORY_API);
  }

  function* fetchHistoryFlow() {
    try {
      const { backend: { history: { lastUpdate } } } = yield select();
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

  function* watchHistoryFlow() {
    // yield takeLatest(RoomsTypes.HISTORY_FETCH, fetchHistoryFlow);
    yield throttle(3000, RoomsTypes.HISTORY_FETCH, fetchHistoryFlow);
  }

  function* fetchGuestBook() {
    return yield call(authRequest, GUEST_BOOK_API);
  }

  function* fetchGuestBookFlow() {
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

  function* watchGuestBookFlow() {
    yield throttle(3000, RoomsTypes.GUEST_BOOK_FETCH, fetchGuestBookFlow);
  }

  function* fetchPlanningsHostsIn() {
    return yield call(authRequest, PLANNING_HOSTS_IN_API);
  }

  function* fetchPlanningsHostsInFlow() {
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

  function* watchPlanningsHostsInFlow() {
    yield throttle(3000, RoomsTypes.PLANNINGS_HOSTS_IN_FETCH, fetchPlanningsHostsInFlow);
  }

  function* fetchPlanningsHostsOut() {
    return yield call(authRequest, PLANNING_HOSTS_OUT_API);
  }

  function* fetchPlanningsHostsOutFlow() {
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

  function* watchPlanningsHostsOutFlow() {
    yield throttle(3000, RoomsTypes.PLANNINGS_HOSTS_OUT_FETCH, fetchPlanningsHostsOutFlow);
  }

  function* bookmarksSideEffectFlow() {
    try {
      yield put(RoomsActions.updateRoomsIncrement('bookmark'));

    } catch (error) {
      console.log(error)
    }
  }

  function* watchBookmarksAdd() {
    yield takeLatest(RoomsTypes.BOOKMARK_ADD, bookmarksSideEffectFlow);
  }
  function* watchBookmarksRemove() {
    yield takeLatest(RoomsTypes.BOOKMARK_REMOVE, bookmarksSideEffectFlow);
  }
  function* watchBookmarksClear() {
    yield takeLatest(RoomsTypes.BOOKMARKS_CLEAR, bookmarksSideEffectFlow);
  }

  function* optimisticSideEffectFlow() {
    try {
      yield put(RoomsActions.updateRoomsIncrement('optimistic'));
    } catch (error) {
      console.log(error);
    }
  }

  function* watchRoomOptimisticFlow() {
    yield takeLatest(RoomsTypes.ROOM_UPDATE_OPTIMISTIC, optimisticSideEffectFlow);
  }
  function* watchPlanningOptimisticFlow() {
    yield takeLatest(RoomsTypes.PLANNING_UPDATE_OPTIMISTIC, optimisticSideEffectFlow);
  }
  function* watchTaskOptimisticFlow() {
    yield takeLatest(RoomsTypes.TASK_UPDATE_OPTIMISTIC, optimisticSideEffectFlow);
  }
  function* watchExtraOptionOptimisticFlow() {
    yield takeLatest(RoomsTypes.EXTRA_OPTION_UPDATE_OPTIMISTIC, optimisticSideEffectFlow);
  }

  
 

  function* updateBreakfastFlow(data) {
    yield put(OutboundActions.ReservationCameToBreakfastFlow(data));
  }

  function* watchReservationCameToBreakfast(state) {
    yield throttle(3000, RoomsTypes.CAME_TO_BREAKFAST, updateBreakfastFlow);
  }

  const watchers = {
    watchRoomsFlow,
    watchFloorsFlow,
    watchRoomStatusesFlow,
    watchRoomHousekeepingsFlow,
    watchRoomCategoriesFlow,
    watchPlanningsFlow,
    watchAllHotelPlanningsFlow,
    watchFuturePlanningsFlow,
    watchPlanningsNightFlow,
    watchPlanningsRunnerFlow,
    watchCalendarFlow,
    watchRoomNotesFlow,
    watchCatalogsFlow,
    watchLostItemsFlow,
    watchFoundItemsFlow,
    watchTasksFlow,
    watchFutureTasksFlow,
    watchAuditTasksFlow,
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
    watchMessagesFlow,
    watchSocketMessagesFlow,
    watchInspectionPlanningFlow,
    watchReservationCameToBreakfast,
    watchBreakFastLoFlow
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
      fetchAllHotelPlanningsFlow,
      fetchFuturePlannings,
      fetchFuturePlanningsFlow,
      fetchPlanningsNight,
      fetchPlanningsNightFlow,
      fetchPlanningsRunner,
      fetchPlanningsRunnerFlow,
      fetchInspectionPlanningFlow,
      fetchCalendar,
      fetchCalendarFlow,
      fetchRoomNotes,
      fetchRoomNotesFlow,
      fetchRoomCatalogs,
      fetchCatalogs,
      fetchCatalogsFlow,
      fetchLostItems,
      fetchLostItemsFlow,
      fetchFoundItems,
      fetchFoundItemsFlow,
      fetchTasks,
      fetchFutureTasks,
      fetchTasksFlow,
      fetchFutureTasksFlow,
      fetchAudis,
      fetchHistory,
      fetchAudisFlow,
      fetchHistoryFlow,
      fetchGuestBook,
      fetchGuestBookFlow,
      fetchPlanningsHostsIn,
      fetchPlanningsHostsInFlow,
      fetchPlanningsHostsOut,
      fetchPlanningsHostsOutFlow,
      bookmarksSideEffectFlow,
      optimisticSideEffectFlow,
      fetchMessagesFlow,
      socketFetchMessagesFlow,
      updateBreakfastFlow,
      fetchBreakFastLogFlow,
      fetchBreakFastLog
    }
  }
}
