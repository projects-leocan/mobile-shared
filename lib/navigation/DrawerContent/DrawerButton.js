import React, { Component, PropTypes } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import IcoMoonIcon from '../../components/IcoMoonIcon';

import {
  flxRow,
  aic,
  margin,
  slate,
  padding
} from '../../styles';

export const DrawerButton = ({ text, icon, onPress, ...props }) => (
  <TouchableOpacity
    style={[flxRow, margin.t15, aic]}
    onPress={onPress}
    {...props}
  >
    <View style={{ width: 40, alignItems: 'center' }}>
      { ['clipboard', 'tools'].includes(icon) ?
        <IcoMoonIcon name={icon} size={30} color={slate.color} />
        :
        <Icon name={icon} size={24} color={slate.color} />
      }
    </View>
    <Text style={[slate.text, padding.l5, {fontSize: 20}]}>
      {text}
    </Text>
  </TouchableOpacity>
)

export default DrawerButton;
