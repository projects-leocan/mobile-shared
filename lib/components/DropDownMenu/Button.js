import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import ListView from 'rc-mobile-base/lib/components/ListView';
import Icon from 'react-native-vector-icons/Entypo';
import FaIcon from 'react-native-vector-icons/FontAwesome';

import {
  flxRow,
  padding,
  jcc,
  aic,
} from '../../styles';

const Button = ({ children, onPress, style }) => (
  <TouchableOpacity
    style={[flxRow, jcc, aic, padding.a10, { height: 45 }, style]}
    onPress={onPress}
  >
    {children}
  </TouchableOpacity>
)

export default Button
