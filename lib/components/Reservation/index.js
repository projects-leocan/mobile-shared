import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Image
} from 'react-native';
import I18n from 'react-native-i18n';
import moment from 'moment';
import { get } from 'lodash/object';
import { last, first, take, uniqBy } from 'lodash/array';
import { isEmpty } from 'lodash/lang'
import { filter, groupBy, orderBy } from 'lodash/collection';
import keyBy from 'lodash/keyBy';
import Icon from 'react-native-vector-icons/FontAwesome';
import FlagData from './Flag.json'

import ReservationProgress from './ReservationProgress';
import ReservationNights from './ReservationNights';
import GuestSubheader from './GuestSubheader';
import _ from "lodash"

const ARRIVAL_STATUSES = ['arrived', 'arrival', 'future_arrival'];
const DEPARTURE_STATUSES = ['departed', 'departure'];
const STAY_STATUSES = ['stay'];

const dateSort = function (a, b) {
  return new Date(a.check_in_date) - new Date(b.check_in_date);
}

const displayStatus = (mCheckin, guestStatus, expectedArrivalDate, guestOriginalStatus) => {

  const today = moment().format('YYYY-MM-DD');
  if (guestOriginalStatus === "arrival") {
    if (expectedArrivalDate > today) {
      return 'FUTURE ARR'
    }
    else {
      return guestStatus
    }
  }
  else {
    return guestStatus
  }


  // const today = moment().format('YYYY-MM-DD');
  // const formateCheckIn = moment(mCheckin).format('YYYY-MM-DD')
  // if (String(guestStatus).trim() === 'ARR') {
  //   if (formateCheckIn === today) {
  //     return 'ARR'
  //   } else {
  //     return 'ARR FUTURE'
  //   }
  // } else {
  //   return guestStatus
  // }
}

const FlagImage = ({ img }) => {
  return(
    FlagData?.map((data) => data?.code === img?.value || data?.name?.toUpperCase() === img?.value?.toUpperCase() ? <Text style={{fontSize:50}}>{data?.emoji}</Text> : <></>)
  )
}

const FlagView = ({ Country }) => {
  if (!_.isEmpty(Country)) {
    return (
          <FlagImage img={!_.isEmpty(Country) && Country[0]} />
        )
  }
  return <></>
}

