import React, { Component } from 'react';
import {
  ListGroupHeader,
  ListGroupHeaderLabel,
} from './styles';

import { get } from 'lodash'

const GroupHeader = ({ row, onPress }) => (
  <ListGroupHeader activeOpacity={0.7} index={get(row, 'value', null)} onPress={() => onPress(row)}>
    <ListGroupHeaderLabel>{row.name}</ListGroupHeaderLabel>
  </ListGroupHeader>
)

export default GroupHeader;