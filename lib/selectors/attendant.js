import Immutable from 'seamless-immutable';
import { createSelector } from 'reselect';
import { keyBy, groupBy, map, find, filter, sortBy, includes } from 'lodash/collection';
import { uniq, flatten } from 'lodash/array';
import { get, extend, values, has } from 'lodash/object';
import { isEmpty } from 'lodash/lang';
import { map as fpMap, uniq as fpUniq, fpUniqWith, flow, sortBy as fpSortBy, filter as fpFilter } from 'lodash/fp';
import moment from 'moment';
import _ from "lodash"
import { availableHotelsSelector } from 'rc-mobile-base/lib/selectors/auth';
import { availHotelsRoomSelector, availHotelsTaskSelector, SocketHotelTaskPopup } from 'rc-mobile-base/lib/selectors/hotelsTask';
import { generateThumbnailFromVideo } from 'rc-mobile-base/lib/utils/file-type';

export const userIdSelector = state => state.auth.userId;
export const hotelSelector = state => state.auth.hotel;
export const roomsSelector = state => state.rooms.hotelRooms;
export const planningsSelector = state => state.rooms.hotelPlannings;
export const tasksSelector = state => state.rooms.hotelTasks;
// export const SocketHotelTaskPopup = state => state.rooms.taskSocket;
export const getAttendantRooms = (hotelRooms, hotelPlannings, userId) => {
  if (!hotelRooms || !hotelRooms.length || !hotelPlannings || !hotelPlannings.length) {
    return;
  }

  const indexedRooms = keyBy(hotelRooms, 'id');
  return hotelPlannings
    .filter(planning => planning.planning_user_id && planning.planning_user_id === userId)
    .map(planning => {
      const roomId = get(planning, 'room_id');
      return get(indexedRooms, roomId);
    });
}

export const getIndexedAttendantRooms = (attendantRooms) => keyBy(attendantRooms, 'id');

export const getAttendantPopupTasks = (hotelTasks, hotelRooms, userId, availHotels) => {
  if (!hotelTasks || !hotelTasks.length) {
    return []
  }

  // console.time('getAttendantPopupTasks')

  const today = moment().format('YYYY-MM-DD');

  let tasks = hotelTasks.filter(task => {
    if (get(task, 'is_completed') || get(task, 'is_cancelled') || get(task, 'is_rejected')) {
      return false;
    }

    if (get(task, 'is_started') || get(task, 'is_paused')) {
      return false
    }

    // if (get(task, 'due_date') !== today || get(task, 'type') === 'notification' || get(task, 'is_claimed')) {
    if (get(task, 'start_date') !== today || get(task, 'type') === 'notification' || get(task, 'is_claimed')) {
      return false;
    }

    if (get(task, 'assigned.rejected_ids', []).includes(userId)) {
      return false;
    }

    if (get(task, 'responsible_id') === userId || get(task, 'assigned.user_ids', []).includes(userId)) {
      return true;
    }
    const roomId = get(task, 'meta.room_id');
    const room = find(hotelRooms, ['id', roomId], {});
    const isShowTask = get(room, 'attendantStatus');


    if (get(task, 'assigned.isPlannedAttendant') && room && isShowTask) {
      return true;
    }

    return false;
  })

  const taskArray = tasks.map((item) => {
    const video_urls = !_.isEmpty(item?.video_urls) ? item?.video_urls.map((v) => {
      return {
        type: "video",
        url: v
      }
    }) : [];

    const image_urls = !_.isEmpty(item?.image_urls) ? item?.image_urls.map((v) => {
      return {
        type: "image",
        url: v
      }
    }) : [];
    return {
      ...item,
      roomName: get(find(hotelRooms, ['id', get(item, 'meta.room_id', '')], {}), 'name', ''),
      hotelName: get(find(availHotels, ['hotelId', get(item, 'hotel_id', '')], {}), 'hotelName', ''),
      mergeUrl: [...image_urls, ...video_urls],
      isSpecificUser: item?.responsible_id ? true : false,
    }
  })
  // console.timeEnd('getAttendantPopupTasks')
  return taskArray;
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
  [availHotelsTaskSelector, availHotelsRoomSelector, userIdSelector, availableHotelsSelector],
  getAttendantPopupTasks
)

const setHotelTaskPopup = (data, hotelRooms, availHotels) => {
  if (!data || !data.length) {
    return []
  }
  const newData = data.map((d) => {
    const video_urls = !_.isEmpty(d?.video_urls) ? d?.video_urls.map((v) => {
      return {
        type: "video",
        url: v
      }
    }) : [];

    const image_urls = !_.isEmpty(d?.image_urls) ? d?.image_urls.map((v) => {
      return {
        type: "image",
        url: v
      }
    }) : [];

    return {
      ...d,
      roomName: get(find(hotelRooms, ['id', get(d, 'room_id', '')], {}), 'name', ''),
      hotelName: get(find(availHotels, ['hotelId', get(d, 'hotel_id', '')], {}), 'hotelName', ''),
      uuid: d?.id,
      meta: {
        creatorId: d?.creator_id,
        room_id: d?.room_id
      },
      isSpecificUser: _.isEmpty(d?.groupIds) && _.isEmpty(d?.subGroupIds) ? true : false,
      mergeUrl: [...image_urls, ...video_urls],
      guest_info: {
        status: d?.status
      },
      assigned: {
        user_ids: d?.userIds,
        is_mandatory: d?.is_mandatory
      },
      guest_info: {
        guest_name: get(d, 'guest_name', null),
      },
    }
  })

  return newData
}

export const computedAttendentSocketPopupTask = createSelector(
  [SocketHotelTaskPopup, availHotelsRoomSelector, availableHotelsSelector],
  setHotelTaskPopup
)
