import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import {
  red,
  flex1,
  white,
  jcc,
  aic,
  flxCol,
  flxRow,
  padding
} from '../../styles';

export const DisplayError = ({ error }) => (
  <View style={[red.bg, jcc, aic, { height: 45 }]}>
    <View style={[flxRow]}>
      <Icon
        name="exclamation"
        color={white.color}
        size={16}
        style={[padding.x5]}
      />
      <Text style={[white.text]}>
        {error}
      </Text>
    </View>
  </View>
)

export default DisplayError;
