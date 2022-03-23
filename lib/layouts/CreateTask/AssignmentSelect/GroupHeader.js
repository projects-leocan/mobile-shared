import React, { Component } from 'react';
import {
  ListGroupHeader,
  ListGroupHeaderLabel,
  CheckBoxContainer
} from './styles';

import { white } from 'rc-mobile-base/lib/styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { get } from 'lodash'

const GroupHeader = ({ row, onPress }) => (
  <ListGroupHeader activeOpacity={0.7} index={get(row, 'value', null)} onPress={() => onPress(row)}>
    <CheckBoxContainer>
      <Ionicons
        name={row.isSelected ? 'ios-checkbox' : 'ios-square-outline'}
        size={30}
        color={white.color}
      />
    </CheckBoxContainer>
    <ListGroupHeaderLabel>{row.name}</ListGroupHeaderLabel>
  </ListGroupHeader>
)

export default GroupHeader;