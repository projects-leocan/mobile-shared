import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import I18n from 'react-native-i18n'

import {
  margin,
  flxRow,
  flxCol,
  circle,
  green,
  aic,
  red,
  taskCompleted,
  taskStarted,
  taskAccepted,
  taskWaiting,
  taskPending,
  taskCancelled,
  taskPaused,
} from 'rc-mobile-base/lib/styles';

import H2 from '../H2';

const buildStatus = (task) => {
  if (task.is_completed) {
    return { label: I18n.t('base.tasktable.status.finished'), color: taskCompleted }
  }
  if (task.is_cancelled) {
    return { label: I18n.t('base.tasktable.status.canceled'), color: taskCancelled }
  }
  if (task.is_paused) {
    return { label: I18n.t('base.tasktable.status.paused'), color: taskPaused }
  }
  if (task.is_started) {
    return { label: I18n.t('base.tasktable.status.started'), color: taskStarted }
  }
  if (task.is_claimed) {
    return { label: I18n.t('base.tasktable.status.waiting'), color: taskWaiting }
  }
  if (task.is_rejected) {
    return { label: I18n.t('base.tasktable.status.rejected'), color: taskCancelled }
  }
  return { label: I18n.t('base.tasktable.status.pending'), color: taskPending }
}

export const Status = ({ task }) => {
  const status = buildStatus(task);

  return (
    <View style={[flxRow, aic]}>
      <View style={[flxCol, circle(5), status.color.bg, margin.r5]}>
      </View>
      <View style={[flxCol]}>
        <H2>{ status.label }</H2>
      </View>
    </View>
  )
}
export default Status
