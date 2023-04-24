import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

import {
  flxRow,
  flxCol,
  padding,
  margin,
  blue500,
  flex1,
  flx1,
  jcc,
  jcsb,
  jcsa,
  lCenterCenter,
  aic,
  white,
  asfe,
} from 'rc-mobile-base/lib/styles';

export const ModalHeader = ({ value, onPress }) => (
  <View style={[flxRow, blue500.bg, jcsa, aic, { height: Platform.OS === "android" ? 55 : 44 }]}>
    {onPress ? <View style={{ width: 50 }}></View> : null}
    <Text style={[white.text, flx1, { fontSize: 17, textAlign: 'center'}]}>
      {value}
    </Text>
    {
      onPress ?
        <TouchableOpacity onPress={onPress} style={[lCenterCenter, margin.r10, {width: 50, height: 55}]}>
          <Icon
            name="cross"
            size={24}
            color={white.color}
          />
        </TouchableOpacity>
        : null
    }
  </View>
)

export default ModalHeader