import UpdatesTypes from '../constants/updates';
import moment from 'moment';

export function adjustInventory({ assetRoomId, roomId }) {
  return {
    type: UpdatesTypes.INVENTORY_ADJUST,
    assetRoomId,
    roomId
  }
}

export function rejectInventory({ assetRoomId, roomId }) {
  return {
    type: UpdatesTypes.INVENTORY_REJECT,
    assetRoomId,
    roomId
  }
}

export function resetInventory({ assetRoomId, roomId }) {
  return {
    type: UpdatesTypes.INVENTORY_RESET,
    assetRoomId,
    roomId
  }
}

export function flushInventory({ roomId }) {
  return {
    type: UpdatesTypes.INVENTORY_FLUSH,
    roomId
  }
}

export function restockInventory({ assetRoomId, id }) {
  return {
    type: UpdatesTypes.INVENTORY_RESTOCK,
    assetRoomId,
    id
  }
}

export function roomCleanStart(roomId) {
  return {
    type: UpdatesTypes.ROOM_CLEAN_START,
    roomId,
    status: 'cleaning',
    tapTs: moment().unix()
  }
}

export function roomCleanRestart(roomId) {
  return {
    type: UpdatesTypes.ROOM_CLEAN_RESTART,
    roomId,
    status: 'cleaning',
    tapTs: moment().unix()
  }
}

export function roomCleanPause(roomId) {
  return {
    type: UpdatesTypes.ROOM_CLEAN_PAUSE,
    roomId,
    status: 'paused',
    tapTs: moment().unix()
  }
}

export function roomCleanUnpause(roomId) {
  return {
    type: UpdatesTypes.ROOM_CLEAN_UNPAUSE,
    roomId,
    status: 'cleaning',
    tapTs: moment().unix()
  }
}

export function roomCleanFinish(roomId) {
  return {
    type: UpdatesTypes.ROOM_CLEAN_FINISH,
    roomId,
    status: 'finish',
    tapTs: moment().unix()
  }
}

export function roomCleanFlush(roomId) {
  return {
    type: UpdatesTypes.ROOM_CLEAN_FLUSH,
    roomId,
    tapTs: moment().unix()
  }
}

export function roomDelay(roomId) {
  return {
    type: UpdatesTypes.ROOM_DELAY,
    roomId,
    status: 'delay',
    tapTs: moment().unix()
  }
}

export function roomDND(roomId) {
  return {
    type: UpdatesTypes.ROOM_DND,
    roomId,
    status: 'dnd',
    tapTs: moment().unix()
  }
}

export function roomRefuse(roomId) {
  return {
    type: UpdatesTypes.ROOM_REFUSE,
    roomId,
    status: 'refuse',
    tapTs: moment().unix()
  }
}

export function roomVoucher(roomId) {
  return {
    type: UpdatesTypes.ROOM_VOUCHER,
    roomId,
    status: 'voucher',
    tapTs: moment().unix()
  }
}

export function roomInspect(roomId) {
  return {
    type: UpdatesTypes.ROOM_INSPECT,
    roomId,
    status: 'finish',
    tapTs: moment().unix()
  }
}

export function roomNoCheck(roomId) {
  return {
    type: UpdatesTypes.ROOM_NO_CHECK,
    roomId,
    status: 'no-check',
    tapTs: moment().unix()
  }
}

export function roomConfirmDND(roomId) {
  return {
    type: UpdatesTypes.ROOM_CONFIRM_DND,
    roomId,
    status: 'confirm-dnd',
    tapTs: moment().unix()
  }
}

export function roomReset(roomId) {
  return {
    type: UpdatesTypes.ROOM_RESET,
    roomId,
    tapTs: moment().unix()
  }
}

export function roomCancel(roomId) {
  return {
    type: UpdatesTypes.ROOM_CANCEL,
    roomId,
    status: '',
    tapTs: moment().unix()
  }
}

export function roomNoteAdd({ roomId, note, photo }) {
  return {
    type: UpdatesTypes.ROOM_NOTE_ADD,
    roomId,
    note,
    photo
  }
}

export function roomNoteRemove({ roomId, noteId }) {
  return {
    type: UpdatesTypes.ROOM_NOTE_REMOVE,
    roomId,
    noteId
  }
}

export function photoUpload({ path, id }) {
  return {
    type: UpdatesTypes.PHOTO_UPLOAD,
    path,
    id
  }
}

export function photoStore({ path, id, url }) {
  return {
    type: UpdatesTypes.PHOTO_STORE,
    path,
    id,
    url
  }
}

