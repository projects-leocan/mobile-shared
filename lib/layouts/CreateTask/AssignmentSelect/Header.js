import React, { Component } from 'react';

import {
  ListHeader,
  Name,
  CheckBoxContainer
} from './styles';

import {
  splashBg
} from 'rc-mobile-base/lib/styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { get } from 'lodash'

const Item = ({ row, onPress }) => (
  <ListHeader index={get(row, 'value', null)} onPress={() => onPress(row)}>
    <CheckBoxContainer>
      <Ionicons
        name={row.isSelected ? 'ios-checkbox' : 'ios-square-outline'}
        size={30}
        color={splashBg.color}
      />
    </CheckBoxContainer>
    <Name>{row.name}</Name>
  </ListHeader>
)

export default Item;