import UpdatesTypes from '../constants/updates';
import moment from 'moment';

export function adjustInventory({ assetRoomId, roomId, updateInventoryData }) {
  return {
    type: UpdatesTypes.INVENTORY_ADJUST,
    assetRoomId,
    roomId,
    updateInventoryData
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
    roomId,
    meta: {
      debounce: {
        time: 250
      }
    }
  }
}

export function restockInventory({ assetRoomId, id }) {
  return {
    type: UpdatesTypes.INVENTORY_RESTOCK,
    assetRoomId,
    id
  }
}

export function inventoryAssetConsumationUpdate(assetConsumation) {
  return {
    type: UpdatesTypes.INVENTORY_ASSET_CONSUMATION,
    assetConsumation
  }
}

export function inventoryConfirmAssetConsumptionUpdate(confirmAssetConsumption) {
  return {
    type: UpdatesTypes.INVENTORY_CONFIRM_ASSET_CONSUMATION,
    confirmAssetConsumption
  }
}

export function roomCleanStart(roomId, roomName) {
  return {
    type: UpdatesTypes.ROOM_CLEAN_START,
    roomId,
    roomName,
    status: 'cleaning',
    tapTs: moment().unix(),
    meta: {
      debounce: {
        time: 250
      }
    }
  }
}

export function nightRoomCleanStart(roomId) {
  return {
    type: UpdatesTypes.NIGHT_ROOM_CLEAN_START,
    roomId,
    status: 'cleaning',
    tapTs: moment().unix(),
    meta: {
      debounce: {
        time: 250
      }
    }
  }
}

export function updateCleaningStartValue(roomId , ts) {
  return {
    type: UpdatesTypes.UPDATE_CLEANING_START_VALUE,
    roomId,
    ts
  }
}

export function roomCleanRestart(roomId) {
  return {
    type: UpdatesTypes.ROOM_CLEAN_RESTART,
    roomId,
    status: 'cleaning',
    tapTs: moment().unix(),
    meta: {
      debounce: {
        time: 250
      }
    }
  }
}

export function roomCleanPause(roomId,roomName) {
  return {
    type: UpdatesTypes.ROOM_CLEAN_PAUSE,
    roomId,
    roomName,
    status: 'paused',
    tapTs: moment().unix(),
    meta: {
      debounce: {
        time: 250
      }
    }
  }
}

export function roomCleanUnpause(roomId) {
  return {
    type: UpdatesTypes.ROOM_CLEAN_UNPAUSE,
    roomId,
    status: 'cleaning',
    tapTs: moment().unix(),
    meta: {
      debounce: {
        time: 250
      }
    }
  }
}

export function roomCleanFinish(roomId, roomName) {
  return {
    type: UpdatesTypes.ROOM_CLEAN_FINISH,
    roomId,
    roomName,
    status: 'finish',
    tapTs: moment().unix(),
    meta: {
      debounce: {
        time: 250
      }
    }
  }
}

export function roomCleanFlush(roomId) {
  return {
    type: UpdatesTypes.ROOM_CLEAN_FLUSH,
    roomId,
    tapTs: moment().unix(),
    meta: {
      debounce: {
        time: 250
      }
    }
  }
}

export function roomDelay(roomId, roomName) {
  return {
    type: UpdatesTypes.ROOM_DELAY,
    roomId,
    roomName,
    status: 'delay',
    tapTs: moment().unix(),
    meta: {
      debounce: {
        time: 250
      }
    }
  }
}

export function roomDND(roomId, roomName) {
  return {
    type: UpdatesTypes.ROOM_DND,
    roomId,
    roomName,
    status: 'dnd',
    tapTs: moment().unix(),
    meta: {
      debounce: {
        time: 250
      }
    }
  }
}

export function roomRefuse(roomId, roomName) {
  return {
    type: UpdatesTypes.ROOM_REFUSE,
    roomId,
    roomName,
    status: 'refuse',
    tapTs: moment().unix(),
    meta: {
      debounce: {
        time: 250
      }
    }
  }
}

