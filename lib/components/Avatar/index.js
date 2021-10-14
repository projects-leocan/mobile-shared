import React, { Component } from 'react';
import { View, Image, Text } from 'react-native';

import {
  greyLt,
  jcc,
  aic
} from 'rc-mobile-base/lib/styles';

export const Avatar = ({ value, size, round, color, name }) => {
  const dims = { width: size, height: size }
  const appearance = [dims, round && { borderRadius: size / 2 }]

  if (!value) {
    return (
      <View style={[appearance, jcc, aic, color.bg]}>
        <Text>
          {name && name[0].toUpperCase() || ''}
        </Text>
      </View>
    )
  }

  return (
    <Image
      style={appearance}
      source={{uri: value}}
      resizeMethod='resize'
    />
  )
}

Avatar.defaultProps = {
  round: true,
  color: greyLt
}

export default Avatar
