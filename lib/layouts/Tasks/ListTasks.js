import React, { Component } from 'react';
import { map, orderBy, get } from 'lodash';

import TaskList from '../../components/TaskList';
import TaskRowExpandable from '../../components/TaskRow/Expandable';

const ListTasks = ({ tasks, isSectionList, onSwipeoutPress }) => {
  const mapTasksForSection = map(tasks, function (task) {
    const isTaskForGuestReq = get(task, 'is_guest_request', false);
    const isTaskPriority = get(task, 'is_priority', false);

    if (isTaskForGuestReq) {
      return {
        ...task,
        sectionLabel: `Guest request`,
        sortIndex: 2
      }
    } else if (isTaskPriority) {
      return {
        ...task,
        sectionLabel: `Priority`,
        sortIndex: 1
      }
    } else {
      return {
        ...task,
        sectionLabel: `Normal`,
        sortIndex: 0
      }
    }
  })

  return(
    <TaskList
    sectionId="sectionLabel"
    tasks={orderBy(mapTasksForSection, ['sortIndex', 'date_ts'], ['desc', 'desc'])}
    isSectionList={isSectionList}
    onSwipeoutPress={onSwipeoutPress}
    renderTask={(task) => <TaskRowExpandable key={task.uuid} task={task} onSwipeoutPress={onSwipeoutPress} />}
  />
  )
}

export default ListTasks
