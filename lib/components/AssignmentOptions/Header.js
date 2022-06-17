import React from 'react';

import {
  ListHeader,
  Name,
  CheckBoxContainer
} from 'rc-mobile-base/lib/layouts/CreateTask/AssignmentSelect/styles';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { get } from 'lodash'

const Item = ({ row }) => (
  <ListHeader index={get(row, 'value', null)}>
    <Name>{row}</Name>
  </ListHeader>
)

export default Item;