import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import { findIndex } from 'lodash/array';
import { extend, filter, pick } from 'lodash/object';
import { uniq, get } from 'lodash/object';

import RoomsTypes from '../constants/rooms';
import AvailHotelTaskTypes from '../constants/hotelsTask'
import OutboundTypes from '../constants/outbound';
import _ from "lodash"
// export const INITIAL_STATE = Immutable({
//   activeRoom: null,
//   tabIndex: 0,
//   hotelRooms: [],
//   hotelFloors: [],
//   hotelRoomStatuses: [],
//   hotelRoomHousekeepings: [],
//   hotelRoomCategories: [],
//   hotelCalendar: [],
//   hotelPlannings: [],
//   hotelPlanningsNight: [],
//   hotelPlanningsRunner: [],
//   hotelRoomNotes: [],
//   hotelCatalogs: [],
//   hotelTasks: [],
//   hotelHistory: [],
//   bookmarks: []
// });

const getInitialState = () => ({
  activeRoom: null,
  tabIndex: 0,
  hotelRooms: [],
  hotelFloors: [],
  hotelRoomStatuses: [],
  hotelRoomHousekeepings: [],
  hotelRoomCategories: [],
  hotelCalendar: [],
  hotelMessages: [],
  hotelInspectionRoom: [],
  hotelPlannings: [],
  hotelFuturePlannings: [],
  hotelPlanningsNight: [],
  hotelPlanningsRunner: [],
  hotelRoomNotes: [],
  hotelCatalogs: [],
  hotelTasks: [],
  hotelFutureTasks: [],
  hotelHistory: [],
  hotelGuestBook: [],
  hotelPlanningsHostsIn: [],
  hotelPlanningsHostsOut: [],
  hotelLostItems: [],
  hotelFoundItems: [],
  bookmarks: [],
  updatesCount: 0,
  audits: [],
  taskSocket: [],
  isFilterVisible: true,
  isSocketFireOnInspectionUpdate: true,
  cameToBreakFast: [],
  hotelRoomsId: [],
  hotelCalendarId: [],
  hotelBreakfastPackage: [],
  updatedBreakfastArray:[],
  allHotelPlannings:[],
  socketFireDateTime: "",
  isLoading: false,
  socketData: [],

  isRoomLoading: false,
  roomFailure:null,

  taskFailure:null
});

