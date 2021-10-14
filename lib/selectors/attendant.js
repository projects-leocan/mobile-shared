import Immutable from 'seamless-immutable';
import { createSelector } from 'reselect';
import { keyBy, groupBy, map, find, filter, sortBy, includes } from 'lodash/collection';
import { uniq, flatten } from 'lodash/array';
import { get, extend, values, has } from 'lodash/object';
import { isEmpty } from 'lodash/lang';
import { map as fpMap, uniq as fpUniq, fpUniqWith, flow, sortBy as fpSortBy, filter as fpFilter } from 'lodash/fp';
import moment from 'moment';

export const userIdSelector = state => state.auth.userId;
export const hotelSelector = state => state.auth.hotel;
export const roomsSelector = state => state.rooms.hotelRooms;
export const planningsSelector = state => state.rooms.hotelPlannings;
export const tasksSelector = state => state.rooms.hotelTasks;

export const getAttendantRooms = (hotelRooms, hotelPlannings, userId) => {
  if (!hotelRooms || !hotelRooms.length || !hotelPlannings || !hotelPlannings.length) {
    return;
  }

  const indexedRooms = keyBy(hotelRooms, '_id');
  return hotelPlannings
    .filter(planning => planning.planning_user_id && planning.planning_user_id === userId)
    .map(planning => {
      const roomId = get(planning, 'room_id');
      return get(indexedRooms, roomId);
    });
}

export const getIndexedAttendantRooms = (attendantRooms) => keyBy(attendantRooms, '_id');

export const getAttendantPopupTasks = (hotelTasks, indexedRooms, userId, hotel) => {
  if (!hotelTasks || !hotelTasks.length) {
    return []
  }

  // console.time('getAttendantPopupTasks')

  const today = moment().format('YYYY-MM-DD');

  const tasks = hotelTasks.filter(task => {
    if (get(task, 'is_completed') || get(task, 'is_cancelled') || get(task, 'is_rejected')) {
      return false;
    }
    
    if (get(task, 'due_date') !== today || get(task, 'type') === 'notification' || get(task, 'is_claimed')) {
      return false;
    }

    if (get(task, 'assigned.rejected_ids', []).includes(userId)) {
      return false;
    }

    if (get(task, 'responsible_id') === userId || get(task, 'assigned.user_ids', []).includes(userId)) {
      return true;
    }

    const roomId = get(task, 'meta.room_id');
    const room = get(indexedRooms, roomId);
    const isShowTask = hotel && hotel.isAttendantImmediateTasks || get(room, 'attendantStatus');
    console.log(get(task, 'assigned.isPlannedAttendant'), isShowTask);
    if (get(task, 'assigned.isPlannedAttendant') && room && isShowTask) {
      return true;
    }

    return false;
  })

  // console.timeEnd('getAttendantPopupTasks')
  return tasks;
}

export const computedAttendantRooms = createSelector(
  [roomsSelector, planningsSelector, userIdSelector],
  getAttendantRooms
)

export const computedIndexAttendantRooms = createSelector(
  [computedAttendantRooms],
  getIndexedAttendantRooms
)

export const computedAttendantPopupTasks = createSelector(
  [tasksSelector, computedIndexAttendantRooms, userIdSelector, hotelSelector],
  getAttendantPopupTasks
)
