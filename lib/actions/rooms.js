import RoomsTypes from '../constants/rooms';

export function resetRooms() {
  return {
    type: RoomsTypes.RESET_ROOMS
  }
}

export function activateRoom(roomId, tabIndex) {
  return {
    type: RoomsTypes.ROOM_ACTIVATE,
    roomId,
    tabIndex
  }
}

export function updateRoomOptimistic({ roomId, field, value }) {
  return {
    type: RoomsTypes.ROOM_UPDATE_OPTIMISTIC,
    roomId,
    field,
    value
  }
}

export function updateRoom(room) {
  return {
    type: RoomsTypes.ROOM_UPDATE_SUCCESS,
    room
  }
}

export function updateRoomFailure(error) {
  return {
    type: RoomsTypes.ROOM_UPDATE_FAILURE,
    error
  }
}

export function deactivateRoom(roomId) {
  return {
    type: RoomsTypes.ROOM_DEACTIVATE
  }
}

export function roomsFetch(socketData) {
  return {
    type: RoomsTypes.ROOMS_FETCH,
    meta: {
      debounce: {
        time: 1000
      }
    },
    // socketData,
  }
}

export function breakfastFetch() {
  return {
    type: RoomsTypes.BREAKFAST_FETCH,
    meta: {
      debounce: {
        time: 1000
      }
    }
  }
}


export function roomsSuccess({ rooms }) {

  return {
    type: RoomsTypes.ROOMS_SUCCESS,
    rooms
  }
}

export function singleRoomSuccess(room){
  return{
    type: RoomsTypes.SINGLE_ROOM_SUCCESS,
    room
  } 
}

export function roomsFailure(error) {
  return {
    type: RoomsTypes.ROOMS_FAILURE,
    error
  }
}

export function roomsUpdates(updates) {
  return {
    type: RoomsTypes.ROOMS_UPDATES,
    updates
  }
}

export function roomsUpdateRead(updateId) {
  return {
    type: RoomsTypes.ROOMS_UPDATE_READ,
    updateId
  }
}

export function roomsUnblocks(updates) {
  return {
    type: RoomsTypes.ROOMS_UNBLOCKS,
    updates
  }
}

export function roomsUnblocksRead(updateId) {
  return {
    type: RoomsTypes.ROOMS_UNBLOCKS_READ,
    updateId
  }
}

export function floorsFetch() {
  return {
    type: RoomsTypes.FLOORS_FETCH
  }
}

export function floorsSuccess(floors) {

  return {
    type: RoomsTypes.FLOORS_SUCCESS,
    floors
  }
}

export function floorsFailure(error) {

  return {
    type: RoomsTypes.FLOORS_FAILURE,
    error
  }
}

export function roomStatusesFetch() {
  return {
    type: RoomsTypes.ROOM_STATUSES_FETCH
  }
}

export function roomStatusesSuccess(roomStatuses) {

  return {
    type: RoomsTypes.ROOM_STATUSES_SUCCESS,
    roomStatuses
  }
}

export function roomStatusesFailure(error) {

  return {
    type: RoomsTypes.ROOM_STATUSES_FAILURE,
    error
  }
}

export function roomHousekeepingsFetch(socketData) {
  return {
    type: RoomsTypes.ROOM_HOUSEKEEPINGS_FETCH,
    socketData
  }
}

export function roomHousekeepingsSuccess(roomHousekeepings) {

  return {
    type: RoomsTypes.ROOM_HOUSEKEEPINGS_SUCCESS,
    roomHousekeepings
  }
}

export function singleRoomHousekeepingsSuccess(roomHousekeepings) {
  return {
    type: RoomsTypes.SINGLE_ROOM_HOUSEKEEPINGS_SUCCESS,
    roomHousekeepings
  }
}

export function roomHousekeepingsFailure(error) {

  return {
    type: RoomsTypes.ROOM_HOUSEKEEPINGS_FAILURE,
    error
  }
}

export function roomCategoriesFetch() {
  return {
    type: RoomsTypes.ROOM_CATEGORY_FETCH
  }
}

export function roomCategoriesSuccess(roomCategories) {
  return {
    type: RoomsTypes.ROOM_CATEGORY_SUCCESS,
    roomCategories
  }
}

export function roomCategoriesFailure(error) {
  return {
    type: RoomsTypes.ROOM_CATEGORY_FAILURE,
    error
  }
}

export function planningsFetch() {
  return {
    type: RoomsTypes.PLANNINGS_FETCH
  }
}

