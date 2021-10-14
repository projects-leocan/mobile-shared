import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import {
  slate,
  white,
  flxRow,
  margin,
  padding,
  flex1,
  aic,
  jcfs,
  border
} from '../../styles';

import Picture from '../../components/Picture';

const QuickNotification = ({ image, message, onPress }) => (
  <TouchableOpacity
    style={[flxRow, aic, margin.a5, white.bg, padding.a10, slate.bc, {height: 60, borderRadius: 2}]}
    onPress={onPress}
  >
    <Picture
      color={slate.color}
      size={40}
      value={image}
    />
    <View style={[margin.l10]}>
      <Text
        style={[slate.text, {fontSize: 15}]}
        numberOfLines={3}
      >
        {message}
      </Text>
    </View>
  </TouchableOpacity>
)

export default QuickNotification;
