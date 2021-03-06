import React, { Component } from 'react';
import { View } from 'react-native';

import {
  taskCompleted,
  taskStarted,
  taskAccepted,
  taskWaiting,
  taskPending,
  taskPaused,
  taskCancelled,
  taskUnclaimed
} from 'rc-mobile-base/lib/styles';

const getColor = (task) => {
  if (task.is_completed) {
    return taskCompleted;
  } else if (task.is_cancelled) {
    return taskCancelled;
  } else if (task.is_paused) {
    return taskPaused;
  } else if (task.is_started) {
    return taskWaiting;
  } else if (task.is_claimed) {
    return taskAccepted;
  } else {
    return taskUnclaimed;
  }
  return taskUnclaimed;
}

export const Status = ({ task }) => (
  <View style={[getColor(task).bg, {width: 10, height: 'auto'}]}>
  </View>
)

export default Status
