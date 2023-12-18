import React, { Component } from 'react';
import {
  View,
  SectionList,
  FlatList
} from 'react-native';

import {
  jcc
} from 'rc-mobile-base/lib/styles';

import TaskTableBase from '../TaskTableBase';
import H1 from '../H1';

import Row from './Row';
import RowWithOptions from './RowWithOptions';
import Header from './Header';
import _ from 'lodash'

import { get } from 'lodash';

const renderRow = (onUpdate) => (props) => {
  if (props.withOptions) {
    return (<RowWithOptions onUpdate={onUpdate} {...props} />)
  }
  return (<Row onUpdate={onUpdate} {...props} />)
}

export const TaskTable = ({ tasks, onUpdate, renderHeader, sectionId, isHaveMultipleBuilding }) => {
  const taskList = get(tasks, 'data', []);
  let sortedTask = !_.isEmpty(tasks) && tasks.sort((a, b) => a.date_ts - b.date_ts);
  let revTask = !_.isEmpty(sortedTask) && _.reverse(sortedTask)
  return revTask.map((task, index) => {
    return (
      renderRow(onUpdate)({ ...task, index, isHaveMultipleBuilding })
    )
  })
  // <SectionList
  //   renderItem={({ item, index }) => renderRow(onUpdate)({ ...item, index })}
  //   renderSectionHeader={({ section }) => renderHeader(section)}
  //   sections={tasks}
  //   keyExtractor={(item, index) => item.uuid}
  // />
}

export default TaskTable
