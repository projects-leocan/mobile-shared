import {
  checkUnassigned,
  checkPriority,
  checkNormal,
  checkPriorityAll,
  checkNormalAll,
  checkUnassignedAll
} from './filtering';

export const PRIORITY = 'priority'
export const NORMAL = 'normal'
export const UNASSIGNED = 'unassigned'

export const getTaskCategory = (task, userId) => {
  if (checkUnassigned(task, userId)) {
    return UNASSIGNED
  }
  if (checkNormal(task, userId)) {
    return NORMAL
  }
  if (checkPriority(task, userId)) {
    return PRIORITY
  }
}

export const getTaskCategoryAll = (task) => {
  if (checkPriorityAll(task)) {
    return PRIORITY;
  }
  if (checkNormalAll(task)) {
    return NORMAL;
  }
  if (checkUnassignedAll(task)) {
    return UNASSIGNED;
  }
}

export const categories = [
  PRIORITY,
  NORMAL,
  UNASSIGNED,
]

export default {
  get: getTaskCategory,
  getAll: getTaskCategoryAll,
  categories
}
