import get from 'lodash/get';
import digestAssignment from './digest-assignment';

export default function (userId, ids, users, groups, dueDate) {
  let data = {
    user_id: userId
  }

  if (ids) {
    const taskAssignment = digestAssignment(ids, users, groups);
    data.meta = taskAssignment.meta;
    data.assigned = taskAssignment.assigned;
  }
  
  if (dueDate) {
    data.dueDate = dueDate;
  }

  return data;
}