import React from 'react'
import {
  TouchableOpacity,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  white,
  padding
} from 'rc-mobile-base/lib/styles';

const LeftButton = ({ onPress, icon, ...props }) => (
  <TouchableOpacity
    style={[padding.x20, padding.y10]}
    onPress={onPress}
    {...props}
  >
    <Icon name={icon} size={24} color={white.color} />
  </TouchableOpacity>
)

export const Hamburger = ({ onPress }) => (
  <LeftButton testID="openDrawer" icon="bars" onPress={onPress} />
)

export const Back = ({ onPress }) => (
  <LeftButton icon="chevron-left" onPress={onPress} />
)
