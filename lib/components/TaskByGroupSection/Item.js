import React, { Component } from 'react';
import TaskTable from 'rc-mobile-base/lib/components/TaskTable';
import transformIntoSections from 'rc-mobile-base/lib/utils/tasks-sections-transform';

import {
  ListItem,
} from './styles';

import { get } from 'lodash'

const Item = ({ row, onPress, index, onUpdate, renderHeader }) => (
  <ListItem index={index} onPress={() => onPress(row)}>
    <TaskTable
      onUpdate={onUpdate}
      // tasks={transformIntoSections(get(row, 'taskList', []), get(row, 'value', null))}
      tasks={get(row, 'taskList', [])}
      renderHeader={renderHeader}
    />
  </ListItem>
)

export default Item;