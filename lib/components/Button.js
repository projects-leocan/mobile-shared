import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';

import { blue500, lCenterCenter } from '../styles';
import { mergeStyles } from '../utils/styles';

const defaultStyle = {
  // width: 100,
  height: 45,
  borderRadius: 4,
  ...blue500.bg,
  ...lCenterCenter
};

export const Button = ({ style, children, onPress, ...props }) => (
  <TouchableOpacity
    style={mergeStyles(defaultStyle, style)}
    onPress={onPress}
    {...props}
  >
    {children}
  </TouchableOpacity>
)

export default Button
