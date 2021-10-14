import { get } from 'lodash'

export const calcStatus = (isAttendant = true, isRunner = false, room) => {
  if (isAttendant) {
    return get(room, 'attendantStatus');
  } else if (isRunner) {
    return get(room, 'isRoomRestocked') ? "restocked" : "";
  }

  return ""
}