export function roomVoucher(roomId, roomName) {
  return {
    type: UpdatesTypes.ROOM_VOUCHER,
    roomId,
    roomName,
    status: 'voucher',
    tapTs: moment().unix(),
    meta: {
      debounce: {
        time: 250
      }
    }
  }
}

export function roomInspect(roomId) {
  return {
    type: UpdatesTypes.ROOM_INSPECT,
    roomId,
    status: 'finish',
    tapTs: moment().unix(),
    meta: {
      debounce: {
        time: 250
      }
    }
  }
}

export function roomNoCheck(roomId, roomName) {
  return {
    type: UpdatesTypes.ROOM_NO_CHECK,
    roomId,
    roomName,
    status: 'no-check',
    tapTs: moment().unix(),
    meta: {
      debounce: {
        time: 250
      }
    }
  }
}

export function roomConfirmDND(roomId, roomName) {
  return {
    type: UpdatesTypes.ROOM_CONFIRM_DND,
    roomId,
    roomName,
    status: 'confirm-dnd',
    tapTs: moment().unix(),
    meta: {
      debounce: {
        time: 250
      }
    }
  }
}

export function roomReset(roomId,turnDown) {
  return {
    type: UpdatesTypes.ROOM_RESET,
    roomId,
    turnDown,
    tapTs: moment().unix(),
    meta: {
      debounce: {
        time: 250
      }
    }
  }
}

