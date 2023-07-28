import Immutable from 'seamless-immutable';
import { createSelector } from 'reselect';
import { availableHotelsSelector } from 'rc-mobile-base/lib/selectors/auth';
import { keyBy, groupBy, map, find, filter, sortBy, includes } from 'lodash/collection';
import { uniq, flatten } from 'lodash/array';
import { get, extend, values, has } from 'lodash/object';
import { isEmpty } from 'lodash/lang';
import { map as fpMap, uniq as fpUniq, fpUniqWith, flow, sortBy as fpSortBy, filter as fpFilter } from 'lodash/fp';
import moment from 'moment';
import _ from "lodash"

export const userIdSelector = state => state.auth.userId;
export const hotelSelector = state => state.auth.hotel;
export const roomsSelector = state => state.rooms.hotelRooms;
export const planningsSelector = state => state.rooms.hotelPlannings;
export const tasksSelector = state => state.rooms.hotelTasks;
export const availHotelsTasksSelector = state => get(state, 'hotelsTask.availHotelTasks', []);
export const availHotelsRoomSelector = state => state.hotelsTask.availableHotelsRoom;

export const getMaintenancePopupTasks = (hotelTasks, hotelRooms, userId, availHotels) => {
  if (!hotelTasks || !hotelTasks.length) {
    return []
  }

  const today = moment().format('YYYY-MM-DD');

  const filteredTask = hotelTasks.filter(task => {
    if (get(task, 'is_completed') || get(task, 'is_cancelled') || get(task, 'is_rejected')) {
      return false;
    }

    if (get(task, 'is_started') || get(task, 'is_paused')) {
      return false
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

    if (get(task, 'meta.isMaintenance') && isEmpty(get(task, 'assigned.user_ids', []))) {
      return true;
    }

    return false;
  })

  // const taskArray = filteredTask.map(item => ({
  //   ...item,
  //   roomName: get(find(hotelRooms, ['id', get(item, 'meta.room_id', '')], {}), 'name', ''),
  //   hotelName: get(find(availHotels, ['hotelId', get(item, 'hotel_id', '')], {}), 'hotelName', ''),
  //   isSpecificUser: item?.responsible_id ? true : false
  // }))
  const taskArray = filteredTask.map((item) => {
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
      isSpecificUser: item?.responsible_id ? true : false
    }
  })
  return taskArray;
}



export const computedMaintenancePopupTasks = createSelector(
  [availHotelsTasksSelector, availHotelsRoomSelector, userIdSelector, availableHotelsSelector],
  getMaintenancePopupTasks
)