export function photoUploadFailure(id) {
  return {
    type: UpdatesTypes.PHOTO_UPLOAD_FAILURE,
    id
  }
}

export function photoRemove(id) {
  return {
    type: UpdatesTypes.PHOTO_REMOVE,
    id
  }
}

export function lostItemAdd({ desc, roomId, photoId }) {
  return {
    type: UpdatesTypes.LOST_ITEM_ADD,
    desc,
    roomId,
    photoId
  }
}

export function lostItemAddSuccess(foundItem) {
  return {
    type: UpdatesTypes.LOST_ITEM_ADD_SUCCESS,
    foundItem
  }
}

export function lostItemAddFailure(error) {
  return {
    type: UpdatesTypes.LOST_ITEM_ADD_FAILURE,
    error
  }
}

export function resetUpdates() {
  return {
    type: UpdatesTypes.UPDATES_RESET
  }
}

export function taskCreate(data) {
  return {
    type: UpdatesTypes.TASK_CREATE,
    data,
    tapTs: moment().unix()
  }
}

export function taskUpdate({ uuid, status }) {
  return {
    type: UpdatesTypes.TASK_UPDATE,
    uuid,
    status,
    tapTs: moment().unix()
  }
}

export function taskConvert({ task, update }) {
  return {
    type: UpdatesTypes.TASK_CONVERT,
    task,
    update,
    tapTs: moment().unix()
  }
}

export function taskCreateBatch(data) {
  return {
    type: UpdatesTypes.TASK_CREATE_BATCH,
    data,
    tapTs: moment().unix()
  }
}

export function taskUpdateBatch(tasks) {
  return {
    type: UpdatesTypes.TASK_UPDATE_BATCH,
    tasks
  }
}

export function taskReassign({ uuid, ids, dueDate }) {
  return {
    type: UpdatesTypes.TASK_REASSIGN,
    uuid,
    ids,
    dueDate
  }
}

export function taskEdit({ uuid, update: { task = null, meta = null, assigned = null, dueDate = null, is_priority = null }}) {
  console.log('here', uuid, meta, UpdatesTypes.TASK_EDIT)
  return {
    type: UpdatesTypes.TASK_EDIT,
    uuid,
    task,
    meta,
    assigned,
    dueDate,
    is_priority
  }
}

export function taskAddPhoto({ uuid, photoPath }) {
  return {
    type: UpdatesTypes.TASK_ADD_PHOTO,
    uuid,
    photoPath
  }
}

export function roomComment({ roomId, value }) {
  return {
    type: UpdatesTypes.ROOM_COMMENT,
    roomId,
    field: 'comment',
    value
  }
}

export function roomHousekeeping({ roomId, value }) {
  return {
    type: UpdatesTypes.ROOM_HOUSEKEEPING,
    roomId,
    field: 'roomHousekeeping',
    value
  }
}

export function roomMobileInspect({ roomId, roomHousekeeping, attendantStatus }) {
  return {
    type: UpdatesTypes.ROOM_MOBILE_INSPECT,
    roomId,
    roomHousekeeping,
    attendantStatus
  }
}

export function roomGuestLocator({ roomId, value }) {
  return {
    type: UpdatesTypes.ROOM_GUEST_LOCATOR,
    roomId,
    field: 'isGuestIn',
    value
  }
}

export function roomUnblock({ roomId, value }) {
  return {
    type: UpdatesTypes.ROOM_UNBLOCK,
    roomId,
    field: 'isRoomBlocked',
    value
  }
}

export function roomAddChangeSheets(roomId) {
  return {
    type: UpdatesTypes.ROOM_ADD_CHANGE_SHEETS,
    roomId,
    field: 'isChangeSheets',
    value: true
  }
}

export function roomRestock({ roomId, value }) {
  return {
    type: UpdatesTypes.ROOM_RESTOCK,
    roomId,
    field: 'isRoomRestocked',
    value,
    tapTs: moment().unix()
  }
}

export function roomTurndown({ roomId, value }) {
  return {
    type: UpdatesTypes.ROOM_TURNDOWN,
    roomId,
    field: 'turndownService',
    value,
    tapTs: moment().unix()
  }
}

export function roomMessageAdd({ roomId, message }) {
  return {
    type: UpdatesTypes.ROOM_MESSAGE_ADD,
    roomId,
    message
  }
}

export function roomMessageAddSuccess({ message }) {
  return {
    type: UpdatesTypes.ROOM_MESSAGE_ADD_SUCCESS,
  }
}

export function roomMessageRemove({ roomId, messageIds }) {
  return {
    type: UpdatesTypes.ROOM_MESSAGE_REMOVE,
    roomId,
    messageIds
  }
}

