import get from 'lodash/get';
import moment from 'moment';
import OutboundTypes from '../../constants/outbound';

const ROOM_UPDATE_TYPES = [
  OutboundTypes.OUTBOUND_ROOM_MODEL_UPDATE,
  OutboundTypes.OUTBOUND_ROOM_UPDATE_FAILURE
];

const ROOM_CLEAN_TYPES = [
  OutboundTypes.OUTBOUND_ROOM_CLEAN_START,
  OutboundTypes.OUTBOUND_ROOM_CLEAN_PAUSE,
  OutboundTypes.OUTBOUND_ROOM_CLEAN_FINISH,
  OutboundTypes.OUTBOUND_ROOM_CLEAN_RESTART,
  OutboundTypes.OUTBOUND_ROOM_CLEAN_UNPAUSE,
  OutboundTypes.OUTBOUND_ROOM_DELAY,
  OutboundTypes.OUTBOUND_ROOM_DND,
  OutboundTypes.OUTBOUND_ROOM_REFUSE,
  OutboundTypes.OUTBOUND_ROOM_INSPECT,
  OutboundTypes.OUTBOUND_ROOM_NO_CHECK,
  OutboundTypes.OUTBOUND_ROOM_CONFIRM_DND,
  OutboundTypes.OUTBOUND_ROOM_CANCEL,
  OutboundTypes.OUTBOUND_ROOM_CLEAN_FAILURE
];

const ROOM_RESET_TYPES = [
  OutboundTypes.OUTBOUND_ROOM_RESET,
  OutboundTypes.OUTBOUND_ROOM_RESET_FAILURE
];

const ROOM_CLEAN_LOG_TYPES = [
  OutboundTypes.OUTBOUND_LOG_FAILURE,
  OutboundTypes.OUTBOUND_LOG_CLEAN,
  OutboundTypes.OUTBOUND_LOG_OTHER
];

const TASKS_CREATE_TYPES = [
  OutboundTypes.OUTBOUND_TASK_CREATE,
  OutboundTypes.OUTBOUND_TASK_CREATE_FAILURE,
  OutboundTypes.OUTBOUND_TASKS_CREATE
];

const TASKS_UPDATE_TYPES = [
  OutboundTypes.OUTBOUND_TASK_UPDATE,
  OutboundTypes.OUTBOUND_TASK_UPDATE_FAILURE,
  OutboundTypes.OUTBOUND_TASK_UPDATE_BATCH,
  OutboundTypes.OUTBOUND_TASK_UPDATE_BATCH_FAILURE,
];

export const prettyLabel = (data, roomHousekeepingsIndex) => {
  let label;
  
  if (ROOM_UPDATE_TYPES.includes(data.type)) {
    const field = get(data, 'meta.field')
      || get(data, 'payload.field');
    const value = get(data, 'meta.valuee')
      || get(data, 'payload.value');

    switch(field) {
      case "isRoomRestocked":
        label = 'Room restock'; break;
      case "comment":
        label = "Room message"; break;
      case "roomHousekeeping":
        label = get(roomHousekeepingsIndex, [value, 'label'], "Room housekeeping"); break;
      case "isRoomBlocked":
        label = "Room block"; break;
      case "isGuestIn":
        label = "Room guest occupancy"; break;
      case "attendantStatusNight":
        label = "Room turndown service"; break;
      default:
        debugger;
        label = ""
    }
  } else if (ROOM_CLEAN_TYPES.includes(data.type)) {
    label = `Room attendant update: ${data.meta.status}`;
  } else if (ROOM_RESET_TYPES.includes(data.type)) {
    label = 'Room reset';
  } else if (ROOM_CLEAN_LOG_TYPES.includes(data.type)) {
    label = 'Room cleanining entry';
  } else if (TASKS_CREATE_TYPES.includes(data.type)) {
    const task = get(data, 'meta.task.task')
      || get(data, 'payload.task.task');

    label = `Create: ${task}`;
  } else if (TASKS_UPDATE_TYPES.includes(data.type)) {
    label = "Update task(s)";
  } else {
    label = data.type;
  }

  return label;
}

export const prepItem = (item, index, roomsIndex, roomHousekeepingsIndex, isPending=true) => {
  const roomId = get(item, 'meta.roomId')
    || get(item, 'payload.roomId')
    || get(item, 'meta.task.meta.room_id')
    || get(item, 'payload.task.meta.room_id');

  const dateTs = get(item, 'meta.tapTs')
    || get(item, 'meta.offline.effect.options.body.tapTs');

  const room = roomId && get(roomsIndex, roomId) || null;
  const lt = dateTs && moment.unix(dateTs).format('LT') || null;
  // const label = prettyLabel(item, roomHousekeepingsIndex);

  return {
    ...item,
    index,
    room,
    lt,
    isPending
  }
}