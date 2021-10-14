import { sort } from 'rc-mobile-base/lib/utils/immutable';
import { PRIORITY, NORMAL, UNASSIGNED } from './categories';

export const categoryPredicate = (a, b) => {
  const aSection = a.category;
  const bSection = b.category;

  if (aSection === PRIORITY && bSection === PRIORITY) {
    return 0
  }
  if (aSection === PRIORITY && bSection === NORMAL) {
    return -1
  }
  if (aSection === PRIORITY && bSection === UNASSIGNED) {
    return -1
  }
  if (aSection === NORMAL && bSection === NORMAL) {
    return 0
  }
  if (aSection === NORMAL && bSection === PRIORITY) {
    return 1
  }
  if (aSection === NORMAL && bSection === UNASSIGNED) {
    return -1
  }
  if (aSection === UNASSIGNED && bSection === UNASSIGNED) {
    return 0
  }
  if (aSection === UNASSIGNED && bSection === PRIORITY) {
    return 1
  }
  if (aSection === UNASSIGNED && bSection === NORMAL) {
    return 1
  }
}

export const datePredicate = (a, b) => {
  // const aDate = a.due_date ? new Date(a.due_date) : null;
  // const bDate = b.due_date ? new Date(b.due_date) : null;
  const aDate = a.last_ts;
  const bDate = b.last_ts;

  if (!aDate && bDate) {
    return 1
  }
  if (aDate && !bDate) {
    return -1
  }
  if (!aDate && !bDate) {
    return 0
  }

  return bDate - aDate;
}

export const openClosedPredicate = (a, b) => {
  const aCategory = a.category;
  const bCategory = b.category;

  if (aCategory === 'open' && bCategory === 'closed') {
    return 1
  }
  if (aCategory === 'closed' && bCategory === 'open') {
    return -1
  }
  if (aCategory === bCategory) {
    return 0
  }
}

export const priorityRoomPredicate = (a, b) => {
  const aCategory = a.category;
  const bCategory = b.category;

  if (aCategory === 'priority') {
    return 1
  }
  if (bCategory === 'priority') {
    return -1
  }
  if (aCategory === bCategory) {
    return 0
  }

  return aCategory - bCategory
}

export const byCategory = sort(categoryPredicate)
export const byDate = sort(datePredicate)
export const byOpenClosed = sort(openClosedPredicate)
export const byPriorityRoom = sort(priorityRoomPredicate)

export default {
  categoryPredicate,
  datePredicate,
  byCategory,
  byDate,
  byOpenClosed,
  byPriorityRoom,
}
