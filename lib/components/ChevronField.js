import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ListView from 'rc-mobile-base/lib/components/ListView';

import {
  flxRow,
  flexGrow1,
  margin,
  padding,
  text,
  jcfs,
  aic,
  jcc,
  white,
  slate,
} from 'rc-mobile-base/lib/styles';

export const ChevronField = ({ value, onPress }) => (
  <View style={[white.bg, jcc]}>
    <TouchableOpacity
      style={[flxRow, flexGrow1, aic, jcfs, padding.l15, {height: 55}]}
      onPress={onPress}
    >
      <Text style={[slate.text, margin.r5, text.fw500]}>
        {value}
      </Text>
      <Icon
        name="chevron-down"
        size={11}
        color={slate.color}
      />
    </TouchableOpacity>
  </View>
)

export default ChevronField;