const CountryImage = ({otherProperties, Country}) =>{
  let isClubMed = false
  {
    otherProperties?.map((data) => {
      if (data.key === "source" && data.value === "ClubMed") {
        isClubMed = true
      }
    })
  }
  if (isClubMed === false) {
    return <FlagView Country={Country} />
  }else{
    return <></>
  }
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
  guestStatus,
  bedName,
  guest_id,
  handler = () => null,
  style,
  isAttendantApp,
  expectedArrivalDate,
  guestOriginalStatus,
  otherProperties,
  Flag,
  country,
  anonymizeGuestNames
}) => (
  <View style={[!isActive ? styles.cellContainer2 : styles.cellContainer, { paddingBottom: 2, ...style }]} onPress={() => handler(guest_id)}>
    <View style={styles.topHeader}>
      <View style={styles.leftContainer} onPress={() => handler(guest_id)}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} onResponderTerminationRequest={(env) => false} style={{ flexGrow: 1, zIndex: 99 }} contentContainerStyle={{ flexGrow: 1, zIndex: 99, alignItems: 'center', justifyContent: 'center' }} >
          <Text style={styles.statusText}>{displayStatus(mCheckin, guestStatus, expectedArrivalDate, guestOriginalStatus)}</Text>
        </ScrollView>
      </View>

      <View style={styles.centerBodyContainer}>
        <View style={[styles.bodyTitleContainer, style]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 1, zIndex: 99, }} contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }} >

            <Text style={styles.textItem}>{guestName ? isAttendantApp && anonymizeGuestNames ? 'no name' : guestName : ""}</Text>
            {!isAttendantApp &&
              <>
                <Text style={[styles.textItem, { paddingLeft: 3, paddingRight: 3 }]}>·</Text>
                <Text style={[styles.textItem, { marginRight: 2 }]}>{guestOccupants}</Text>
                <Icon name="user" size={13} color="#5E5E5E" />
              </>
            }

          </ScrollView>
        </View>
      </View>
      <View style={[styles.leftContainer, { flexDirection: "row" }]}>
        {
          bedName ?
            <ScrollView horizontal showsHorizontalScrollIndicator={false} onResponderTerminationRequest={(env) => false} style={{ flexGrow: 1, zIndex: 99 }} contentContainerStyle={{ flexGrow: 1, zIndex: 99, alignItems: 'center', justifyContent: 'center' }} >
              <Text style={styles.statusText}>{bedName}</Text>
            </ScrollView> : <></>
        }
        {
          otherProperties?.map((data) => {
            return (data.key === "source" && data.value === "ClubMed" ? <FlagView Country={Flag} /> : <></>)
          })
        }
        {
          // otherProperties?.map((data) => {
          //   return (data.key === "source" && !(data.value === "ClubMed") ? <FlagView Country={country} /> : <></>)
          // })
          <CountryImage otherProperties={otherProperties} Country={country}/>
        }
      </View>
    </View>

    <TouchableOpacity style={styles.bodyContainer} onPress={() => handler(guest_id)}>
      <View style={styles.leftContainer}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateDay}>
            {mCheckin.format('DD')}
          </Text>
          <Text style={styles.dateMonth}>
            {mCheckin.format('MMM').toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.centerBodyContainer}>
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
      </View>

      <View style={styles.leftContainer}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateDay}>
            {mCheckout.format('DD')}
          </Text>
          <Text style={styles.dateMonth}>
            {mCheckout.format('MMM').toUpperCase()}
          </Text>
        </View>
      </View>

    </TouchableOpacity>

    {/* {!isActive &&
      <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'white', opacity: .7 }} />
    } */}
  </View>
)

class Reservation extends Component {