const ACTION_HANDLERS = {
  [RoomsTypes.RESET_ROOMS]: (state) => {
    return getInitialState();
  },
  [RoomsTypes.ROOM_ACTIVATE]: (state, { roomId, tabIndex }) => {
    // return state.set('activeRoom', roomId).set('tabIndex', tabIndex || 0)
    return {
      ...state,
      activeRoom: roomId,
      tabIndex: tabIndex || 0
    }
  },
  [RoomsTypes.IS_SOCKET_FIRE_ON_UPDATE_INSPECTION]: (state, { isFire }) => {
    return {
      ...state,
      isSocketFireOnInspectionUpdate: isFire
    }
  },

  [RoomsTypes.SOCKET_FIRE_DATE_TIME]: (state, { payload }) => {
    let dateTime = get(payload , "dateTime" , "")
    return {
      ...state,
      socketFireDateTime: dateTime
    }
  },

  [RoomsTypes.SOCKET_LIST]: (state, action) => {
    return {
      ...state,
      socketData: [action.payload, ...state.socketData]
    }
  },

  [RoomsTypes.SOCKET_FIRE_LOADER]: (state, { isLoading }) => {
    return {
      ...state,
      isLoading: isLoading
    }
  },

  [RoomsTypes.ROOM_DEACTIVATE]: (state) => {
    // return state.set('activeRoom', null);
    return {
      ...state,
      activeRoom: null
    }
  },
  [RoomsTypes.ROOMS_SUCCESS]: (state, { rooms }) => {
    // return state.set('hotelRooms', rooms);
    // console.time('ROOMS_SUCCESS')
    // const newState = state.set('hotelRooms', rooms);
    // console.timeEnd('ROOMS_SUCCESS')
    // return newState;
    const hotelRoomsId = rooms.map((data) =>{
      return data.id
    })
    return {
      ...state,
      hotelRooms: rooms,
      hotelRoomsId: hotelRoomsId
    }
  },

  [RoomsTypes.SINGLE_ROOM_SUCCESS]: (state, {room}) =>{
    let singleRoom = !_.isEmpty(room.rooms) ? get(room.rooms, 0, {}) : {}
    const hotelRooms = state.hotelRooms
    .map(hotelRoom => hotelRoom.id !== singleRoom.id ? hotelRoom : singleRoom)
  
    return{
      ...state,
      hotelRooms: hotelRooms
    }
  },

  [RoomsTypes.ROOMS_FAILURE]: (state, {error}) =>{
    return{
      ...state,
      roomFailure: error
    }
  },
  [RoomsTypes.FETCH_ROOM_LOADER]: (state, { isRoomLoading }) => {
    return {
      ...state,
      isRoomLoading: isRoomLoading
    }
  },
  [RoomsTypes.ROOM_UPDATE_OPTIMISTIC]: (state, { roomId, field, value }) => {
    const foundIndex = findIndex(state.hotelRooms, { 'id': roomId });
    if (foundIndex === -1) {
      // return state;
      return { ...state }
    }

    // return state.setIn(['hotelRooms', foundIndex, field], value);
    const room = {
      ...state.hotelRooms[foundIndex],
      [field]: value
    }

    const hotelRooms = state.hotelRooms
      .map(hotelRoom => hotelRoom.id !== room.id ? hotelRoom : room)

    const hotelRoomHousekeepings = state.hotelRoomHousekeepings.
      map(housekeeping => housekeeping.roomId !== room.id ? housekeeping : {...housekeeping, attendantStatus: value})
    return {
      ...state,
      hotelRooms,
      hotelRoomHousekeepings
    }
  },
  [RoomsTypes.ROOM_UPDATE_SUCCESS]: (state, { room }) => {
    const foundIndex = findIndex(state.hotelRooms, { '_id': room._id });
    if (foundIndex === -1) {
      // return state;
      return { ...state }
    }

    // return state.setIn(['hotelRooms', foundIndex], room);
    const hotelRooms = state.hotelRooms
      .map(hotelRoom => hotelRoom._id !== room._id ? hotelRoom : room)

    return {
      ...state,
      hotelRooms
    }
  },
  [RoomsTypes.FLOORS_SUCCESS]: (state, { floors }) => {
    // return state.set('hotelFloors', floors);
    return {
      ...state,
      hotelFloors: floors
    }
  },
  [RoomsTypes.ROOM_STATUSES_SUCCESS]: (state, { roomStatuses }) => {
    // return state.set('hotelRoomStatuses', roomStatuses);
    return {
      ...state,
      hotelRoomStatuses: roomStatuses
    }
  },
  [RoomsTypes.ROOM_HOUSEKEEPINGS_SUCCESS]: (state, { roomHousekeepings }) => {
    // return state.set('hotelRoomHousekeepings', roomHousekeepings);
    const newArray = !_.isEmpty(roomHousekeepings) && roomHousekeepings.map((item) => {
      return{...item, turndownService: item.attendantStatusNight}
    })

    return {
      ...state,
      hotelRoomHousekeepings: newArray
    }
  },

  [RoomsTypes.SINGLE_ROOM_HOUSEKEEPINGS_SUCCESS]: (state, {roomHousekeepings} ) => {
    let singleRoomHousekeeping = !_.isEmpty(roomHousekeepings) ? get(roomHousekeepings, 0, {}) : {}

    const filterRoomHousekeepings = state.hotelRoomHousekeepings
    .map(housekeeping => housekeeping.id !== singleRoomHousekeeping.id ? housekeeping : {...singleRoomHousekeeping, turndownService:singleRoomHousekeeping.attendantStatusNight})

    // const filterRoomHousekeepings = state.hotelRoomHousekeepings
    // .map(housekeeping => housekeeping.id !== singleRoomHousekeeping.id ? housekeeping : {...singleRoomHousekeeping, attendantStatus: "finish"})
    return {
      ...state,
      hotelRoomHousekeepings: filterRoomHousekeepings
    }
  },

  [RoomsTypes.ROOM_CATEGORY_SUCCESS]: (state, { roomCategories }) => {
    // return state.set('hotelRoomCategories', roomCategories);
    return {
      ...state,
      hotelRoomCategories: roomCategories
    }
  },
  [RoomsTypes.CALENDAR_SUCCESS]: (state, { results }) => {
    // return state.set('hotelCalendar', results);
    const hotelCalendarId = results.map((data) =>{
      return data.id
    })
    return {
      ...state,
      hotelCalendar: results,
      hotelCalendarId:hotelCalendarId
    }
  },
  [RoomsTypes.PLANNINGS_SUCCESS]: (state, { plannings }) => {
    // return state.set('hotelPlannings', plannings);
    return {
      ...state,
      hotelPlannings: plannings
    }
  },
  [RoomsTypes.ALL_HOTEL_PLANNINGS_SUCCESS]: (state, { plannings }) => {
    return {
      ...state,
      allHotelPlannings: plannings
    }
  },
  [RoomsTypes.FUTURE_PLANNINGS_SUCCESS]: (state, { plannings }) => {
    return {
      ...state,
      hotelFuturePlannings: plannings
    }
  },
  [RoomsTypes.PLANNING_UPDATE_OPTIMISTIC]: (state, { roomId, user, options }) => {
    // const foundIndex = findIndex(state.hotelPlannings, { '_id': roomId });
    // let planning;
    // if (foundIndex > -1) {
    //   planning = state.hotelPlannings[foundIndex];
    //   planning.planning_user_id = user && user._id || null;
    // } else {
    //   planning = {
    //     planning_user_id: user && user._id || null,
    //     room_id: roomId,
    //     is_optimistic: true
    //   }
    // }
    // if (options) {
    //   planning = extend({}, planning, options);
    // }

    // if (foundIndex > -1) {
    //   return state.setIn(['hotelPlannings', foundIndex], planning);
    // } else {
    //   let plannings = state.hotelPlannings.asMutable();
    //   plannings.push(planning);
    //   return state.set('hotelPlannings', plannings);
    // }

    if (options && options.guest_status === "weekly") {
      options.guest_status = "stay";
    }

    const foundIndex = findIndex(state.hotelPlannings, { '_id': roomId });
    let planning;
    if (foundIndex > -1) {
      planning = state.hotelPlannings[foundIndex];
      planning.planning_user_id = user && user._id || null;
    } else {
      planning = {
        planning_user_id: user && user._id || null,
        room_id: roomId,
        is_optimistic: true
      }
    }
    if (options) {
      planning = extend({}, planning, options);
    }

    if (foundIndex > -1) {
      // return state.setIn(['hotelPlannings', foundIndex], planning);
      const hotelPlannings = state.hotelPlannings
        .map(hotelPlanning => hotelPlanning.room_id !== roomId ? hotelPlanning : planning);

      return {
        ...state,
        hotelPlannings
      }
    } else {
      // let plannings = state.hotelPlannings.asMutable();
      // plannings.push(planning);
      // return state.set('hotelPlannings', plannings);
      return {
        ...state,
        hotelPlannings: [
          ...state.hotelPlannings,
          planning
        ]
      }
    }
  },
  [RoomsTypes.PLANNINGS_NIGHT_SUCCESS]: (state, { planningNights }) => {
    // return state.set('hotelPlanningsNight', planningsNight);

    return {
      ...state,
      hotelPlanningsNight: planningNights
    }
  },
  [RoomsTypes.PLANNINGS_RUNNER_SUCCESS]: (state, { planningRunners }) => {
    // return state.set('hotelPlanningsRunner', planningRunners);
    return {
      ...state,
      hotelPlanningsRunner: planningRunners
    }
  },
  [RoomsTypes.ROOM_NOTES_SUCCESS]: (state, { results }) => {
    // return state.set('hotelRoomNotes', results);
    return {
      ...state,
      hotelRoomNotes: results
    }
  },
  [RoomsTypes.CATALOGS_SUCCESS]: (state, { catalogs }) => {
    // return state.set('hotelCatalogs', catalogs);
    return {
      ...state,
      hotelCatalogs: catalogs
    }
  },
  [RoomsTypes.LOST_FETCH_SUCCESS]: (state, { results }) => {
    return {
      ...state,
      hotelLostItems: results
    }
  },
  [RoomsTypes.FOUND_FETCH_SUCCESS]: (state, { results }) => {
    return {
      ...state,
      hotelFoundItems: results
    }
  },
  [RoomsTypes.TASKS_SUCCESS]: (state, { tasks }) => {
    // return state.set('hotelTasks', tasks);
    return {
      ...state,
      hotelTasks: tasks
    }
  },
  [RoomsTypes.TASKS_FAILURE]: (state, {error}) =>{
    return{
      ...state,
      taskFailure: error
    }
  },
  [RoomsTypes.FUTURE_TASKS_SUCCESS]: (state, { tasks }) => {
    // return state.set('hotelTasks', tasks);
    return {
      ...state,
      hotelFutureTasks: tasks
    }
  },
  [RoomsTypes.TASK_UPDATE_OPTIMISTIC]: (state, { uuid, update }) => {
    const foundIndex = findIndex(state.hotelTasks, { 'uuid': uuid });
    if (foundIndex === -1) {
      // return state;
      return { ...state }
    }

    // return state.setIn(['hotelTasks', foundIndex], update);
    const hotelTasks = state.hotelTasks
      .map(hotelTask => hotelTask.uuid !== uuid ? hotelTask : update);

    return {
      ...state,
      hotelTasks
    }
  },
  [RoomsTypes.TASK_UPDATE_SUCCESS]: (state, { task }) => {
    const foundIndex = findIndex(state.hotelTasks, { 'uuid': task.uuid });
    if (foundIndex === -1) {
      // return state;
      return { ...state }
    }

    // return state.setIn(['hotelTasks', foundIndex], task);
    const hotelTasks = state.hotelTasks
      .map(hotelTask => hotelTask.uuid !== uuid ? hotelTask : task);

    return {
      ...state,
      hotelTasks
    }
  },
  [RoomsTypes.HISTORY_SUCCESS]: (state, { history }) => {
    // return state.set('hotelHistory', history);
    return {
      ...state,
      hotelHistory: history
    }
  },
  [RoomsTypes.GUEST_BOOK_FETCH_SUCCESS]: (state, { results }) => {
    return {
      ...state,
      hotelGuestBook: results
    }
  },
  [RoomsTypes.PLANNINGS_HOSTS_IN_FETCH_SUCCESS]: (state, { planningHostIns }) => {
    return {
      ...state,
      hotelPlanningsHostsIn: planningHostIns
    }
  },
  [RoomsTypes.PLANNINGS_HOSTS_OUT_FETCH_SUCCESS]: (state, { planningHostOuts }) => {
    return {
      ...state,
      hotelPlanningsHostsOut: planningHostOuts
    }
  },
  [RoomsTypes.BOOKMARK_ADD]: (state, { roomId }) => {
    // return state.update('bookmarks', (prev, add) => prev.concat([add]), roomId);
    return {
      ...state,
      bookmarks: [
        ...state.bookmarks,
        roomId
      ]
    }
  },
  [RoomsTypes.BOOKMARK_REMOVE]: (state, { roomId }) => {
    // return state.update('bookmarks', (prev, remove) => prev.filter(i => i !== remove), roomId);
    return {
      ...state,
      bookmarks: state.bookmarks.filter(i => i !== roomId)
    }
  },
  [RoomsTypes.BOOKMARKS_CLEAR]: (state) => {
    // return state.set('bookmarks', []);
    return {
      ...state,
      bookmarks: []
    }
  },
  [RoomsTypes.EXTRA_OPTION_UPDATE_OPTIMISTIC]: (state, { roomId, label, isCompleted }) => {
    const foundIndex = findIndex(state.hotelRooms, { '_id': roomId });
    if (foundIndex === -1) {
      // return state;
      return { ...state }
    }

    return { ...state }

    // return state.setIn(['hotelRooms', foundIndex], room);
    const hotelRooms = state.hotelRooms
      .map(hotelRoom => {
        if (hotelRoom._id !== roomId) {
          return hotelRoom;
        }

        hotelRoom.extras = (hotelRoom.extras || []).map(extra => {
          if (extra.label !== label) {
            return extra;
          }

          extra.isCompleted = isCompleted;
          return extra;
        })

        return hotelRoom;
      });

    return {
      ...state,
      hotelRooms
    }
  },
  [RoomsTypes.UPDATE_ROOMS_INCREMENT]: (state, action) => {
    const updatesCount = (state.updatesCount || 0) + 1;

    return {
      ...state,
      updatesCount
    }
  },
  [OutboundTypes.OUTBOUND_ROOM_UPDATE_SUCCESS]: (state, action) => {
    const { payload, meta } = action;
    const { id: roomId, housekeepingStatus, roomStatus, attendantStatus } = payload;
    const allowed = ['housekeepingStatus', 'roomStatus'];
    const updateHousekeepingStatus = {...housekeepingStatus, attendantStatus: attendantStatus}
    const updatedRoomObj = Object.fromEntries(
      Object.entries(payload).filter(([key, value]) => !allowed.includes(key))
    );

    const room = {
      ...updatedRoomObj,
      'attendantStatus': meta.attendantStatus
    }
    const hotelRooms = state.hotelRooms
      .map(hotelRoom => hotelRoom.id !== roomId ? hotelRoom : { ...hotelRoom, attendantStatus: attendantStatus })

    const hotelRoomHousekeepings = state.hotelRoomHousekeepings
      .map(hotelRoomHousekeepings => hotelRoomHousekeepings.id !== roomId ? hotelRoomHousekeepings : updateHousekeepingStatus)
      // const hotelRoomStatuses = state.hotelRoomStatuses
      // .map(hotelRoomStatuses => hotelRoomStatuses.id !== roomId ? hotelRoomStatuses : roomStatus)
      let hotelRoomStatuses = []
      if (roomStatus) {
        hotelRoomStatuses = state.hotelRoomStatuses
          .map(hotelRoomStatuses => hotelRoomStatuses.id !== roomId ? hotelRoomStatuses : roomStatus)
      }
      else {
        hotelRoomStatuses = state.hotelRoomStatuses
      }

    return {
      ...state,
      hotelRooms,
      hotelRoomHousekeepings,
      hotelRoomStatuses
    }
  },
  // [OutboundTypes.OUTBOUND_TASK_DEPARTURE_SUCCESS]: (state, action) => {
  //   const { payload, meta } = action;
  //   console.log("action OUTBOUND_TASK_DEPARTURE_SUCCESS",action);
  //   console.log("payload OUTBOUND_TASK_DEPARTURE_SUCCESS",payload);
  // },
  // [OutboundTypes.OUTBOUND_TASK_UPDATE_BATCH_SUCCESS]: (state, action) => {
  //     const { payload, meta } = action;
  //     console.log("action OUTBOUND_TASK_UPDATE_BATCH_SUCCESS",action);
  //     console.log("payload OUTBOUND_TASK_UPDATE_BATCH_SUCCESS",payload);
  // },
  
  
  [OutboundTypes.OUTBOUND_INVENTORY_CONFIRM_ASSET_CONSUMATION_SUCCESS]: (state, action) => {
    const { confirmAssetPayload } = action.meta
    const hotelRooms = state.hotelRooms
      .map(hotelRoom => hotelRoom.id !== confirmAssetPayload.roomId ? hotelRoom : { ...hotelRoom, isRoomRestocked: confirmAssetPayload.isRestocked })

    return {
      ...state,
      hotelRooms
    }
  },
  [OutboundTypes.OUTBOUND_FOUND_UPDATE_PHOTO_SUCCESS]: (state, action) => {

    const { payload, meta } = action;
    const foundItems = state.hotelFoundItems
      .map(found => found.id !== meta?.objectToSend?.id ? found : { ...found, image_urls: meta?.objectToSend?.photoUrls })
    return {
      ...state,
      hotelFoundItems: foundItems
    }
  },
  [OutboundTypes.OUTBOUND_NIGHTLY_PLANNING_STATUS_UPDATE_SUCCESS]: (state, action) => {
    const { payload, meta } = action;
    const { id: roomId, housekeepingStatus, roomStatus } = payload;
    const turnDownStatus = get(meta, 'turnDownPayload.status', "");

    const allowed = ['housekeepingStatus', 'roomStatus'];
    const updatedRoomObj = Object.fromEntries(
      Object.entries(payload).filter(([key, value]) => !allowed.includes(key))
    );

    const room = {
      ...updatedRoomObj,
      'attendantStatus': meta.attendantStatus
    }

    const hotelRooms = state.hotelRooms
      .map(hotelRoom => hotelRoom.id !== roomId ? hotelRoom : { ...hotelRoom, turndownService: turnDownStatus })

    const hotelRoomHousekeepings = state.hotelRoomHousekeepings
      .map(hotelRoomHousekeepings => hotelRoomHousekeepings.id !== roomId ? hotelRoomHousekeepings : {...housekeepingStatus, turndownService: turnDownStatus})

    const hotelRoomStatuses = state.hotelRoomStatuses
      .map(hotelRoomStatuses => hotelRoomStatuses.id !== roomId ? hotelRoomStatuses : roomStatus)

    return {
      ...state,
      hotelRooms,
      hotelRoomHousekeepings,
      hotelRoomStatuses
    }
  },
  [OutboundTypes.OUTBOUND_ROOM_HOUSEKEEPING_UPDATE_SUCCESS]: (state, action) => {
    const { payload, meta } = action;
    const { id: roomId, housekeepingStatus, roomStatus, attendantStatus } = payload;
    // const updateHouseStatus = {...housekeepingStatus, attendantStatus: "finish"}
    const updateHousekeepingStatus = {...housekeepingStatus, attendantStatus: attendantStatus}
    const hotelRoomHousekeepings = state.hotelRoomHousekeepings
      .map(hotelRoomHousekeepings => hotelRoomHousekeepings.id !== roomId ? hotelRoomHousekeepings : updateHousekeepingStatus)

    let hotelRoomStatuses = []
    if (roomStatus) {
      hotelRoomStatuses = state.hotelRoomStatuses
        .map(hotelRoomStatuses => hotelRoomStatuses.id !== roomId ? hotelRoomStatuses : roomStatus)
    }
    else {
      hotelRoomStatuses = state.hotelRoomStatuses
    }

    return {
      ...state,
      // hotelRoomHousekeepings,
      hotelRoomStatuses
    }
  },
  [OutboundTypes.OUTBOUND_LOCATOR_STATUS_SUCCESS]: (state, action) => {
    const { payload, meta } = action;
    const hotelRoom = state.hotelRooms
      .map(room => room.id !== meta?.guestArray?.roomId ? room : { ...room, isGuestIn: !room.isGuestIn })

    return {
      ...state,
      hotelRooms: hotelRoom
    }
  },
  [RoomsTypes.ROOM_MESSAGES_SUCCESS]: (state, { messages }) => {

    return {
      ...state,
      hotelMessages: messages
    }
  },
  [RoomsTypes.ROOM_INSPECTION_CLEAN_SUCCESS]: (state, { results }) => {

    return {
      ...state,
      hotelInspectionRoom: results
    }
  },
  [RoomsTypes.AUDIT_SUCCESS]: (state, { audits }) => {
    return {
      ...state,
      audits: audits
    }
  },

  [RoomsTypes.SET_SECONDARY_CLEANING]: (state, { value }) => {
    return {
      ...state,
      isFilterVisible: value
    }
  },

  [RoomsTypes.SET_TASK_SOCKET_DATA]: (state, { data }) => {
    return {
      ...state,
      taskSocket: _.isEmpty(data) ? [] : [...data, ...state.taskSocket]
    }
  },

  [RoomsTypes.CAME_TO_BREAKFAST]: (state, { reservationId, numberOfGuests  }) => { 
    return {
      ...state,
      cameToBreakFast: [{reservationId: reservationId,numberOfGuests: numberOfGuests}],
      updatedBreakfastArray: [...state.updatedBreakfastArray, {reservationId: reservationId,numberOfGuests: numberOfGuests}]
    }
  },

  [RoomsTypes.RESERVATION_CAME_TO_BREAKFAST_SUCCESS]: (state, action) => {
    const { payload, meta } = action;
    return {
      ...state,
      // hotelRooms,
      // hotelRoomHousekeepings,
      // hotelRoomStatuses
    }
  },

  [RoomsTypes.GET_BREAKFAST_SUCCESS]: (state, { breakfast }) => {
    let newBreakfast =  []
    !_.isEmpty(breakfast) && breakfast.map((data) =>{
      newBreakfast.push({reservationId:data.reservationId, numberOfGuests: data.numberOfGuests})
    })
    return {
      ...state,
      hotelBreakfastPackage: breakfast,
      updatedBreakfastArray: newBreakfast
    }
  },
}

export default createReducer(getInitialState(), ACTION_HANDLERS);
