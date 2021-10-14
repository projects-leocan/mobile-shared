import React from 'react';
import Icons from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { get, first, last, find } from 'lodash';
import { unixPrettyTime, prettyDate } from '../../utils/dates';
import moment from 'moment';

import {
  ExtraRow,
  ExtraRowValue,
  ExtraRowLabel,
  ExtraRowContainer
} from './styles'

export default ExtraItems = ({ room, isAttendant, isRunner, isShowCreditsMain }) => {
  if (!get(room, 'guests.length', 0) && !isShowCreditsMain) {
    return null;
  }

  const { guests, guestStatus, roomPlanning } = room;

  let eta = null;
  let etd = null;
  let breakfast = null;
  let features = null;
  let credits = null;

  if (guestStatus === "da" && guests.length > 1) {
    const today = moment().format('YYYY-MM-DD');
    const departGuest = find(guests, { "checkOutDate": today });
    const arrivalGuest = find(guests, { "checkInDate": today });
    if (departGuest && get(departGuest, 'etd')) {
      etd = get(departGuest, 'etd');
    }
    if (arrivalGuest && get(arrivalGuest, 'eta')) {
      eta = get(arrivalGuest, 'eta');
    }

  } else if (guestStatus === "arr") {
    eta = get(first(guests), 'eta');
    // features = get(first(guests), 'guest.room_features');
  } else if (guestStatus === "dep") {
    etd = get(last(guests), 'etd');
    // features = get(last(guests), 'guest.room_features');
  } else if (guestStatus === "stay") {
    // features = get(first(guests), 'guest.room_features');
  }

  if (isRunner && get(first(guests), 'guest.breakfast')) {
    breakfast = get(first(guests), 'guest.breakfast');
  }

  if (isAttendant && isShowCreditsMain && get(roomPlanning, 'credits')) {
    credits = get(roomPlanning, 'credits');
  }

  if (!eta && !etd && !features && !breakfast && !credits) {
    return null;
  }

  return (
    <ExtraRow>
      { eta ?
        <ExtraRowContainer>
          <ExtraRowLabel>ETA</ExtraRowLabel>
          <ExtraRowValue>{ eta && unixPrettyTime(eta) }</ExtraRowValue>
        </ExtraRowContainer>
        : null
      }

      { etd ?
        <ExtraRowContainer>
          <ExtraRowLabel>ETD</ExtraRowLabel>
          <ExtraRowValue>{ etd && unixPrettyTime(etd) }</ExtraRowValue>
        </ExtraRowContainer>
        : null
      }

      { features ? 
        <ExtraRowContainer>
          <Icons name="user-plus" color="#4a4a4a" size={11} style={{ opacity: .7, marginRight: 4 }} />
          <ExtraRowValue>{ features }</ExtraRowValue>
        </ExtraRowContainer>
        : null
      }

      { breakfast ?
        <ExtraRowContainer>
          <MaterialIcons name="free-breakfast" color="#4a4a4a" size={11} style={{ opacity: .7, marginRight: 4 }} />
          <ExtraRowValue>{ breakfast }</ExtraRowValue>
        </ExtraRowContainer>
        : null
      }

      { credits ?
        <ExtraRowContainer>
          <ExtraRowLabel>Credits</ExtraRowLabel>
          <ExtraRowValue>{ credits }</ExtraRowValue>
        </ExtraRowContainer>
      : null
      }
    </ExtraRow>
  )
}