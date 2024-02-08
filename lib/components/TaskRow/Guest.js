import React, { Component } from 'react';
import {
  View,
  Text,
  Image
} from 'react-native';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/FontAwesome';
import Octicons from 'react-native-vector-icons/Octicons'

import {
  flxRow,
  flxCol,
  green,
  red,
  margin,
  greyDk,
  aic,
} from 'rc-mobile-base/lib/styles';
import { LocatorProceedImage } from 'rc-mobile-base/lib/components/Room/styles';

import { last } from 'lodash';

export const renderLocatorStatus = (guests, isGuestIn) => {
  if (guests && guests.length) {
    const GuestStatus = last(guests).display

    if (GuestStatus === 'STAY') {
      // if (!isGuestIn) {
      return (
        <Octicons name="person" size={15} color={isGuestIn ? red.color : green.color} style={{ alignSelf: 'center', alignSelf: 'center', textAlign: 'center' }} />
      )
      // }
    } else if (GuestStatus === 'ARR') {
      return (
        <Octicons name="person" size={15} color={isGuestIn ? red.color : green.color} style={{ alignSelf: 'center', alignSelf: 'center', textAlign: 'center' }} />
      )
    } else if (GuestStatus === 'DEP') {
      if (!isGuestIn) {
        return (
          <LocatorProceedImage color={isGuestIn ? red.color : green.color} style={{ height: 20, width: 20 }} source={require('../../images/locator_proceed.png')} />
        )
      }
    } else if (GuestStatus === 'VAC') {
      return (
        <LocatorProceedImage style={{ height: 20, width: 20 }} source={require('../../images/locator_proceed.png')} />
      )
    }
  } else {
    return (
      <LocatorProceedImage style={{ height: 20, width: 20 }} source={require('../../images/locator_proceed.png')} />
    )
  }
}

export const Guest = ({ guests, isGuestIn, roomName, roomHousekeeping, guestStatus }) => (
  <View>
    {
      roomName ? (
        <View style={[flxRow, aic]}>
          <Text style={[greyDk.text, flxCol, { color: `#${roomHousekeeping.color || '000'}` }]}>
            {roomName}
          </Text>
          <View style={{ marginLeft: 10 }}>
            {renderLocatorStatus(guests, isGuestIn)}
          </View>
          {guestStatus ?
            <Text style={[greyDk.text, { fontSize: 13 }]}>
              {` · ${guestStatus && I18n.t(`base.ubiquitous.${guestStatus}`).toUpperCase() || ''}`}
            </Text>
            : null
          }
        </View>
      ) : null
    }
  </View>
)

export default Guest
