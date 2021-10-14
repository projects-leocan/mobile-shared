import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';

import {
  eitherGrey_100_200,
  flxRow,
  aic,
} from 'rc-mobile-base/lib/styles';
import { mergeStyles } from 'rc-mobile-base/lib/utils/styles';

export const RowBase = ({ index, children, style }) => (
  <View style={mergeStyles([flxRow, eitherGrey_100_200(index % 2).bg, aic, { minHeight: 64 }], style)}>
    {children}
  </View>
)

export default RowBase
