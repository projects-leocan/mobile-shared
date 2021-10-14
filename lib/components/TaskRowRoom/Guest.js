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
  green,
  red,
  margin,
  greyDk,
  aic,
} from 'rc-mobile-base/lib/styles';

export const Guest = ({ isGuestIn, roomName }) => (
  <View>
    {
      roomName && (
        <View style={[flxRow, aic]}>
          <Icon
            name="user"
            style={[flxCol, margin.r5]}
            color={isGuestIn ? green.color : red.color}
          />
          <Text style={[greyDk.text, flxCol]}>
            {roomName}
          </Text>
        </View>
      )
    }
  </View>
)

export default Guest
