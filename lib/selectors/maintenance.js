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

export const getMaintenancePopupTasks = (hotelTasks, userId) => {
  if (!hotelTasks || !hotelTasks.length) {
    return []
  }

  const today = moment().format('YYYY-MM-DD');

  return hotelTasks.filter(task => {
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

    if (get(task, 'meta.isMaintenance') && isEmpty(get(task, 'assigned.user_ids', []))) {
      return true;
    }

    return false;
  })
}



export const computedMaintenancePopupTasks = createSelector(
  [tasksSelector, userIdSelector],
  getMaintenancePopupTasks
)
