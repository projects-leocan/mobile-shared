import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import { findIndex } from 'lodash/array';
import { extend, filter, pick } from 'lodash/object';
import { uniq, get } from 'lodash/object';

import RoomsTypes from '../constants/rooms';
import OutboundTypes from '../constants/outbound';

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
  hotelHistory: [],
  hotelGuestBook: [],
  hotelPlanningsHostsIn: [],
  hotelPlanningsHostsOut: [],
  hotelLostItems: [],
  hotelFoundItems: [],
  bookmarks: [],
  updatesCount: 0,
  audits: []
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

    return {
      ...state,
      hotelRooms: rooms
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

    // console.log(room)
    const hotelRooms = state.hotelRooms
      .map(hotelRoom => hotelRoom.id !== room.id ? hotelRoom : room)

    return {
      ...state,
      hotelRooms
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
    return {
      ...state,
      hotelRoomHousekeepings: roomHousekeepings
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
    return {
      ...state,
      hotelCalendar: results
    }
  },
  [RoomsTypes.PLANNINGS_SUCCESS]: (state, { plannings }) => {
    // return state.set('hotelPlannings', plannings);
    return {
      ...state,
      hotelPlannings: plannings
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
    const { id: roomId, housekeepingStatus, roomStatus } = payload;

    const allowed = ['housekeepingStatus', 'roomStatus'];

    const updatedRoomObj = Object.fromEntries(
      Object.entries(payload).filter(([key, value]) => !allowed.includes(key))
    );

    const room = {
      ...updatedRoomObj,
      'attendantStatus': meta.attendantStatus
    }

    // const hotelRooms = state.hotelRooms
    //   .map(hotelRoom => hotelRoom.id !== roomId ? hotelRoom : room)
    const hotelRooms = state.hotelRooms
      .map(hotelRoom => hotelRoom.id !== roomId ? hotelRoom : { ...hotelRoom, attendantStatus: meta.attendantStatus })

    const hotelRoomHousekeepings = state.hotelRoomHousekeepings
      .map(hotelRoomHousekeepings => hotelRoomHousekeepings.id !== roomId ? hotelRoomHousekeepings : housekeepingStatus)

    const hotelRoomStatuses = state.hotelRoomStatuses
      .map(hotelRoomStatuses => hotelRoomStatuses.id !== roomId ? hotelRoomStatuses : roomStatus)

    return {
      ...state,
      hotelRooms,
      hotelRoomHousekeepings,
      hotelRoomStatuses
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
      .map(hotelRoomHousekeepings => hotelRoomHousekeepings.id !== roomId ? hotelRoomHousekeepings : housekeepingStatus)

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
    const { id: roomId, housekeepingStatus, roomStatus } = payload;

    const hotelRoomHousekeepings = state.hotelRoomHousekeepings
      .map(hotelRoomHousekeepings => hotelRoomHousekeepings.id !== roomId ? hotelRoomHousekeepings : housekeepingStatus)

    const hotelRoomStatuses = state.hotelRoomStatuses
      .map(hotelRoomStatuses => hotelRoomStatuses.id !== roomId ? hotelRoomStatuses : roomStatus)

    return {
      ...state,
      hotelRoomHousekeepings,
      hotelRoomStatuses
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
}

export default createReducer(getInitialState(), ACTION_HANDLERS);
