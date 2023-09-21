import React, { Component, } from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  slate,
} from '../../styles';
import IcoMoonIcon from 'rc-mobile-base/lib/components/IcoMoonIcon';

import { get, compact, flatten, map } from 'lodash';
import { isEqual } from 'lodash/lang';
import checkEqual from 'rc-mobile-base/lib/utils/check-equal';
import _ from "lodash"
import {
  green
} from 'rc-mobile-base/lib/styles';
import pickActiveReservation from 'rc-mobile-base/lib/utils/pick-active-reservation';

class RoomRowItem extends Component {

  render() {
    const { isEnableAdvancedMessages } = this.props;
    const {
      id,
      name,
      roomHousekeeping,
      guestStatus,
      isGuestIn,
      roomStatus: { code: rsCode },
      comment,
      attendantStatus,
      isRoomRestocked,
      roomNotes,
      messages,
      roomTasks
    } = this.props.room;

    const { color: housekeepingColor } = roomHousekeeping;
    const isOccupied = (rsCode === 'OCC');
    const isCommented = isEnableAdvancedMessages ? (messages && messages.length) : (comment && comment.length);
    const isNoted = (roomNotes && roomNotes.length);
    const isPaused = false;
    const numTasks = get(roomTasks, 'length', 0);
    const isLargeName = name.length > 8;
    const isNoGuest = !guestStatus;
    const room = this.props.room
    const activeReservationId = pickActiveReservation(get(room, 'guests', []), false);
    let roomCalendar = compact(flatten(map(get(room, 'roomCalendar', []))))

    let activeRoomCalender = !_.isEmpty(roomCalendar) && roomCalendar.filter((data) => {
      if (data?.id === activeReservationId) {
        return data
      }
    })


    let guest_name = get(activeRoomCalender[0], 'guest_name', "")
    let adults = get(activeRoomCalender[0], 'adults', 0)
    let children = get(activeRoomCalender[0], 'children', 0)
    let infants = get(activeRoomCalender[0], 'infants', 0)
    let occupants = get(activeRoomCalender[0], 'occupants', 0)
    let groupName = get(activeRoomCalender[0], 'group_name', "")
    let vip = get(activeRoomCalender[0], 'vip', "")
    let guestOccupants 
    if (children || infants) {
      guestOccupants = `${adults}+${children}+${infants}`;
    }else{
      guestOccupants = occupants
    }
    return (
      <TouchableOpacity activeOpacity={.1} style={styles.container} onPress={() => this.props.roomNavigation(id)}>
        <View style={[styles.roomContainer, isNoGuest ? { width: 100 } : null]}>
          <Text style={[styles.roomName, { color: `#${housekeepingColor || '000'}` }, isLargeName ? { fontSize: 12 } : null]} numberOfLines={3}>{name}</Text>
        </View>
        <View style={[styles.guestContainer, guestStatus ? { borderColor: '#F0F0F0', borderWidth: 1, borderRadius: 1 } : { width: 0 }]}>
          <Text style={[{ fontWeight: '500', color: '#4a4a4a' }]}>{`${guestStatus && I18n.t('base.ubiquitous.' + guestStatus) || ''}`.toUpperCase()}</Text>
        </View>
        <View style={styles.spacerContainer}>
          <View>
            <Text numberOfLines={1} style={styles.guestName}>{guest_name ? guest_name : ""}</Text>
            {vip ?<Text style={styles.vip}>VIP</Text> : <></>}
          </View>
          <View>
          {guestOccupants ?
              <View style={styles.adultsChildrenIconView}>
                <Icon style={{ alignSelf: "center" }} name="user" size={15} color={slate.color} /> 
                <Text style={styles.adultsText}>{ " " + guestOccupants}</Text>
              </View> : <></> }
              {groupName ? <Text numberOfLines={1} style={styles.groupeNameText}>{groupName}</Text> : <></> }
          </View>
        </View>
        <View style={[styles.roomIconsContainer]}>
          <Icon style={{ alignSelf: "center" }} name="user" size={18} color={isGuestIn ? '#C93C46' : '#3CC86B'} />
          <View style={[styles.breakfastIconView, { backgroundColor: isGuestIn ? '#f1b0b0' : '#c1e4c3' }]}>
            <MaterialIcons name="free-breakfast" size={18} color={slate.color} />
          </View>
        </View>
        {isRoomRestocked ? <View style={styles.doneOverlay}></View> : null}
      </TouchableOpacity>
    )
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { room: currentRoom } = this.props;
    const { room: newRoom } = nextProps;

    return !checkEqual(currentRoom, newRoom, 'name')
      || !checkEqual(currentRoom, newRoom, 'roomStatus')
      || !checkEqual(currentRoom, newRoom, 'housekeepingStatus')
      || !checkEqual(currentRoom, newRoom, 'roomCalendar')
      || !checkEqual(currentRoom, newRoom, 'isGuestIn')
      || !checkEqual(currentRoom, newRoom, 'attendantStatus')
      || !checkEqual(currentRoom, newRoom, 'comment')
      || !checkEqual(currentRoom, newRoom, 'roomNotes.length')
      || !checkEqual(currentRoom, newRoom, 'roomTasks')
      || !checkEqual(currentRoom, newRoom, 'isRoomRestocked')
      || !checkEqual(currentRoom, newRoom, 'update.isPaused');
  }
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    marginBottom: 4,
    marginRight: 4,
    marginLeft: 4,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: '#E0E0E0',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 2,
    paddingLeft: 5,
    paddingRight: 5,
    flexDirection: 'row',
  },
  roomContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: 60,

  },
  roomName: {
    fontSize: 17
  },
  guestContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 32
  },
  attendantStatusContainer: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "red"
  },
  spacerContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly"
    // paddingLeft: 20,
    // paddingRight:20
    // backgroundColor:"green"
  },
  roomIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 60,
  },
  iconStyle: {
    marginRight: 6
  },
  doneOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#4a4a4a',
    opacity: .3
  },
  taskContainer: {
    backgroundColor: '#C93C46',
    justifyContent: 'center',
    alignItems: 'center',
    width: 65,
    borderRadius: 5,
    padding: 4
  },
  guestName: {
    color: slate.color,
    width: 120,
  },
  vip: {
    color: slate.color
  },
  breakfastIconView: {
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12
  },
  groupeNameText: {
    color: slate.color,
    width:80,
    // backgroundColor:"red"
  },
  adultsText: {
    color: slate.color
  },
  adultsChildrenIconView:{
    flexDirection: "row",
    width:80, 
    justifyContent:"center" 
  }
});

export default RoomRowItem;