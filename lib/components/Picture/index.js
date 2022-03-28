import React, { Component } from 'react';
import { View, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import Lightbox from 'react-native-lightbox';
import FastImage from 'react-native-fast-image';

import {
  grey,
  jcc,
  aic
} from 'rc-mobile-base/lib/styles';
import { isEmpty } from 'lodash';

const { width, height } = Dimensions.get('window');

export const Picture = ({ value, size, round, icon, color, backupStyle, enableLightbox=false }) => {
  const dims = { width: size, height: size }
  const appearance = [dims, round && { borderRadius: size / 2 }]

  if (isEmpty(value)) {
    const iconColor = color || grey.color;
    const iconName = icon || 'image';
    const iconSize = size - 15;
    return (
      <View style={[jcc, aic, ...appearance, backupStyle]}>
        <Icon
          color={iconColor}
          name={iconName}
          size={iconSize}
        />
      </View>
    )
  }

  if (!enableLightbox) {
    return (
      <FastImage
        style={appearance}
        source={{uri: value[0]}}
        resizeMethod='resize'
        />
    )
  }

  return (
    <Lightbox
      key={value}
      renderContent={() => <Image style={{ height: height / 2 }} resizeMode="contain" source={{ uri: value }} />}
      swipeToDismiss={false}
      >
      <FastImage
        style={appearance}
        source={{uri: value[0]}}
        resizeMethod='resize'
        />
    </Lightbox>
  )
}

export default Picture
