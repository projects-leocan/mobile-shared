import { createSelector } from 'reselect';
import { get, extend, filter } from 'lodash';
import moment from 'moment';

import {
    tasksSelector,
    userIdSelector,
    computedIndexPlanning,
    computedIndexRunnerPlanning,
    computedIndexUsers,
    computedNotifications,
    computedPopupNotifications,
    getPopupNotificationTasks,
    computedHotelRoomsIndex
} from '../../selectors/rooms';

const auditsSelector = state => state.audit.items;

const getDefaultNotifications = (hotelTasks, userId, usersIndex) => {
    const today = moment().format('YYYY-MM-DD');

    return hotelTasks.filter(task => {
        if (task.type !== 'notification') {
            return false;
        }
    
        if (get(task, 'due_date') !== today) {
            return false;
        }

        if (!get(task, 'responsible_id') === userId || get(task, 'assigned.user_ids', []).includes(userId)) {
            return true;
        }

        return false;
    })
    .map(notification => extend({}, notification, { creator: get(usersIndex, notification.creator_id) }))
}

const getAttendantNotifications = (hotelTasks, userId, planningIndex, usersIndex) => {
    const today = moment().format('YYYY-MM-DD');
    
    return hotelTasks.filter(task => {
        if (task.type !== 'notification') {
            return false;
        }
    
        if (get(task, 'due_date') !== today) {
            return false;
        }

        if (!get(task, 'responsible_id') === userId || get(task, 'assigned.user_ids', []).includes(userId)) {
            return true;
        }

        const roomId = get(task, 'meta.room_id', null);
        const plannedRoomUserId = roomId && get(planningIndex, [roomId, 'planning_user_id'], null);
        const isPlannedMatch = roomId && plannedRoomUserId && userId === plannedRoomUserId;

        if (get(task, 'assigned.isPlannedAttendant') && isPlannedMatch) {
            return true;
        }

        return false;
    })
    .map(notification => extend({}, notification, { creator: get(usersIndex, notification.creator_id) }))
}

const getRunnerNotifications = (hotelTasks, userId, planningIndex, usersIndex) => {
    const today = moment().format('YYYY-MM-DD');
    
    return hotelTasks.filter(task => {
        if (task.type !== 'notification') {
            return false;
        }
    
        if (get(task, 'due_date') !== today) {
            return false;
        }

        if (!get(task, 'responsible_id') === userId || get(task, 'assigned.user_ids', []).includes(userId)) {
            return true;
        }

        const roomId = get(task, 'meta.room_id', null);
        const plannedRoomUserId = roomId && get(planningIndex, [roomId, 'planning_user_id'], null);
        const isPlannedMatch = roomId && plannedRoomUserId && userId === plannedRoomUserId;

        if (get(task, 'assigned.isPlannedRunner') && isPlannedMatch) {
            return true;
        }

        return false;
    })
    .map(notification => extend({}, notification, { creator: get(usersIndex, notification.creator_id) }))
}

const getPopupNotifications = (userNotifications, usersIndex) => userNotifications
    .filter(notification => !get(notification, 'is_claimed') && !get(notification, 'is_completed') && !get(notification, 'is_cancelled'))

export const computedDefaultNotifications = createSelector(
    [tasksSelector, userIdSelector, computedIndexUsers],
    getDefaultNotifications
)

export const computedAttendantNotifications = createSelector(
    [tasksSelector, userIdSelector, computedIndexPlanning, computedIndexUsers],
    getAttendantNotifications   
)

export const computedRunnerNotifications = createSelector(
    [tasksSelector, userIdSelector, computedIndexRunnerPlanning, computedIndexUsers],
    getRunnerNotifications   
)

export const computedDefaultPopupNotifications = createSelector(
    [computedDefaultNotifications],
    getPopupNotifications
)

export const computedAttendantPopupNotifications = createSelector(
    [computedAttendantNotifications],
    getPopupNotifications
)

export const computedRunnerPopupNotifications = createSelector(
    [computedRunnerNotifications],
    getPopupNotifications
)

export const computedAssignedAudits = createSelector(
  [auditsSelector, userIdSelector, computedHotelRoomsIndex],
  (audits, userId, roomsIndex) => {
    return filter(audits, audit => {
      return get(audit, 'assigned', []).includes(userId)
        && audit.status === "open"
        && !audit.responder_id
    })
    .map(audit => ({ ...audit, roomName: get(roomsIndex, [audit.consumption_id, 'name'], '') }))
  }
)