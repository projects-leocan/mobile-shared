import {
  checkUnassigned,
  checkPriority,
  checkNormal,
  checkPriorityAll,
  checkNormalAll,
  checkUnassignedAll,
  checkRecurringAll,
  checkVerifiedAll
} from './filtering';
import { get } from 'lodash/object';


export const PRIORITY = 'priority'
export const NORMAL = 'normal'
export const UNASSIGNED = 'unassigned'
export const RECURRING = 'recurring'
export const VERIFIED = 'Verified'


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
  if (checkRecurringAll(task)) {
    return RECURRING
  }
  if (checkVerifiedAll(task)) {
    return VERIFIED
  }
}

export const categories = [
  PRIORITY,
  NORMAL,
  UNASSIGNED,
  RECURRING,
  VERIFIED
]

export default {
  get: getTaskCategory,
  getAll: getTaskCategoryAll,
  categories
}
