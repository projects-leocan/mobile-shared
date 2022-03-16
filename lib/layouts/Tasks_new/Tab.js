import React, { Component } from 'react';
import {
  View
} from 'react-native';

import { flex1 } from '../../styles';

const Tab = ({ value, active, children }) => value === active ? (
  <View style={[flex1]}>
    {children}
  </View>
) : null

export default Tab;