export function planningsSuccess(plannings) {
  return {
    type: RoomsTypes.PLANNINGS_SUCCESS,
    plannings
  }
}

export function planningsFailure(error) {
  return {
    type: RoomsTypes.PLANNINGS_FAILURE,
    error
  }
}

export function allHotelPlanningsFetch() {
  return {
    type: RoomsTypes.ALL_HOTEL_PLANNINGS_FETCH,
  }
}

export function allHotelPlanningsSuccess(plannings) {
  return {
    type: RoomsTypes.ALL_HOTEL_PLANNINGS_SUCCESS,
    plannings
  }
}

export function allHotelPlanningsFailure(error) {
  return {
    type: RoomsTypes.ALL_HOTEL_PLANNINGS_FAILURE,
    error
  }
}

export function planningsUpdates(updates) {
  return {
    type: RoomsTypes.PLANNINGS_UPDATES,
    updates
  }
}

export function planningsUpdateRead(updateId) {
  return {
    type: RoomsTypes.PLANNINGS_UPDATE_READ,
    updateId
  }
}

export function planningsUpdateOptmistic({ roomId, user, options }) {
  return {
    type: RoomsTypes.PLANNING_UPDATE_OPTIMISTIC,
    roomId,
    user,
    options
  }
}

export function planningsNightFetch() {
  return {
    type: RoomsTypes.PLANNINGS_NIGHT_FETCH
  }
}

export function planningsNightSuccess(planningNights) {

  return {
    type: RoomsTypes.PLANNINGS_NIGHT_SUCCESS,
    planningNights
  }
}

export function planningsNightFailure(error) {

  return {
    type: RoomsTypes.PLANNINGS_NIGHT_FAILURE,
    error
  }
}

export function planningsRunnerFetch() {
  return {
    type: RoomsTypes.PLANNINGS_RUNNER_FETCH
  }
}

export function planningsRunnerSuccess({ planningRunners }) {

  return {
    type: RoomsTypes.PLANNINGS_RUNNER_SUCCESS,
    planningRunners
  }
}

export function planningsRunnerFailure(error) {

  return {
    type: RoomsTypes.PLANNINGS_RUNNER_FAILURE,
    error
  }
}

export function calendarFetch() {
  return {
    type: RoomsTypes.CALENDAR_FETCH
  }
}

export function calendarSuccess(results) {

  return {
    type: RoomsTypes.CALENDAR_SUCCESS,
    results
  }
}

export function calendarFailure(error) {

  return {
    type: RoomsTypes.CALENDAR_FAILURE,
    error
  }
}

export function roomNotesFetch() {
  return {
    type: RoomsTypes.ROOM_NOTES_FETCH
  }
}

export function roomNotesSuccess(results) {

  return {
    type: RoomsTypes.ROOM_NOTES_SUCCESS,
    results
  }
}

export function roomNotesFailure(error) {

  return {
    type: RoomsTypes.ROOM_NOTES_FAILURE,
    error
  }
}

export function catalogsFetch() {
  return {
    type: RoomsTypes.CATALOGS_FETCH
  }
}

export function catalogsSuccess({ catalogs }) {

  return {
    type: RoomsTypes.CATALOGS_SUCCESS,
    catalogs
  }
}

export function catalogsFailure(error) {

  return {
    type: RoomsTypes.CATALOGS_FAILURE,
    error
  }
}

export function lostFetch() {
  return {
    type: RoomsTypes.LOST_FETCH
  }
}

export function lostFetchSuccess({ results }) {
  return {
    type: RoomsTypes.LOST_FETCH_SUCCESS,
    results
  }
}

export function lostFetchFailure(error) {
  return {
    type: RoomsTypes.LOST_FETCH_FAILURE,
    error
  }
}

export function foundFetch() {
  return {
    type: RoomsTypes.FOUND_FETCH
  }
}

export function foundFetchSuccess(results) {
  return {
    type: RoomsTypes.FOUND_FETCH_SUCCESS,
    results
  }
}

export function foundFetchFailure(error) {
  return {
    type: RoomsTypes.FOUND_FETCH_FAILURE,
    error
  }
}

export function tasksFetch(id ,data) {
  return {
    type: RoomsTypes.TASKS_FETCH,
    meta: {
      debounce: {
        time: 1000
      }
    },
    id,
    data
  }
}

export function tasksSuccess(tasks) {

  return {
    type: RoomsTypes.TASKS_SUCCESS,
    tasks
  }
}

export function tasksFailure(error) {

  return {
    type: RoomsTypes.TASKS_FAILURE,
    error
  }
}

