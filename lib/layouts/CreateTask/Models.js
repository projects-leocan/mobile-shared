import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import ListView from 'rc-mobile-base/lib/components/ListView';

import {
  flxCol,
  flxRow,
  margin,
  padding,
  text,
  white,
  grey400,
  blueLt, 
  slate,
  aic,
  jcc
} from 'rc-mobile-base/lib/styles';

import Picture from '../../components/Picture';

const Model = ({ onPress, value, show }) => (
  <TouchableOpacity
    onPress={() => onPress(value)}
    style={[flxCol, white.bg, grey400.bc, margin.r5, { width: 95 }, value.isSelected ? blueLt.bc : null]}
  >
    <Picture
      size={93}
      value={value.image}
    />
    <Text style={[slate.text, margin.t10, text.center, text.fw600]}>
      {value.name}
    </Text>
  </TouchableOpacity>
)

export const Models = ({ onPress, value, show, style }) => show ? (
  <View style={[flxCol, white.bg, grey400.bc, padding.a15, jcc, { height: 170 }, style]}>
    <ListView
      horizontal={true}
      data={value}
      renderRow={(model) => <Model onPress={onPress} value={model} />}
    />
  </View>
) : null

export default Models
