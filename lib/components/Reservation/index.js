import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import I18n from 'react-native-i18n';
import moment from 'moment';
import { get } from 'lodash/object';
import { last } from 'lodash/array';
import keyBy from 'lodash/keyBy';

import ReservationProgress from './ReservationProgress';
import ReservationNights from './ReservationNights';
import GuestSubheader from './GuestSubheader';

const ARRIVAL_STATUSES = ['arrived', 'arrival'];
const DEPARTURE_STATUSES = ['departed', 'departure'];
const STAY_STATUSES = ['stay'];

const dateSort = function(a, b) {
  return new Date(a.check_in_date) - new Date(b.check_in_date);
}

const Entry = ({
  guestName,
  guestOccupants,
  vip,
  mCheckin,
  mCheckout,
  currentNights,
  totalNights,
  pmsId,
  isActive,
  handler = () => null,
  style
}) => (
  <TouchableOpacity style={{ paddingBottom: 2, ...style }} onPress={() => handler(pmsId)}>
    <GuestSubheader
      name={guestName}
      occupants={guestOccupants}
      vip={vip}
      style={{ marginBottom: 0 }}
      />
    <View style={styles.infoContainer}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateDay}>
          { mCheckin.format('DD') }
        </Text>
        <Text style={styles.dateMonth}>
          { mCheckin.format('MMM').toUpperCase() }
        </Text>
      </View>
      <View style={styles.progressContainer}>
        <ReservationProgress
          step={currentNights}
          total={totalNights}
          />
        <ReservationNights
          step={currentNights}
          total={totalNights}
          />
      </View>
      <View style={styles.dateContainer}>
        <Text style={styles.dateDay}>
          { mCheckout.format('DD') }
        </Text>
        <Text style={styles.dateMonth}>
          { mCheckout.format('MMM').toUpperCase() }
        </Text>
      </View>
    </View>

    { !isActive &&
      <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'white', opacity: .7 }} />
    }
  </TouchableOpacity>
)

class Reservation extends Component {

  render() {
    const { room, style, isHideTitle, isExpanded = false, isHorizontal = false, activeId, onChangeActive } = this.props;
    
    if (!get(room, ['roomCalendar', 'length'])) {
      return null;
    }

    let reservations = [];
    const guestsIndex = keyBy(get(room, 'guests', []), 'pmsId');

    const allItems = get(room, ['roomCalendar']).sort(dateSort)
      .map((entry, index) => {
        const guestName = get(entry, ['guest_name'], '');
        let guestOccupants = get(entry, ['occupants'], 1);
        const adults = get(entry, 'adults', 0);
        const children = get(entry, 'children', 0);
        const infants = get(entry, 'infants', 0);
        const checkinDate = get(entry, ['check_in_date'], '').slice(0, 10);
        const checkoutDate = get(entry, ['check_out_date'], '').slice(0, 10);
        const vip = get(entry, ['vip'], '')
        const pmsId = get(entry, ['pms_id'], index);

        if (children || infants) {
          guestOccupants = `${adults}+${children}+${infants}`;
        }

        if (!checkinDate || !checkoutDate) {
          return null;
        }

        const mCheckin = moment(checkinDate);
        const mCheckout = moment(checkoutDate);
        const mToday = moment(moment().format('YYYY-MM-DD'));
        const totalNights = mCheckout.diff(mCheckin, 'days');
        const currentNights = mToday.diff(mCheckin, 'days');

        return {
          guestName,
          guestOccupants,
          vip,
          totalNights,
          currentNights,
          mCheckin,
          mCheckout,
          pmsId
        }
      }).filter(Boolean);

    // reservations
    //   .forEach(reservation => console.log(get(guestsIndex, [reservation.pmsId, 'status'], null)))

    if (!isExpanded) {
      // reservations = [ ...reservations.slice(reservations.length -1) ]
      reservations = allItems
        .filter(reservation => ARRIVAL_STATUSES.includes(get(guestsIndex, [reservation.pmsId, 'status'], null)));
      if (!reservations.length) {
        reservations = allItems
          .filter(reservation => STAY_STATUSES.includes(get(guestsIndex, [reservation.pmsId, 'status'], null)));
      }
      if (!reservations.length) {
        reservations = allItems
          .filter(reservation => DEPARTURE_STATUSES.includes(get(guestsIndex, [reservation.pmsId, 'status'], null)));
      }
    } else {
      reservations = allItems;
    }

    return (
      <View style={[style]}>
        { isHideTitle ?
          null:
          <Text style={styles.title}>{ I18n.t('attendant.components.reservation-component.reservation').toUpperCase() }</Text>
        }

        { isHorizontal && reservations.length > 1 ?
          <ScrollView horizontal contentContainerStyle={{ height: 100, marginBottom: 10 }}>
            { reservations.map((reservation, index) =>
              <Entry
                key={index}
                isActive={activeId === reservation.pmsId}
                handler={onChangeActive}
                style={{ width: 400 }}
                { ...reservation }
                />
            )}
          </ScrollView>
        :
          <View>
            { reservations.map((reservation, index) =>
              <Entry
                key={index}
                isActive={activeId === reservation.pmsId}
                handler={onChangeActive}
                { ...reservation }
                />
            )}
          </View>
        }
        
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    
  },
  title: {
    marginLeft: 15,
    marginBottom: 2,
    color: '#373737',
    fontWeight: '500',
    opacity: .8
  },
  infoContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 8,
    paddingTop: 4,
  },
  dateContainer: {
    alignItems: 'center'
  },
  dateDay: {
    color: '#373737',
    fontSize: 28,
    fontWeight: 'bold'
  },
  dateMonth: {
    color: '#373737',
    fontSize: 15,
    fontWeight: 'bold'
  },
  progressContainer: {
    flexGrow: 1
  }
});

export default Reservation;