export function futureTasksFetch() {
  return {
    type: RoomsTypes.FUTURE_TASKS_FETCH,
    meta: {
      debounce: {
        time: 1000
      }
    }
  }
}

export function futureTasksSuccess(tasks) {

  return {
    type: RoomsTypes.FUTURE_TASKS_SUCCESS,
    tasks
  }
}

export function futureTasksFailure(error) {

  return {
    type: RoomsTypes.FUTURE_TASKS_FAILURE,
    error
  }
}

export function taskUpdateOptimistic({ uuid, update }) {
  return {
    type: RoomsTypes.TASK_UPDATE_OPTIMISTIC,
    uuid,
    update
  }
}

export function taskUpdateSuccess({ task }) {
  return {
    type: RoomsTypes.TASK_UPDATE_SUCCESS,
    task
  }
}

export function taskUpdateFailure(error) {
  return {
    type: RoomsTypes.TASK_UPDATE_FAILURE,
    error
  }
}

export function historyFetch() {
  return {
    type: RoomsTypes.HISTORY_FETCH
  }
}

export function historySuccess({ history }) {
  return {
    type: RoomsTypes.HISTORY_SUCCESS,
    history
  }
}

export function historyFailure(error) {
  return {
    type: RoomsTypes.HISTORY_FAILURE,
    error
  }
}

export function guestBookFetch() {
  return {
    type: RoomsTypes.GUEST_BOOK_FETCH
  }
}

export function guestBookFetchSuccess({ results }) {
  return {
    type: RoomsTypes.GUEST_BOOK_FETCH_SUCCESS,
    results
  }
}

export function guestBookFetchFailure(error) {
  return {
    type: RoomsTypes.GUEST_BOOK_FETCH_FAILURE,
    error
  }
}

export function planningsHostInFetch() {
  return {
    type: RoomsTypes.PLANNINGS_HOSTS_IN_FETCH
  }
}

export function planningsHostInSuccess({ planningHostIns }) {
  return {
    type: RoomsTypes.PLANNINGS_HOSTS_IN_FETCH_SUCCESS,
    planningHostIns
  }
}

export function planningsHostInFailure(error) {
  return {
    type: RoomsTypes.PLANNINGS_HOSTS_IN_FETCH_FAILURE,
    error
  }
}

export function planningsHostOutFetch() {
  return {
    type: RoomsTypes.PLANNINGS_HOSTS_OUT_FETCH
  }
}

export function planningsHostOutSuccess({ planningHostOuts }) {
  return {
    type: RoomsTypes.PLANNINGS_HOSTS_OUT_FETCH_SUCCESS,
    planningHostOuts
  }
}

export function planningsHostOutFailure(error) {
  return {
    type: RoomsTypes.PLANNINGS_HOSTS_OUT_FETCH_FAILURE,
    error
  }
}

export function bookmarkAdd(roomId) {
  return {
    type: RoomsTypes.BOOKMARK_ADD,
    roomId
  }
}

export function bookmarkRemove(roomId) {
  return {
    type: RoomsTypes.BOOKMARK_REMOVE,
    roomId
  }
}

export function bookmarksClear() {
  return {
    type: RoomsTypes.BOOKMARKS_CLEAR
  }
}

export function updateExtraOptionOptimistic({ roomId, label, isCompleted }) {
  return {
    type: RoomsTypes.EXTRA_OPTION_UPDATE_OPTIMISTIC,
    roomId,
    label,
    isCompleted
  }
}

export function updateRoomsIncrement(source) {
  return {
    type: RoomsTypes.UPDATE_ROOMS_INCREMENT,
    meta: {
      debounce: {
        time: 1000
      }
    }
  }
}

export function roomMessagesFetch() {
  return {
    type: RoomsTypes.ROOM_MESSAGES_FETCH
  }
}

export function messageSuccess(results) {

  return {
    type: RoomsTypes.ROOM_MESSAGES_SUCCESS,
    messages: results
  }
}

export function roomInspectionCleanFetch() {
  return {
    type: RoomsTypes.ROOM_INSPECTION_CLEAN_FETCH
  }
}

export function inspectionCleanSuccess(results) {

  return {
    type: RoomsTypes.ROOM_INSPECTION_CLEAN_SUCCESS,
    results
  }
}

export function futurePlanningsFetch() {
  return {
    type: RoomsTypes.FUTURE_PLANNINGS_FETCH
  }
}

export function futurePlanningsSuccess(plannings) {
  return {
    type: RoomsTypes.FUTURE_PLANNINGS_SUCCESS,
    plannings
  }
}

