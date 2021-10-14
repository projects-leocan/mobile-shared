import React, { Component } from 'react';
import { View } from 'react-native';

import {
  red,
  green
} from 'rc-mobile-base/lib/styles';

export const Status = ({ received, show }) => show ? (
  <View style={[red.bg, received && green.bg, {width: 10}]}>
  </View>
) : (
  <View style={[{width: 10}]}>
  </View>
)

export default Status
