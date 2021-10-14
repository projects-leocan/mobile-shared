import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Entypo';

import {
  margin,
  slate,
} from '../../styles';

import Button from './Button'

export const Close = ({ onPress }) => (
  <Button
    style={[margin.t15]}
    onPress={onPress}
  >
    <Icon
      name="cross"
      size={30}
      color={slate.color}
    />
  </Button>
)

export default Close
