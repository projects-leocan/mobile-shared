import { createSelector } from 'reselect';
import { filter, get } from 'lodash';

import { floorsSelector, roomCategoriesSelector, usersSelector, tasksSelector, basicHotelRoomsIndex } from 'rc-mobile-base/lib/selectors/rooms';
import { Activities, Filtering, Status } from 'rc-mobile-base/lib/utils/tasks';

export const filterOptionsSelector = createSelector(
  [floorsSelector, roomCategoriesSelector, usersSelector],
  (floors, categories, users) => {
    return [
      {
        title: "Status",
        data: [
          { value: "status:pending", label: "pending" },
          { value: "status:waiting", label: "waiting" },
          { value: "status:started", label: "started" },
          { value: "status:paused", label: "paused" },
          { value: "status:rejected", label: "rejected" },
        ]
      },
      {
        title: "Floors",
        data: floors.map(floor => ({ value: `floor:${floor._id}`, label: floor.number }))
      },
      {
        title: "Categories",
        data: categories.map(category => ({ value: `category:${category._id}`, label: category.label }))
      },
      {
        title: "Assigned",
        data: [
          { label: "Maintenance Team", value: "user:*" },
          ...users.filter(user => user.isMaintenance).map(user => ({ label: `${user.first_name} ${user.last_name}`, value: `user:${user._id}`}))
        ]
      }
    ]
  }
)

export const availableTasksSelector = (filters = { is_completed: 0, is_cancelled: 0, meta: { isMaintenance: true } }) => createSelector(
  [tasksSelector, basicHotelRoomsIndex],
  (tasks, roomsIndex) => {
    return filter(tasks, filters)
      .map(task => ({
        ...task,
        room: get(task, 'meta.room_id') && get(roomsIndex, get(task, 'meta.room_id'))
      }))
  }
)