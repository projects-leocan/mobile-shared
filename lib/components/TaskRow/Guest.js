import React, { Component } from 'react';
import {
  View,
  Text,
  Image
} from 'react-native';
import I18n from 'react-native-i18n';
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

export const Guest = ({ isGuestIn, roomName, roomHousekeeping, guestStatus }) => (
  <View>
    {
      roomName && (
        <View style={[flxRow, aic]}>
          <Text style={[greyDk.text, flxCol, { color: `#${roomHousekeeping.color || '000'}`}]}>
            {roomName}
          </Text>
          <Icon
            name="user"
            style={[flxCol, margin.l5]}
            color={isGuestIn ? green.color : red.color}
          />
          { guestStatus ? 
            <Text style={[ greyDk.text, { fontSize: 13  } ]}>
              { ` · ${guestStatus && I18n.t(`base.ubiquitous.${guestStatus}`).toUpperCase() || ''}` }
            </Text>
            : null
          }
        </View>
      )
    }
  </View>
)

export default Guest
