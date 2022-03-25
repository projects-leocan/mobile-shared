import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';

import SwipeRow from './SwipeRow';
import Row from './Row';

export const TaskRow = ({ onSwipeoutPress, onScroll, task, ...props }) => onSwipeoutPress ?
  <SwipeRow onSwipeoutPress={onSwipeoutPress} onScroll={onScroll} task={task} {...props} /> :
  <Row {...props} task={task} />

export default TaskRow
