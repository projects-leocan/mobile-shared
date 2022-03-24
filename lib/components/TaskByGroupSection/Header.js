import React, { Component } from 'react';

import {
  ListHeader,
  Name
} from './styles';

import { get } from 'lodash'

const Item = ({ row, onPress }) => (
  <ListHeader index={get(row, 'value', null)} onPress={() => onPress(row)}>
    <Name>{row.name}</Name>
  </ListHeader>
)

export default Item;