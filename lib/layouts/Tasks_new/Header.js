import React, { Component } from 'react';
import {
  View
} from 'react-native';

import {
  flxRow,
  white,
  aic,
  flex1
} from '../../styles';

const Header = ({ children }) => (
  <View style={[flxRow, white.bg, aic, {height: 65 }]}>
    {children}
  </View>
)

export default Header;
