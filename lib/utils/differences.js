import { isEmpty } from 'lodash/lang';
import { find } from 'lodash/collection';

export const rooms = (prev, next) => {
  let updates = {
    cleanings: [],
    messages: [],
    unblocks: [],
    restocks: [],
  }
  next.forEach(room => {
    const previous = prev.find(p => p._id === room._id)
    if (!previous) {
      return false
    }
    if (previous.comment !== room.comment && !isEmpty(room.comment)) {
      updates.messages.push(room);
    }
    if (previous.isRoomBlocked && !room.isRoomBlocked) {
      updates.unblocks.push(room);
    }
    if (!previous.isRoomRestocked && room.isRoomRestocked) {
      updates.restocks.push(room);
    }
  });

  return updates;
}

export const plannings = (prev, next) => {
  let updates = {
    priorities: [],
    overwrites: []
  }
  next.forEach(planning => {
    if (!prev || !prev.length) {
      return;
    }
    // const previous = prev.find(p => p.room_id === planning.room_id)
    const previous = find(prev, { room_id: planning.room_id })
    if (!previous) {
      return false
    }
    if (!previous.is_priority && planning.is_priority) {
      // console.log(previous.room_name, previous.is_priority, planning.room_name, planning.is_priority);
      // console.log(prev, planning, find)
      // debugger;
      updates.priorities.push(planning);
    }
  })

  return updates;
}

export const calendar = (prev, next) => {
  let updates = {
    checkins: [],
    checkouts: []
  }
  next.forEach(entry => {
    const previous = prev.find(p => p.room_id === entry.room_id)
    if (!previous) {
      return false
    }
    if (!previous.arrival_ts && entry.arrival_ts) {
      updates.checkins.push(entry);
    }
    if (!previous.departure_ts && entry.departure_ts) {
      updates.checkouts.push(entry);
    }
  });

  return updates;
}
