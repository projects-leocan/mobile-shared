import {
  computedHotelRooms,
  computedAvailableFloors,
  computedAllFloors,
  planningsNightSelector,
  userIdSelector
} from 'rc-mobile-base/lib/selectors/rooms';
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

export const getUserNightRoomsByFloor = (hotelFloorsWithRooms, planningsNight, userId) => {
  if (!hotelFloorsWithRooms || !hotelFloorsWithRooms.length) {
    return [];
  }

  const hotelRooms = flow(
    fpMap('rooms'),
    fpFlatten
  )(hotelFloorsWithRooms);

  if (planningsNight && planningsNight.length) {
    const userRooms = planningsNight
      .filter(planning => planning.planning_user_id === userId)
    
    const userRoomIds = userRooms
      .map(planning => planning.room_id);

    const userRoomsIndex = keyBy(userRooms, 'room_id');

    return hotelRooms
      .filter(room => userRoomIds.includes(room._id))
      .map(room => ({
        ...room,
        roomPlanning: get(userRoomsIndex, room._id, {})
      }))
  }

  return flow(
    fpFilter(room => !room.roomCategory.isPublic
                  && !room.roomCategory.isPrivate
                  && !room.roomCategory.isOutside
    ),
    fpFilter(room => room.guestStatus === 'stay'
                  || room.guestStatus === 'arr'
                  || room.guestStatus === 'da'
    )
  )(hotelRooms)
}

export const computedUserNightRoomsByFloor = createSelector(
  [computedAllFloors, planningsNightSelector, userIdSelector],
  getUserNightRoomsByFloor
)