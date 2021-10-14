import React, { Component } from 'react';
import { View, Text } from 'react-native';
import I18n from 'react-native-i18n';

import {
  taskCompleted,
  taskStarted,
  taskAccepted,
  taskWaiting,
  taskPending,
  taskCancelled,
  taskUnclaimed,
  white,
  jcc,
  aic,
  text,
  margin
} from 'rc-mobile-base/lib/styles';

const getStatus = (task) => {
  if (task.is_completed) {
    return {
      color: taskCompleted,
      text: I18n.t('base.taskcard.status.completed')
    }
  } else if (task.is_cancelled) {
    return {
      color: taskCancelled,
      text: I18n.t('base.taskcard.status.cancelled')
    }
  } else if (task.is_paused) {
    return {
      color: taskPending,
      text: I18n.t('base.taskcard.status.pending')
    }
  } else if (task.is_started) {
    return {
      color: taskStarted,
      text: I18n.t('base.taskcard.status.started')
    }
  } else if (task.is_claimed) {
    return {
      color: taskAccepted,
      text: I18n.t('base.taskcard.status.accepted')
    }
  } else {
    return {
      color: taskUnclaimed,
      text: I18n.t('base.taskcard.status.pending')
    }
  }
  return {
    color: taskUnclaimed,
    text: I18n.t('base.taskcard.status.pending')
  }
}

export const Status = ({ task }) => {
  const status = getStatus(task)
  return (
    <View style={[status.color.bg, margin.t25, jcc, aic, {width: 100, height: 40}]}>
      <Text style={[white.text, text.fw700]}>
        {status.text}
      </Text>
    </View>
  )
}

export default Status
