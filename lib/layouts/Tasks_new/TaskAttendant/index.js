import React, { Component } from 'react';
import Row from './Row';

export const TaskRoomRow = ({ task, updateTask }) => (
  <Row task={task} updateTask={updateTask} />
)

export default TaskRoomRow
