import { createSelector } from 'reselect';
import { get } from 'lodash/object';
import { last } from 'lodash/array';
import { keyBy } from 'lodash/collection';
import moment from 'moment';
import { getFormValues } from 'redux-form';

import { userIdSelector } from '../../selectors/auth';
import { tasksSelector, allHotelRoomsIndex, userSelector, userPlannings } from '../../selectors/rooms';
import { computedIndexedUsers } from '../../selectors/users';

import { Sorting, Filtering, Activities } from '../../utils/tasks';

export const tasksLayoutSelector = state => state.tasksLayout;

export const activeTabSelector = createSelector(
  [tasksLayoutSelector],
  (layout) => layout.tab
)

export const selectTasks = createSelector(
  [tasksSelector, allHotelRoomsIndex, computedIndexedUsers],
  (tasks, rooms, users) => {
    const mapped = tasks.map(task => {
      const lastMessageItem = last(get(task, 'messages', []))
      const lastMessage = lastMessageItem && lastMessageItem.message;
      const room = rooms[get(task, 'meta.room_id')] || {};
      const creator = users[get(task, 'creator_id')] || {};
      const dueDateDisplay = task.due_date ? moment(task.due_date).format("DD MMM. YYYY") : 'Backlog'
      const timeAgo = moment.unix(task.date_ts).fromNow();
      const activities = Activities.get(task)

      return {
        ...task,
        creator,
        room,
        lastMessage,
        dueDateDisplay,
        timeAgo,
        activities,
      }
    });

    return mapped;
  }
)

const searchFormsValues = getFormValues('tasksLayoutSearch');

const tasksBySearch = createSelector(
  [selectTasks, searchFormsValues],
  (tasks, searchForm) => {
    if (!searchForm) {
      return tasks
    }
    const regex = new RegExp(searchForm.search, 'i')
    return tasks.filter(task => task.task.match(regex))
  }
)

const assignedTasksBase = createSelector(
  [tasksBySearch, userSelector, userPlannings],
  Filtering.assignedToday
)

export const assignedTasks = createSelector(
  [assignedTasksBase],
  (assigned) => {
    const mapped = assigned.map((task) => ({...task, category: Filtering.isPriority(task) ? 'priority' : get(task, 'room.name', 'No Location')}))
    const sorted = Sorting.byPriorityRoom(mapped)

    return sorted;
  }
)

const backlogTasksBase = createSelector(
  [tasksBySearch, userSelector, userPlannings],
  Filtering.assignedBacklog
)

export const backlogTasks = createSelector(
  [backlogTasksBase],
  (assigned) => {
    const mapped = assigned.map((task) => ({...task, category: Filtering.isPriority(task) ? 'priority' : get(task, 'room.name', 'No Location') }))
    const sorted = Sorting.byPriorityRoom(mapped)

    return sorted;
  }
)

const sentTasksBase = createSelector(
  [tasksBySearch, userIdSelector],
  Filtering.sent
)

export const sentTasks = createSelector(
  [sentTasksBase],
  (sent) => {
    const mapped = sent
      .filter(task => !get(task, 'is_cancelled'))
      .map((task) => ({...task, category: Filtering.isClosed(task) ? 'closed' : 'open'}))
    const sorted = Sorting.byOpenClosed(mapped)

    return sorted;
  }
)
