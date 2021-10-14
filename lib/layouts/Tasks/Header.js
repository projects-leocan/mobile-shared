import React, { Component } from 'react';
import {
  View
} from 'react-native';

import {
  flxRow,
  white,
  aic
} from '../../styles';

const Header = ({ children }) => (
  <View style={[flxRow, white.bg, aic, {height: 50}]}>
    {children}
  </View>
)

export default Header;
