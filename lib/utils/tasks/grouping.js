import { get } from 'lodash/object';
import moment from 'moment';

import { categories } from './categories';

export const datePredicate = (date, task) => {
  // console.log(task.task)
  if (date.isBacklog) {
    if (!get(task, 'due_date') || moment(get(task, 'due_date')).isBefore(moment(), 'day')) {
      return true
    } else {
      return false
    }
  }
  return get(task, 'due_date') && moment(get(task, 'due_date')).isSame(date.date, 'day');
}

export const categoryPredicate = (category, task) => {
  return get(task, 'category') === category;
}

export const groupBy = (predicate, parents) => (tasks) => parents.map(item => tasks.filter(task => predicate(item, task)))

export const byCategory = groupBy(categoryPredicate, categories)

export default {
  datePredicate,
  categoryPredicate,
  byCategory
}
