import React, { Component } from 'react';
import {
  View,
  SectionList
} from 'react-native';

import {
  jcc
} from 'rc-mobile-base/lib/styles';

import TaskTableBase from '../TaskTableBase';
import H1 from '../H1';

import Row from './Row';
import RowWithOptions from './RowWithOptions';
import Header from './Header';

const renderRow = (onUpdate) => (props) => {
  if (props.withOptions) {
    return (<RowWithOptions onUpdate={onUpdate} {...props} />)
  }
  return (<Row onUpdate={onUpdate} {...props} />)
}

export const TaskTable = ({ tasks, onUpdate, renderHeader, sectionId }) => (
  <SectionList
    renderItem={({ item, index }) => renderRow(onUpdate)({ ...item, index })}
    renderSectionHeader={({ section }) => renderHeader(section)}
    sections={tasks}
    keyExtractor={(item, index) => item.uuid}
    />
)

export default TaskTable