export function roomMessageRemoveSuccess() {
  return {
    type: UpdatesTypes.ROOM_MESSAGE_REMOVE_SUCCESS
  }
}

export function roomMessageUpdate({ roomId, message, messageIds }) {
  return {
    type: UpdatesTypes.ROOM_MESSAGE_UPDATE,
    roomId,
    messageIds,
    message
  }
}

export function roomMessageUpdateSuccess() {
  return {
    type: UpdatesTypes.ROOM_MESSAGE_UPDATE_SUCCESS
  }
}

export function planningUser({ room, user, options }) {
  return {
    type: UpdatesTypes.PLANNING_USER,
    room,
    user,
    options
  }
}

export function planningNightUser({ room, user, options }) {
  return {
    type: UpdatesTypes.PLANNING_NIGHT_USER,
    room,
    user,
    options
  }
}

export function planningNightUpdate(planning) {
  return {
    type: UpdatesTypes.PlANNING_NIGHT_UPDATE,
    planning
  }
}

export function notificationCreate({ user, message, room, photoUrl, photoId, photoPath }) {
  return {
    type: UpdatesTypes.NOTIFICATION_CREATE,
    user,
    message,
    room,
    photoUrl,
    photoId,
    photoPath,
    tapTs: moment().unix()
  }
}

export function taskSending() {
  return {
    type: UpdatesTypes.TASK_SENDING
  }
}

export function taskSendingSuccess() {
  return {
    type: UpdatesTypes.TASK_SENDING_SUCCESS
  }
}

export function taskSendingFailure(error) {
  return {
    type: UpdatesTypes.TASK_SENDING_FAILURE,
    error
  }
}

export function taskSendingReset() {
  return {
    type: UpdatesTypes.TASK_SENDING_RESET
  }
}

export function updateFoundStatus(id, item) {
  return {
    type: UpdatesTypes.LOST_FOUND_UPDATE_FOUND_STATUS,
    id,
    item
  }
}

export function updateFoundPhoto(id, field, photoPath) {
  return {
    type: UpdatesTypes.LOST_FOUND_UPDATE_FOUND_PHOTO,
    id,
    field,
    photoPath
  }
}

export function updateExtraOption({ roomId, label, isCompleted }) {
  return {
    type: UpdatesTypes.EXTRA_OPTION_UPDATE,
    roomId,
    label,
    isCompleted
  }
}

export function tasksToSomeday(uuids) {
  return {
    type: UpdatesTypes.TASKS_TO_SOMEDAY,
    uuids
  }
}

export function tasksFromSomeday(uuids) {
  return {
    type: UpdatesTypes.TASKS_FROM_SOMEDAY,
    uuids
  }
}

export function saveOutgoingHash(group, id, hash) {
  return {
    type: UpdatesTypes.SAVE_OUTGOING_HASH,
    group,
    id,
    hash
  }
}

export default {
  adjustInventory,
  rejectInventory,
  resetInventory,
  flushInventory,
  restockInventory,
  roomCleanStart,
  roomCleanRestart,
  roomCleanPause,
  roomCleanUnpause,
  roomCleanFinish,
  roomCleanFlush,
  roomDelay,
  roomDND,
  roomRefuse,
  roomVoucher,
  roomInspect,
  roomNoCheck,
  roomConfirmDND,
  roomCancel,
  roomReset,
  roomNoteAdd,
  roomNoteRemove,
  photoUpload,
  photoStore,
  photoUploadFailure,
  photoRemove,
  lostItemAdd,
  lostItemAddSuccess,
  lostItemAddFailure,
  taskCreate,
  taskCreateBatch,
  taskUpdate,
  taskUpdateBatch,
  taskReassign,
  taskEdit,
  taskAddPhoto,
  taskConvert,
  resetUpdates,
  roomComment,
  roomHousekeeping,
  roomMobileInspect,
  roomRestock,
  roomTurndown,
  roomGuestLocator,
  roomUnblock,
  roomAddChangeSheets,
  roomMessageAdd,
  roomMessageAddSuccess,
  roomMessageRemove,
  roomMessageRemoveSuccess,
  roomMessageUpdate,
  roomMessageUpdateSuccess,
  planningUser,
  planningNightUser,
  planningNightUpdate,
  notificationCreate,
  taskSending,
  taskSendingSuccess,
  taskSendingFailure,
  taskSendingReset,
  updateFoundStatus,
  updateFoundPhoto,
  updateExtraOption,
  tasksToSomeday,
  tasksFromSomeday,
  saveOutgoingHash
}
