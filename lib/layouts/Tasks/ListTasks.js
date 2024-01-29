import React, { Component } from 'react';
import { map, orderBy, get } from 'lodash';

import TaskList from '../../components/TaskList';
import TaskRowExpandable from '../../components/TaskRow/Expandable';

const ListTasks = ({ tasks, isSectionList, onSwipeoutPress, navigation, activeTab }) => {
  const mapTasksForSection = map(tasks, function (task) {
    const isTaskForGuestReq = get(task, 'is_guest_request', false);
    const isTaskPriority = get(task, 'is_priority', false);
    const recurringTypeKey = get(task, "typeKey", "")
    if (isTaskForGuestReq) {
      return {
        ...task,
        sectionLabel: `Guest request`,
        sortIndex: 3
      }
    } else if (isTaskPriority) {
      return {
        ...task,
        sectionLabel: `Priority`,
        sortIndex: 2
      }
    }else if(recurringTypeKey === "RECURRING"){
      return {
        ...task,
        sectionLabel: `Recurring`,
        sortIndex: 0
      }
    }else {
      return {
        ...task,
        sectionLabel: `Normal`,
        sortIndex: 1
      }
    }
  })

  return(
    <TaskList
    sectionId="sectionLabel"
    tasks={orderBy(mapTasksForSection, ['sortIndex', 'date_ts'], ['desc', 'desc'])}
    isSectionList={isSectionList}
    onSwipeoutPress={onSwipeoutPress}
    
    renderTask={(task) => <TaskRowExpandable key={task.uuid} task={task} onSwipeoutPress={onSwipeoutPress} onTaskDetail={(task) => navigation.navigate('ExpandedTaskDetail', { task: task, activeTab: activeTab })}/>}
  />
  )
}

export default ListTasks
