import DifferencesTypes from '../constants/differences';

export function resetDifferences() {
  return {
    type: DifferencesTypes.RESET_DIFFERENCES
  }
}

export function roomCleanDifference(rooms) {
  return {
    type: DifferencesTypes.ROOM_CLEAN_DIFFERENCE,
    rooms,
    change: 'clean'
  }
}

export function roomCleanDifferenceRead(roomId) {
  return {
    type: DifferencesTypes.ROOM_CLEAN_DIFFERENCE_READ,
    roomId,
    change: 'clean'
  }
}

export function roomCleanDifferenceIgnore(roomId) {
  return {
    type: DifferencesTypes.ROOM_CLEAN_DIFFERENCE_IGNORE,
    roomId,
    change: 'clean'
  }
}

export function roomMessageDifference(rooms) {
  return {
    type: DifferencesTypes.ROOM_MESSAGE_DIFFERENCE,
    rooms,
    change: 'message'
  }
}

export function roomMessageDifferenceRead(roomId) {
  return {
    type: DifferencesTypes.ROOM_MESSAGE_DIFFERENCE_READ,
    roomId,
    change: 'message'
  }
}

export function roomMessageDifferenceIgnore(roomId) {
  return {
    type: DifferencesTypes.ROOM_MESSAGE_DIFFERENCE_IGNORE,
    roomId,
    change: 'message'
  }
}

export function roomUnblockDifference(rooms) {
  return {
    type: DifferencesTypes.ROOM_UNBLOCK_DIFFERENCE,
    rooms,
    change: 'unblock'
  }
}

export function roomUnblockDifferenceRead(roomId) {
  return {
    type: DifferencesTypes.ROOM_UNBLOCK_DIFFERENCE_READ,
    roomId,
    change: 'unblock'
  }
}

export function roomUnblockDifferenceIgnore(roomId) {
  return {
    type: DifferencesTypes.ROOM_UNBLOCK_DIFFERENCE_IGNORE,
    roomId,
    change: 'unblock'
  }
}

export function roomRestockDifference(rooms) {
  return {
    type: DifferencesTypes.ROOM_RESTOCK_DIFFERENCE,
    rooms,
    change: 'restock'
  }
}

export function roomRestockDifferenceRead(roomId) {
  return {
    type: DifferencesTypes.ROOM_RESTOCK_DIFFERENCE_READ,
    roomId,
    change: 'restock'
  }
}

export function roomRestockDifferenceIgnore(roomId) {
  return {
    type: DifferencesTypes.ROOM_RESTOCK_DIFFERENCE_IGNORE,
    roomId,
    change: 'restock'
  }
}

export function planningPriorityDifference(rooms) {
  return {
    type: DifferencesTypes.PLANNING_PRIORITY_DIFFERENCE,
    rooms,
    change: 'priority'
  }
}

export function planningPriorityDifferenceRead(roomId) {
  return {
    type: DifferencesTypes.PLANNING_PRIORITY_DIFFERENCE_READ,
    roomId,
    change: 'priority'
  }
}

export function planningPriorityDifferenceIgnore(roomId) {
  return {
    type: DifferencesTypes.PLANNING_PRIORITY_DIFFERENCE_IGNORE,
    roomId,
    change: 'priority'
  }
}

export function calendarCheckinDifference(rooms) {
  return {
    type: DifferencesTypes.ROOM_UNBLOCK_DIFFERENCE,
    rooms,
    change: 'checkin'
  }
}

export function calendarCheckinDifferenceRead(roomId) {
  return {
    type: DifferencesTypes.ROOM_UNBLOCK_DIFFERENCE_READ,
    roomId,
    change: 'checkin'
  }
}

export function calendarCheckinDifferenceIgnore(roomId) {
  return {
    type: DifferencesTypes.ROOM_UNBLOCK_DIFFERENCE_IGNORE,
    roomId,
    change: 'checkin'
  }
}

export function calendarCheckoutDifference(rooms) {
  return {
    type: DifferencesTypes.ROOM_UNBLOCK_DIFFERENCE,
    rooms,
    change: 'checkout'
  }
}

export function calendarCheckoutDifferenceRead(roomId) {
  return {
    type: DifferencesTypes.ROOM_UNBLOCK_DIFFERENCE_READ,
    roomId,
    change: 'checkout'
  }
}

export function calendarCheckoutDifferenceIgnore(roomId) {
  return {
    type: DifferencesTypes.ROOM_UNBLOCK_DIFFERENCE_IGNORE,
    roomId,
    change: 'checkout'
  }
}

export default {
  resetDifferences,
  roomMessageDifference,
  roomMessageDifferenceRead,
  roomMessageDifferenceIgnore,
  roomUnblockDifference,
  roomUnblockDifferenceRead,
  roomUnblockDifferenceIgnore,
  roomRestockDifference,
  roomRestockDifferenceRead,
  roomRestockDifferenceIgnore,
  planningPriorityDifference,
  planningPriorityDifferenceRead,
  planningPriorityDifferenceIgnore,
  calendarCheckinDifference,
  calendarCheckinDifferenceRead,
  calendarCheckinDifferenceIgnore,
  calendarCheckoutDifference,
  calendarCheckoutDifferenceRead,
  calendarCheckoutDifferenceIgnore
}
