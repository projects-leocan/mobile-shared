import React, { Component } from 'react';
import { View } from 'react-native';

import {
  taskCompleted,
  taskStarted,
  taskAccepted,
  taskWaiting,
  taskPending,
  taskCancelled,
  taskUnclaimed
} from 'rc-mobile-base/lib/styles';

const getColor = (task) => {
  if (task.is_completed) {
    return taskCompleted;
  } else if (task.is_cancelled) {
    return taskCancelled;
  } else if (task.is_paused) {
    return taskPending;
  } else if (task.is_started) {
    return taskStarted;
  } else if (task.is_claimed) {
    return taskAccepted;
  } else {
    return taskUnclaimed;
  }
  return taskUnclaimed;
}

export const Status = ({ task }) => (
  <View style={[getColor(task).bg, {width: 10, height: 68}]}>
  </View>
)

export default Status
