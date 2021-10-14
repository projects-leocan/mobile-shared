import { createSelector } from 'reselect';

import { computedAllNotifications } from '../../selectors/rooms';
import { userIdSelector } from '../../selectors/auth';

export const assignedNotifications = createSelector(
  [computedAllNotifications, userIdSelector],
  (notifications, userId) => {
    return notifications.filter(notification => notification.assigned.user_ids.includes(userId))
  }
)

export const sentNotifications = createSelector(
  [computedAllNotifications, userIdSelector],
  (notifications, userId) => notifications.filter(notification => notification.creator_id === userId)
)
