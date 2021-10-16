import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  flxRow,
  flxCol,
  flex1,
  jcc,
  aic,
  margin,
} from '../../styles';

const Opener = ({ text, onPress, style }) => (
  <View style={[flxRow, jcc, aic, { minHeight: 45 }, style.selectedOption]}>
    <TouchableOpacity
      onPress={onPress}
      style={[flxRow, jcc, aic, flex1, { minHeight: 45 }]}
    >
      <Text style={[{fontSize: 16}]}>
        {text}
      </Text>
      <Icon
        style={[margin.l5]}
        name="caret-down"
      />
    </TouchableOpacity>
  </View>
)

export default Opener
