import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';

import {
  margin,
  padding,
  greyDk,
  grey,
  slate,
  text
} from 'rc-mobile-base/lib/styles';
import H2 from 'rc-mobile-base/lib/components/H2';

export const SectionHeader = ({ value, color, style }) => (
  <View style={[margin.t20, padding.l10, margin.b5, style]}>
    <H2 style={[color ? color.text : greyDk.text, text.fw700, { fontSize: 13 }]}>
      {value}
    </H2>
  </View>
)

export default SectionHeader
