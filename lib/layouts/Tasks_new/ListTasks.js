import React, { Component } from 'react';
import { View } from 'react-native';

import TaskList from '../../components/TaskList';
import TaskRowExpandable from '../../components/TaskRow/Expandable';

const ListTasks = ({ tasks, isSectionList, onSwipeoutPress }) => (
  <TaskList
    sectionId="category"
    tasks={tasks}
    isSectionList={isSectionList}
    onSwipeoutPress={onSwipeoutPress}
    renderTask={(task) => <TaskRowExpandable key={task.uuid} task={task} onSwipeoutPress={onSwipeoutPress} />}
  />
)

export default ListTasks
