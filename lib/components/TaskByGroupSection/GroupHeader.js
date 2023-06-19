import React, { Component } from 'react';
import {
  ListGroupHeader,
  ListGroupHeaderLabel,
} from './styles';

import { get } from 'lodash'
import { grey100, greyDk, splashBg } from 'rc-mobile-base/lib/styles';

const GroupHeader = ({ row, onPress }) => (
  <ListGroupHeader style={{ backgroundColor: row?.val === "f&c" ? greyDk.color : splashBg.color }} activeOpacity={0.7} index={get(row, 'value', null)} onPress={() => onPress(row)}>
    <ListGroupHeaderLabel>{row.name}</ListGroupHeaderLabel>
  </ListGroupHeader>
)

export default GroupHeader;