import { get } from 'lodash/object';
import { isEmpty } from 'lodash/lang';
import { some, includes } from 'lodash/collection';
import moment from 'moment';

export function isNotification(task) {
  if (get(task, 'type') === 'notification') {
    return true;
  }
}

export function isHidden(task, userId) {
  if (get(task, 'is_hidden', false)) {
    return true;
  }

  // const rejectedIds = get(task, 'assigned.rejected_ids', []);
  // return some(rejectedIds, userId);
  return false;
};

export function isTaken(task, userId) {
  if (get(task, 'responsible_id', '') && get(task, 'responsible_id', '').length && get(task, 'responsible_id', '') !== userId) {
    return true;
  }

  if (get(task, 'assigned.user_ids.length') && !includes(get(task, 'assigned.user_ids'), userId)) {
    return true;
  }
}

export function isAssigned(task, userId) {
  if (!_checkTask(task, userId)) {
    return false;
  }

  if (get(task, 'responsible_id', '') === userId) {
    return true;
  }

  const userIds = get(task, 'assigned.user_ids', []);
  const users = get(task, 'assigned.users', []);

  if (get(task, 'assigned.user_ids') && includes(userIds, userId)) {
    return true;
  }
  if (get(task, 'assigned.users') && includes(users, userId)) {
    return true;
  }

  return false;
};

export function isAssignedUser(task, user, plannings = []) {
  const { _id: userId, isAttendant, isRoomRunner, isInspector, isMaintenance } = user;
  if (!_checkTask(task, userId)) {
    return false;
  }

  if (get(task, 'responsible_id', '') === userId) {
    return true;
  } else if (get(task, 'responsible_id.length', 0)) {
    return false;
  }

  const userIds = get(task, 'assigned.user_ids', []) || get(task, 'assigned.users', []);
  const roomId = get(task, 'meta.room_id');

  if (userIds && includes(userIds, userId)) {
    return true;
  }
  
  if (get(task, 'meta.isMaintenance') && isMaintenance && isEmpty(userIds)) {
    return true;
  }
  if ((isRoomRunner || isAttendant) && plannings.map(p => p.room_id).includes(roomId)) {
    return true;
  }
  if (isRoomRunner && (!plannings || !roomId) && !get(task, 'meta.isMaintenance')) {
    return true;
  }

  return false;
};

export function isAssignedToday(task, user, plannings) {
  if (!isAssignedUser(task, user, plannings)) {
    return false;
  }

  const today = moment().format('YYYY-MM-DD');

  return get(task, 'due_date') === today;
}

export function isAssignedBacklog(task, user, plannings) {
  if (!isAssignedUser(task, user, plannings)) {
    return false;
  }

  const mToday = moment(moment().format('YYYY-MM-DD'));

  return !get(task, 'due_date') || mToday > moment(get(task, 'due_date'));
}

export function isUnassigned(task, userId) {
	const assignedUsers = get(task, 'assigned.users', []);
  const assignedUserIds = get(task, 'assigned.user_ids', []);
  const responsibleId = get(task, 'responsible_id', null);

  if (assignedUsers && isEmpty(assignedUsers)) {
		return true;
	}
	if (assignedUserIds && isEmpty(assignedUserIds)) {
		return true;
  }
  if (!responsibleId) {
    return true;
  }

	return false;
};

export function isMaintenance(task, userId) {
  return get(task, 'meta.isMaintenance', false);
};

export function isSent(task, userId) {
  if (isNotification(task)) {
    return false;
  }

  return get(task, 'creator_id') === userId;
};

export function isClosed(task) {
  return get(task, 'is_completed');
};

export function isCancelled(task) {
  return get(task, 'is_cancelled');
};

export function isRemoved(task) {
  return get(task, 'is_cancelled') || (get(task, 'is_completed') && moment(get(task, 'due_date')).isBefore(moment(), 'day'));
};

export function isPriority(task, userId) {
  return (get(task, 'is_priority') && isAssigned(task, userId));
};

export function isRefused(task, userId) {
	const userIds = get(task, 'assigned.rejected_ids', []);
  if (includes(userIds, userId)) {
    return true;
  }
}

export const _checkTask = (task, userId) => {
  if (isRemoved(task) || isNotification(task) || isHidden(task, userId) || isClosed(task) || isTaken(task, userId) || isRefused(task, userId)) {
    return false
  }
  return true;
}

export const _checkTaskAll = (task) => {
  if (isCancelled(task) || isNotification(task) || isHidden(task)) {
    return false
  }
  return true;
}

export const checkPriority = (task, userId) => {
  if (_checkTask(task, userId) && isPriority(task, userId)) {
    return true
  }
  return false
}

export const checkNormal = (task, userId) => {
  if (_checkTask(task, userId) && !isPriority(task, userId) && isAssigned(task, userId)) {
    return true
  }
  return false
}

export const checkUnassigned = (task, userId) => {
  // console.log('checkUnassigned', _checkTask(task, userId), !isPriority(task, userId), !isAssigned(task, userId), isUnassigned(task, userId));
  if (!isPriority(task, userId) && !isAssigned(task, userId) && isUnassigned(task, userId)) {
    return true
  }
  return false
}

export const checkPriorityAll = (task) => {
  if (_checkTaskAll(task) && get(task, 'is_priority')) {
    return true;
  }
  return false;
}

export const checkNormalAll = (task) => {
  if (_checkTaskAll(task) && !isPriority(task) && get(task, 'responsible_id')) {
    return true;
  }
  return false;
}

export const checkUnassignedAll = (task) => {
  if (_checkTaskAll(task) && !isPriority(task) && isUnassigned(task)) {
    return true
  }
  return false
} 

const filterBy = (predicate) => (tasks, userId) => tasks.filter(task => predicate(task, userId))

export const closed = filterBy(isClosed)
export const sent = filterBy(isSent)
export const maintenance = filterBy(isMaintenance)
export const assigned = filterBy(isAssigned)
export const assignedToday = filterBy(isAssignedToday)
export const assignedBacklog = filterBy(isAssignedBacklog)

export default {
  // predicates
  checkUnassigned,
  checkNormal,
  checkPriority,
  isMaintenance,
  isUnassigned,
  isAssigned,
  isPriority,
  isRefused,
  isTaken,
  isClosed,
  isHidden,
  isRemoved,
  // functions
  closed,
  sent,
  maintenance,
  assigned,
  assignedToday,
  assignedBacklog
}
