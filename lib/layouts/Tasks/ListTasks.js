import React, { Component } from 'react';

import TaskList from '../../components/TaskList';
import TaskRowExpandable from '../../components/TaskRow/Expandable';

const ListTasks = ({ tasks, onSwipeoutPress }) => (
  <TaskList
    sectionId="category"
    tasks={tasks}
    onSwipeoutPress={onSwipeoutPress}
    renderTask={(task) => <TaskRowExpandable key={task.uuid} task={task} onSwipeoutPress={onSwipeoutPress} />}
  />
)

export default ListTasks
