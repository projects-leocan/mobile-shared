import React, { Component } from 'react';
import { View } from 'react-native';
import {
  grey,
  margin,
  flex1,
} from 'rc-mobile-base/lib/styles';

export const Screen = ({ children }) => (
  <View style={[flex1, grey.bg]}>
    {children}
  </View>
)

export default Screen;