  render() {
    const { room, style, isHideTitle, isExpanded = false, isHorizontal = false, activeId, onChangeActive, isAttendantApp } = this.props;

    const today = moment().format('YYYY-MM-DD');
    const roomStatus = get(room, 'guestStatus', '');
    if (!get(room, ['roomCalendar', 'length'])) {
      return null;
    }

    let reservations = [];
    const guestsIndex = keyBy(get(room, 'guests', []), 'pmsId');

    const allItems = get(room, ['roomCalendar']).sort(dateSort)
      .map((entry, index) => {
        const expectedArrivalDate = get(entry, ['expected_arrival_date'], '')
        const guestOriginalStatus = get(entry, ['status'], '')

        const guestName = get(entry, ['guest_name'], '');
        let guestOccupants = get(entry, ['occupants'], 1);
        const adults = get(entry, 'adults', 0);
        const children = get(entry, 'children', 0);
        const infants = get(entry, 'infants', 0);
        const checkinDate = get(entry, ['check_in_date'], '').slice(0, 10);
        const checkoutDate = get(entry, ['check_out_date'], '').slice(0, 10);
        const vip = get(entry, ['vip'], '')
        const pmsId = get(entry, ['pms_id'], index);
        const guestStatus = get(first(filter(get(room, 'guests', []), { guest_id: entry.id })), 'display', '');
        const bedName = get(entry, 'bed_name', '')
        const otherProperties = get(entry, 'otherProperties', [])
        const Flag = otherProperties?.filter((data) => {
          if (data.key === "nationality") {
            return data.value
          }
        })
        const country =  otherProperties?.filter((data) => {
          if (data.key === "country") {
            return data.value
          }
        })
        if (children || infants) {
          guestOccupants = `${adults}+${children}+${infants}`;
        }

        if (!checkinDate || !checkoutDate) {
          return null;
        }

        if (roomStatus === 'da') {
          const allGuests = groupBy(get(room, 'guests', []), 'display');
          const arrGuest = uniqBy([...get(allGuests, 'ARR', []), ...get(allGuests, 'TODAY', [])], 'guest_id');
          const arrGuestCheckIn = get(first(arrGuest), 'checkInDate', null);

          if (guestStatus === 'DEP' && arrGuestCheckIn === today) {
            return null;
          }
        }

        const mCheckin = moment(checkinDate);
        const mCheckout = moment(checkoutDate);
        const mToday = moment(moment().format('YYYY-MM-DD'));
        const totalNights = Math.min(mCheckout.diff(mCheckin, 'days'), 366);
        const currentNights = Math.min(mToday.diff(mCheckin, 'days'), 366);

        return {
          guestName,
          guestOccupants,
          vip,
          totalNights,
          currentNights,
          mCheckin,
          mCheckout,
          pmsId,
          guestStatus,
          bedName,
          guest_id: get(entry, 'id', ''),
          expectedArrivalDate: expectedArrivalDate,
          guestOriginalStatus: guestOriginalStatus,
          otherProperties,
          Flag,
          country
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

    const sortReservationData = orderBy(reservations, [reservation => get(reservation, 'bedName', '') ? get(reservation, 'bedName', '').toLowerCase() : ''], ['asc']);

    const withoutFutureArr = filter(sortReservationData, function (obj) {
      const today = moment().format('YYYY-MM-DD');
      const formateCheckIn = moment(get(obj, 'mCheckin', null)).format('YYYY-MM-DD');
      const guestStatus = String(get(obj, 'guestStatus', null)).trim();
      if (String(get(room, 'guestStatus', null)).toUpperCase() === 'STAY') {
        const isFutureArr = moment(get(obj, 'mCheckin', null)).isAfter()
        if (isFutureArr) {
          return false
        } else {
          return true
        }
      } else if (guestStatus === 'ARR') {
        if (formateCheckIn === today) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    })


    const withFutureArr = filter(sortReservationData, function (obj) {
      const today = moment().format('YYYY-MM-DD');
      const formateCheckIn = moment(get(obj, 'mCheckin', null)).format('YYYY-MM-DD')
      const guestStatus = String(get(obj, 'guestStatus', null)).trim();

      if (guestStatus === 'ARR') {
        if (formateCheckIn === today) {
          return false
        } else {
          return true
        }
      } else {
        return false
      }
    })

    const validateReservationList = !isEmpty(withoutFutureArr) ? withoutFutureArr : withFutureArr
    const anonymizeGuestNames = this.props.auth?.config?.anonymizeGuestNames;
    return (
      <View style={[style]}>
        {isHideTitle ?
          null :
          <Text style={styles.title}>{I18n.t('attendant.components.reservation-component.reservation').toUpperCase()}</Text>
        }

        {isHorizontal && validateReservationList.length > 1 ?
          <ScrollView horizontal contentContainerStyle={{ height: 100, marginBottom: 10 }}>
            {validateReservationList.map((reservation, index) =>
              <Entry
                key={index}
                isActive={activeId === reservation.guest_id}
                handler={onChangeActive}
                style={{ width: 400 }}
                anonymizeGuestNames = {anonymizeGuestNames}
                {...reservation}
              />
            )}
          </ScrollView>
          :
          <View>
            {validateReservationList.map((reservation, index) =>
              <Entry
                key={index}
                isActive={activeId === reservation.guest_id}
                isAttendantApp={isAttendantApp}
                handler={onChangeActive}
                anonymizeGuestNames = {anonymizeGuestNames}
                {...reservation}
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
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
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
    flexGrow: 1,
    paddingBottom: 8
  },

  // new style
  cellContainer: {
    paddingBottom: 12,
    backgroundColor: 'white',
  },
  cellContainer2: {
    paddingBottom: 12,
    backgroundColor: 'white',
    opacity: 0.4
  },
  leftContainer: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  centerBodyContainer: {
    flex: 0.6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textItem: {
    color: '#5E5E5E',
    fontSize: 15
  },
  bodyTitleContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    height: 40,
  },

  // 
  topHeader: {
    height: 40,
    width: '100%',
    flexDirection: 'row'
  },
  bodyContainer: {
    width: '100%',
    flexDirection: 'row'
  },
  statusText: {
    color: '#7f0000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bedNameText: {
    color: '#7f0000',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default Reservation;