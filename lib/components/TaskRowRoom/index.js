import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';
import {
  flex1,
} from 'rc-mobile-base/lib/styles';
import ModalToggler from '../ModalToggler';

import SwipeoutOptions from './SwipeoutOptions';
import Row from './Row';
import { swipeoutButtons } from './utils';

export const TaskRoomRow = ({ task, updateTask }) => (
  <Row task={task} updateTask={updateTask} />
)

export default TaskRoomRow