export function roomCancel(roomId, status, roomName) {
  return {
    type: UpdatesTypes.ROOM_CANCEL,
    roomId,
    roomName,
    status: status,
    tapTs: moment().unix(),
    meta: {
      debounce: {
        time: 250
      }
    }
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

export function lostItemAdd(photos, insertLFPayload) {
  return {
    type: UpdatesTypes.LOST_ITEM_ADD,
    photos,
    insertLFPayload
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
    tapTs: moment().unix(),
    meta: {
      debounce: {
        time: 250
      }
    }
  }
}

export function taskUpdate({ uuid, status, auditId, auditTemplateId, isAuditRequired}) {
  return {
    type: UpdatesTypes.TASK_UPDATE,
    uuid,
    status,
    tapTs: moment().unix(),
    auditId, 
    auditTemplateId,
    isAuditRequired,
    meta: {
      debounce: {
        time: 250,
      }
    }
  }
}

export function taskRemoveAuditMeta() {
  return {
    type: UpdatesTypes.TASK_REMOVE_AUDIT_META,
  }
}



export function createMessageForTask({ taskId, message }) {
  return {
    type: UpdatesTypes.CREATE_TASK_MESSAGE,
    taskId,
    message,
    tapTs: moment().unix(),
    meta: {
      debounce: {
        time: 250,
      }
    }
  }
}

export function taskConvert({ task, update }) {
  return {
    type: UpdatesTypes.TASK_CONVERT,
    task,
    update,
    tapTs: moment().unix(),
    meta: {
      debounce: {
        time: 250
      }
    }
  }
}

export function taskCreateBatch(data) {
  return {
    type: UpdatesTypes.TASK_CREATE_BATCH,
    data,
    tapTs: moment().unix(),
    meta: {
      debounce: {
        time: 250
      }
    }
  }
}

export function taskUpdateBatch(tasks) {
  return {
    type: UpdatesTypes.TASK_UPDATE_BATCH,
    tasks
  }
}

export function popUpTaskUpdateBatch(tasks) {
  return {
    type: UpdatesTypes.POPUP_TASK_UPDATE_BATCH,
    tasks
  }
}

export function taskReassign({ uuid, user, dueDate }) {
  return {
    type: UpdatesTypes.TASK_REASSIGN,
    uuid,
    user,
    dueDate,
    meta: {
      debounce: {
        time: 250
      }
    }
  }
}

export function taskDeparture({ uuid }) {
  return {
    type: UpdatesTypes.TASK_DEPARTURE,
    uuid,
    meta: {
      debounce: {
        time: 250
      }
    }
  }
}

export function taskEdit({ uuid, update: { task = null, meta = null, assigned = null, dueDate = null, is_priority = null } }) {
  return {
    type: UpdatesTypes.TASK_EDIT,
    uuid,
    task,
    meta,
    assigned,
    dueDate,
    is_priority,
    meta: {
      debounce: {
        time: 250
      }
    }
  }
}

export function taskAddPhoto({ uuid, photoPath }) {
  return {
    type: UpdatesTypes.TASK_ADD_PHOTO,
    uuid,
    photoPath
  }
}

export function taskAdditionalPhoto({ taskId, imageUrls }) {
  return {
    type: UpdatesTypes.TASK_ADDITIONAL_PHOTO,
    taskId,
    imageUrls
  }
}

export function roomComment({ roomMessagePayload }) {
  return {
    type: UpdatesTypes.ROOM_COMMENT,
    roomMessagePayload
  }
}

export function roomHousekeeping({ room, status, codeName }) {
  return {
    type: UpdatesTypes.ROOM_HOUSEKEEPING,
    room,
    field: 'roomHousekeeping',
    status,
    codeName
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

export function roomGuestLocator({ roomId, value, bedId }) {
  return {
    type: UpdatesTypes.ROOM_GUEST_LOCATOR,
    roomId,
    field: 'isGuestIn',
    value,
    bedId
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

export function roomTurndown({ updateTurnDownStatus }) {
  return {
    type: UpdatesTypes.ROOM_TURNDOWN,
    // roomId,
    field: 'turndownService',
    // status: value,
    updateTurnDownStatus,
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

export function roomPriorityUpdate({ room, is_priority }) {
  return {
    type: UpdatesTypes.ROOM_PRIORITY_UPDATE,
    room,
    is_priority
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

export function assignPlanningToUser({ room, user, options }) {
  return {
    type: UpdatesTypes.ASSIGN_CLEANING_TO_USER,
    room,
    user,
    options
  }
}

export function reAssignPlanningToUser(room) {
  return {
    type: UpdatesTypes.RE_ASSIGN_CLEANING_TO_USER,
    room
  }
}


export function planningUserBulk({ plannings }) {
  return {
    type: UpdatesTypes.PLANNING_USER_BULK,
    plannings
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

export function tasksAddRecent(data) {
  return {
    type: UpdatesTypes.TASKS_ADD_RECENT,
    data
  }
}

export function inspectionFinishPhotoUpload() {
  return {
    type: UpdatesTypes.INSPECTION_FINISH_PHOTO_UPLOAD
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

export function updateNightyInspectionStatus({ updateTurnDownStatus }) {
  return {
    type: UpdatesTypes.ROOM_NIGHTY_HOUSEKEEPING,
    // roomId,
    field: 'turndownService',
    // status: value,
    updateTurnDownStatus,
    tapTs: moment().unix()
  }
}

export default {
  adjustInventory,
  rejectInventory,
  resetInventory,
  flushInventory,
  restockInventory,
  inventoryAssetConsumationUpdate,
  inventoryConfirmAssetConsumptionUpdate,
  roomCleanStart,
  nightRoomCleanStart,
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
  createMessageForTask,
  taskUpdateBatch,
  popUpTaskUpdateBatch,
  taskReassign,
  taskDeparture,
  taskEdit,
  taskAddPhoto,
  taskConvert,
  resetUpdates,
  taskAdditionalPhoto,
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
  roomPriorityUpdate,
  planningUser,
  planningUserBulk,
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
  tasksAddRecent,
  inspectionFinishPhotoUpload,
  saveOutgoingHash,
  updateNightyInspectionStatus,
  updateCleaningStartValue,
  assignPlanningToUser,
  reAssignPlanningToUser,
  taskRemoveAuditMeta
}
