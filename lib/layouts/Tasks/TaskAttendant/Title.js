import React, { Component } from 'react';
import {
  Text,
} from 'react-native';

import {
  flxRow,
  margin,
  text,
} from 'rc-mobile-base/lib/styles';

export const Title = ({ value }) => value && (
  <Text style={[text.fw700, margin.t5, flxRow]}>
    {value}
  </Text>
)

export default Title
