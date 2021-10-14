import {
  computedHotelRooms,
  computedAvailableFloors,
  computedAllFloors
} from './rooms';
import { createSelector } from 'reselect';
import { keyBy, groupBy, map, find, filter, sortBy, includes } from 'lodash/collection';
import { uniq, flatten } from 'lodash/array';
import { get, extend, values, has } from 'lodash/object';
import { isEmpty } from 'lodash/lang';
import { map as fpMap, uniq as fpUniq, fpUniqWith, flow, sortBy as fpSortBy, filter as fpFilter, flatten as fpFlatten } from 'lodash/fp';
import moment from 'moment';

export const getGuestRoomsByFloor = (hotelFloorsWithRooms) => {
  if (!hotelFloorsWithRooms || !hotelFloorsWithRooms.length) {
    return [];
  }

  return flow(
    fpMap('rooms'),
    fpFlatten,
    fpFilter(room => !room.roomCategory.isPublic
                && !room.roomCategory.isPrivate
                && !room.roomCategory.isOutside
    ),
    fpFilter(room => room.guestStatus === 'stay'
                || room.guestStatus === 'arr'
                || room.guestStatus === 'da'
    )
  )(hotelFloorsWithRooms)
}

export const computedGuestRoomsByFloor = createSelector(
  [computedAllFloors],
  getGuestRoomsByFloor
)

export const userIdSelector = state => state.auth.userId;
export const hotelSelector = state => state.auth.hotel;
export const roomsSelector = state => state.rooms.hotelRooms;
export const planningsRunnerSelector = state => state.rooms.hotelPlanningsRunner;
export const tasksSelector = state => state.rooms.hotelTasks;

export const getRunnerRooms = (hotelRooms, hotelPlannings, userId) => {
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

export const getIndexedRunnerRooms = (runnerRooms) => keyBy(runnerRooms, '_id');

export const getRunnerPopupTasks = (hotelTasks, indexedRooms, userId, hotel) => {
  if (!hotelTasks || !hotelTasks.length) {
    return []
  }

  const today = moment().format('YYYY-MM-DD');

  return hotelTasks.filter(task => {
    if (get(task, 'is_completed') || get(task, 'is_cancelled')) {
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
    if (get(task, 'assigned.isPlannedRunner') && room) {
      return true;
    }

    return false;
  })
}

export const computedRunnerRooms = createSelector(
  [roomsSelector, planningsRunnerSelector, userIdSelector],
  getRunnerRooms
)

export const computedIndexRunnerRooms = createSelector(
  [computedRunnerRooms],
  getIndexedRunnerRooms
)

export const computedRunnerPopupTasks = createSelector(
  [tasksSelector, computedIndexRunnerRooms, userIdSelector, hotelSelector],
  getRunnerPopupTasks
)