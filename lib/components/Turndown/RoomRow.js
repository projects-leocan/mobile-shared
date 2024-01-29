import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome'
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { get, last } from 'lodash';
import I18n from 'react-native-i18n'
import Octicons from 'react-native-vector-icons/Octicons'

import Status from './Status';

import {
  white,
  grey400,
  aic,
  aife,
  jcfs,
  jcsb,
  jcc,
  padding,
  flxRow,
  flx1,
  slate,
  orange,
  greyDk,
  margin,
  red,
  green
} from 'rc-mobile-base/lib/styles';
import { LocatorProceedImage } from 'rc-mobile-base/lib/components/Room/styles.js'

const RoomRow = ({ room, activateRoom, displayUser, auth, isAttendantApp}) => {
  // const turndownService = get(room, 'roomHousekeeping.turndownService') || '';
  const { name, turndownService, guests, guestStatus, roomCategory, turndownUser, roomHousekeeping: { color = "000" } } = room;
  const isDone = ['finish', 'dnd', 'refuse'].includes(turndownService);
  const currentGuest = guests && guests.length && guests[0];
  const anonymizeGuestNames = auth?.config?.anonymizeGuestNames;
  const messages = (room.messages || [])
    .filter(message => ['dn', 'night'].includes(message.messageType));

  let occupants = currentGuest && currentGuest.occupants;
  if (currentGuest && (currentGuest.infants || currentGuest.children)) {
    const adults = get(currentGuest, 'adults', 0);
    const children = get(currentGuest, 'children', 0);
    const infants = get(currentGuest, 'infants', 0);

    occupants = `${adults}+${children}+${infants}`;
  }

  const renderLocatorStatus = (room, isGuestIn) => {
    if (room.guests && room.guests.length) {
      const GuestStatus = last(room.guests).display
      if (GuestStatus === 'STAY') {
        if (!isGuestIn) {
          return (
            <Octicons name="person" size={30} color={isGuestIn ? red.color : green.color} />
          )
        }
      } else if (GuestStatus === 'ARR') {
        return (
          <Octicons name="person" size={30} color={isGuestIn ? red.color : green.color} />
        )
      } else if (GuestStatus === 'DEP') {
        if (room.guestStatus === 'da') {
          return (
            <Image style={styles.imageIconStyle} source={isGuestIn ? require('../../images/locator_proceed_red.png') : require('../../images/locator_proceed.png')} />
          )
        } else {
          return (
            <Image style={styles.imageIconStyle} source={isGuestIn ? require('../../images/locator_proceed_red.png') : require('../../images/locator_proceed.png')} />
          )
        }
      } else if (GuestStatus === 'VAC') {
        return (
          <Image style={styles.imageIconStyle} source={require('../../images/locator_proceed.png')} />
        )
      }
    } else {
      return (
        <Image style={styles.imageIconStyle} source={require('../../images/locator_proceed.png')} />
      )
    }
  }


  return (
    <TouchableOpacity style={styles.container} onPress={() => activateRoom(room.id)}>
      <View style={[flxRow, { justifyContent: "space-between" }]} >
        <View style={{ maxWidth: "82%" }}>
          <View style={[flxRow, jcfs, aife]}>
            <Text style={[styles.roomName, { color: `#${color}` }]}>{`${name}`}</Text>
            <Icon name="star" color={room.roomPlanning.is_priority ? orange.color : grey400.color} size={16} style={{ paddingBottom: 3, marginLeft: 4 }} />
            <Icon name="envelope" color={messages.length ? slate.color : grey400.color} size={16} style={{ paddingBottom: 3, marginLeft: 4 }} />
            <View style={[flx1]} />
          </View>
          <View style={[flxRow, aic, jcsb]}>
            <View style={[flxRow, aic, { flexWrap: 'wrap' }]}>
              <Text style={styles.guestName}>{`${roomCategory.label}`}</Text>
              {currentGuest ?
                <Text style={styles.guestName}>{` · ${currentGuest.name ? isAttendantApp && anonymizeGuestNames ? 'no name' : currentGuest.name : ''} (${occupants}) · ${I18n.t(`base.ubiquitous.${guestStatus}`).toUpperCase()}`}</Text>
                : null
              }
            </View>
            {
              displayUser && turndownUser ? (
                <View style={[flxRow, aic]}>
                  <Image
                    style={[margin.r5, { width: 20, height: 20, borderRadius: 5 }]}
                    source={{ uri: turndownUser.image }}
                  />
                  <Text>
                    {turndownUser.first_name} {turndownUser.last_name}
                  </Text>
                </View>
              ) : (
                null
              )
            }
          </View>
        </View>
        <View style={[flxRow, { maxWidth: "18%", justifyContent: "flex-end", alignItems: "center" }]} >
          {renderLocatorStatus(room, get(room, 'isGuestIn'))}
          {turndownService || turndownService.length ?
            <View style={{ marginLeft: 15 }}>
              <Status status={turndownService} />
            </View>
            : null}
        </View>
      </View>
      {isDone ?
        <View style={styles.overlay}></View>
        : null
      }
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    marginBottom: 4,
    marginRight: 4,
    marginLeft: 4,
    ...jcc,
    // ...aic,
    borderColor: grey400.color,
    ...white.bg,
    borderWidth: 1,
    borderRadius: 2,
    ...padding.x5,
    // ...flxRow
  },
  roomName: {
    ...slate.text,
    fontSize: 17
  },
  roomCategory: {
    ...slate.text,
    opacity: .9,
    marginLeft: 4,
    fontSize: 14
  },
  guestName: {
    ...greyDk.text,
    marginTop: 5,
    fontSize: 13
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,.15)'
  },
  imageIconStyle: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  }
});

RoomRow.defaultProps = {
  displayUser: false
}

export default RoomRow;
