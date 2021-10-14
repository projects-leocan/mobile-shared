import React from 'react';

import {
  View
} from 'react-native';

import {
  margin,
  padding,
  greyDk,
  border
} from 'rc-mobile-base/lib/styles';

export const Divider = () => (
  <View
    style={[margin.a0, padding.a0, border.a0, border.t1, {height: 0, borderColor: '#DFDFDF'}]}
  />
)

export default Divider
