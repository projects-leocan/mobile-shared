import React, { Component } from 'react';
import { map, orderBy, get } from 'lodash';

import TaskList from '../../components/TaskList';
import TaskRowExpandable from '../../components/TaskRow/Expandable';

const ListTasks = ({ tasks, isSectionList, onSwipeoutPress, navigation, activeTab }) => {
  console.log("tasks ++++",tasks);
  const mapTasksForSection = map(tasks, function (task) {
    const isTaskForGuestReq = get(task, 'is_guest_request', false);
    const isTaskPriority = get(task, 'is_priority', false);
    const recurringTypeKey = get(task, "typeKey", "")
    const Finish = get(task, "is_completed", false)
    if (isTaskForGuestReq && !Finish) {
      return {
        ...task,
        sectionLabel: `Guest request`,
        sortIndex: 4
      }
    } else if (isTaskPriority && !Finish) {
      return {
        ...task,
        sectionLabel: `Priority`,
        sortIndex: 3
      }
    }else if(recurringTypeKey === "RECURRING" && !Finish){
      return {
        ...task,
        sectionLabel: `Recurring`,
        sortIndex: 1
      }
    }else if(Finish){
      return {
        ...task,
        sectionLabel: `Finish`,
        sortIndex: 0
      }
    }
    else {
      return {
        ...task,
        sectionLabel: `Normal`,
        sortIndex: 2
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
