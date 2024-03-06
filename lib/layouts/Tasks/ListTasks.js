import React, { Component } from 'react';
import { map, orderBy, get } from 'lodash';
import { ActivityIndicator } from 'react-native';
import TaskList from '../../components/TaskList';
import TaskRowExpandable from '../../components/TaskRow/Expandable';
import { blueLt } from 'rc-mobile-base/lib/styles';
import _ from 'lodash';
const ListTasks = ({ tasks, isSectionList, onSwipeoutPress, navigation, activeTab, taskFailure=null}) => {
    const mapTasksForSection = map(tasks, function (task) {
    const isTaskForGuestReq = get(task, 'is_guest_request', false);
    const isTaskPriority = get(task, 'is_priority', false);
    const recurringTypeKey = get(task, "typeKey", "")
    const is_verified = get(task, "is_verified", false)
    
    if (isTaskForGuestReq && !is_verified) {
      return {
        ...task,
        sectionLabel: `Guest request`,
        sortIndex: 4
      }
    } else if (isTaskPriority && !is_verified) {
      return {
        ...task,
        sectionLabel: `Priority`,
        sortIndex: 3
      }
    }else if(recurringTypeKey === "RECURRING" && !is_verified){
      return {
        ...task,
        sectionLabel: `Recurring`,
        sortIndex: 1
      }
    }else if(is_verified){
      return {
        ...task,
        sectionLabel: `Verified`,
        sortIndex: 0
      }
    }else {
      return {
        ...task,
        sectionLabel: `Normal`,
        sortIndex: 2
      }
    }
  })

  return(
    <>
    {
      _.isEmpty(tasks) && taskFailure?.status !== 200 ? <ActivityIndicator size="large" color={blueLt.color} style={{ alignSelf: "center", bottom: -200 }} /> :
      <TaskList
      sectionId="sectionLabel"
      tasks={orderBy(mapTasksForSection, ['sortIndex', 'date_ts'], ['desc', 'desc'])}
      isSectionList={isSectionList}
      onSwipeoutPress={onSwipeoutPress}
      renderTask={(task) => <TaskRowExpandable key={task.uuid} task={task} onSwipeoutPress={onSwipeoutPress} onTaskDetail={(task) => navigation.navigate('ExpandedTaskDetail', { task: task, activeTab: activeTab })}/>}
    />
    }
    </>
  )
}

export default ListTasks