export function futurePlanningsFailure(error) {
  return {
    type: RoomsTypes.FUTURE_PLANNINGS_FAILURE,
    error
  }
}

export function auditsFetch() {
  return {
    type: RoomsTypes.AUDIT_FETCH,
    meta: {
      debounce: {
        time: 1000
      }
    }
  }
}

export function auditSuccess(audits) {

  return {
    type: RoomsTypes.AUDIT_SUCCESS,
    audits
  }
}

export function auditFailure(error) {

  return {
    type: RoomsTypes.AUDIT_FAILURE,
    error
  }
}

export function setSecondaryCleaning(value) {

  return {
    type: RoomsTypes.SET_SECONDARY_CLEANING,
    value
  }
}

export function isSocketFireOnUpdateInspection({isFire}) {
  return {
    type: RoomsTypes.IS_SOCKET_FIRE_ON_UPDATE_INSPECTION,
    isFire
  }
}

export function setTaskSocketData(data) {
  return {
    type: RoomsTypes.SET_TASK_SOCKET_DATA,
    data
  }
}
export function fetchBreakfastSuccess(breakfast) {
  return {
    type: RoomsTypes.GET_BREAKFAST_SUCCESS,
    breakfast
  }
}
export function fetchBreakfastFailure(error) {
  return {
    type: RoomsTypes.GET_BREAKFAST_FAILURE,
    error
  }
}

export function guestCameToBreakFast(data) {
  return {
    type: RoomsTypes.CAME_TO_BREAKFAST,
    reservationId: data.reservationId,
    numberOfGuests: data.numberOfGuests,
    meta: {
      debounce: {
        time: 250
      }
    }
  }
}


export default {
  resetRooms,
  roomsFetch,
  roomsSuccess,
  singleRoomSuccess,
  roomsFailure,
  roomsUpdates,
  roomsUpdateRead,
  roomsUnblocks,
  roomsUnblocksRead,
  updateRoomOptimistic,
  updateRoom,
  floorsFetch,
  floorsSuccess,
  floorsFailure,
  roomStatusesFetch,
  roomStatusesSuccess,
  roomStatusesFailure,
  roomHousekeepingsFetch,
  roomHousekeepingsSuccess,
  singleRoomHousekeepingsSuccess,
  roomHousekeepingsFailure,
  roomCategoriesFetch,
  roomCategoriesSuccess,
  roomCategoriesFailure,
  planningsFetch,
  planningsSuccess,
  planningsFailure,
  planningsUpdateOptmistic,
  planningsNightFetch,
  planningsNightSuccess,
  planningsNightFailure,
  planningsRunnerFetch,
  planningsRunnerSuccess,
  planningsRunnerFailure,
  planningsUpdates,
  planningsUpdateRead,
  calendarFetch,
  calendarSuccess,
  calendarFailure,
  roomNotesFetch,
  roomNotesSuccess,
  roomNotesFailure,
  catalogsFetch,
  catalogsSuccess,
  catalogsFailure,
  lostFetch,
  lostFetchSuccess,
  lostFetchFailure,
  foundFetch,
  foundFetchSuccess,
  foundFetchFailure,
  tasksFetch,
  tasksSuccess,
  tasksFailure,
  futureTasksFetch,
  futureTasksSuccess,
  futurePlanningsFailure,
  taskUpdateOptimistic,
  taskUpdateSuccess,
  taskUpdateFailure,
  historyFetch,
  historySuccess,
  historyFailure,
  guestBookFetch,
  guestBookFetchSuccess,
  guestBookFetchFailure,
  planningsHostInFetch,
  planningsHostInSuccess,
  planningsHostInFailure,
  planningsHostOutFetch,
  planningsHostOutSuccess,
  planningsHostOutFailure,
  activateRoom,
  deactivateRoom,
  bookmarkAdd,
  bookmarkRemove,
  bookmarksClear,
  updateExtraOptionOptimistic,
  updateRoomsIncrement,
  roomMessagesFetch,
  messageSuccess,
  roomInspectionCleanFetch,
  inspectionCleanSuccess,
  futurePlanningsFetch,
  futurePlanningsSuccess,
  futurePlanningsFailure,
  auditsFetch,
  auditSuccess,
  auditFailure,
  setSecondaryCleaning,
  isSocketFireOnUpdateInspection,
  setTaskSocketData,
  guestCameToBreakFast,
  breakfastFetch,
  fetchBreakfastSuccess,
  fetchBreakfastFailure,
  allHotelPlanningsFetch,
  allHotelPlanningsSuccess,
  allHotelPlanningsFailure
}
