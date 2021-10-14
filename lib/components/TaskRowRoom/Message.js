import React, { Component } from 'react';
import {
  View,
  Text,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  flxRow,
  flxCol,
  margin,
  greyDk,
  aic,
} from 'rc-mobile-base/lib/styles';

export const Message = ({ value }) => (
  <View style={[{ height: 10 }]}>
    {
      value &&
        (
          <View style={[flxRow, aic, margin.t5]}>
            <Icon
              name="envelope"
              style={[flxCol, margin.r5]}
              color={greyDk.color}
            />
            <Text style={[greyDk.text, flxCol, {fontSize: 11}]}>
              {value}
            </Text>
          </View>
        )
    }
  </View>
)

export default Message
