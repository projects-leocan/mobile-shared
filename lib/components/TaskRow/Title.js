import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IcoMoonIcon from 'rc-mobile-base/lib/components/IcoMoonIcon';

import {
  flxRow,
  red,
  orange,
  margin,
  text,
  slate,
  aic,
} from 'rc-mobile-base/lib/styles';

export const Title = ({ value, isGuest = false, isPriority = false }) => value && (
  <View style={[flxRow, aic]}>
    {isGuest ?
      <IcoMoonIcon
        name="guest-priority"
        color={red.color}
        size={14}
        style={{ marginRight: 4, marginTop: 2 }}
      />
      : isPriority ?
        <Icon
          name="star"
          color={orange.color}
          size={14}
          style={{ marginRight: 4 }}
        />
        :
        null
    }

    <View style={{ flexDirection: 'column'}}>
    {value.split(/\s*,\s*/).map((item, index) => {
      return (
        <Text style={[slate.text, text.fw400, margin.t5, flxRow]}>
          {item}
        </Text>
      )
    })}
    </View>
   
  </View>
)

export default Title
