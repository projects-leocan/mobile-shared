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
      // const dueDateDisplay = task.due_date ? moment(task.due_date).format("DD MMM. YYYY") : 'Backlog'
      const dueDateDisplay = task.start_date ? moment(task.due_date).format("DD MMM. YYYY") : 'Backlog'
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

const assignedSentTasksBase = createSelector(
  [tasksBySearch, userSelector, userPlannings],
  Filtering.assignedSentToday
)

export const assignedTasks = createSelector(
  [assignedTasksBase],
  (assigned) => {
    const mapped = assigned.map((task) => ({ ...task, category: Filtering.isPriority(task) ? 'priority' : get(task, 'room.name', 'No Location') }))
    const sorted = Sorting.byPriorityRoom(mapped)

    return sorted;
  }
)

export const sentAssignedTasks = createSelector(
  [assignedSentTasksBase],
  (assigned) => {
    const mapped = assigned.map((task) => ({ ...task, category: Filtering.isPriority(task) ? 'priority' : get(task, 'room.name', 'No Location') }))
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
    const mapped = assigned.map((task) => ({ ...task, category: Filtering.isPriority(task) ? 'priority' : get(task, 'room.name', 'No Location') }))
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
    const today = moment().format('YYYY-MM-DD');

    const mapped = sent
      .filter(task => !get(task, 'is_cancelled'))
      .filter(task => get(task, 'start_date') === today)
      .map((task) => ({ ...task, category: Filtering.isClosed(task) ? 'closed' : 'open' }))
    const sorted = Sorting.byOpenClosed(mapped)

    return sorted;
  }
)


const closedTasksBase = createSelector(
  [tasksBySearch, userIdSelector],
  Filtering.closed
)


const cencledTasksBase = createSelector(
  [tasksBySearch, userIdSelector],
  Filtering.cencelled
)


export const closedTasks = createSelector(
  [closedTasksBase, cencledTasksBase],
  (sent, cencel) => {
    const today = moment().format('YYYY-MM-DD');

    const mapped = sent
      .filter(task => get(task, 'start_date') === today)
      .map((task) => ({ ...task, category: 'closed' }))


    const mappedCencleTask = cencel
      .filter(task => get(task, 'start_date') === today)
      .map((task) => ({ ...task, category: 'closed' }))

    const allTask = [...mapped, ...mappedCencleTask]

    const sorted = Sorting.byOpenClosed(allTask)
    return sorted;
  }
)

export const finishTask = createSelector(
  [closedTasksBase],
  (sent) => {
    const today = moment().format('YYYY-MM-DD');

    const mapped = sent
      .filter(task => get(task, 'start_date') === today)
      .map((task) => ({ ...task, category: 'closed' }))

    const allTask = [...mapped]

    const sorted = Sorting.byOpenClosed(allTask)
    return sorted;
  }
)
