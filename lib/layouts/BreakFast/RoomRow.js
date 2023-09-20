import React, { Component,  } from 'react';
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

import { get } from 'lodash/object';
import { isEqual } from 'lodash/lang';
import checkEqual from 'rc-mobile-base/lib/utils/check-equal';

import {
  green
} from 'rc-mobile-base/lib/styles';

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
    console.log("this.props.room +++",this.props.room);
    return (
      <TouchableOpacity activeOpacity={.1} style={styles.container} onPress={() => this.props.roomNavigation(id)}>
        <View style={[styles.roomContainer, isNoGuest ? { width: 100 } : null]}>
          <Text style={[styles.roomName, { color: `#${housekeepingColor || '000'}` }, isLargeName ? { fontSize: 12 } : null]} numberOfLines={3}>{ name }</Text>
        </View>
        <View style={[styles.guestContainer, guestStatus ? { borderColor: '#F0F0F0', borderWidth: 1, borderRadius: 1 } : { width : 0 }]}>
          <Text style={[{ fontWeight: '500', color: '#4a4a4a' }]}>{ `${guestStatus && I18n.t('base.ubiquitous.' + guestStatus) || ''}`.toUpperCase() }</Text>
        </View>
        <View style={[styles.attendantStatusContainer]}>
          {/* { isRoomRestocked ?
            <IcoMoonIcon name="check" size={24} color={green.color} />
            : null
          } */}
        </View>
        <View style={styles.spacerContainer}>
          <View>
            <Text style={styles.roomTasks}>name</Text>
            <Text style={styles.roomTasks}>VIP</Text>
          </View>
          <View>
            <View style={{flexDirection:"row"}}>
              <Text style={styles.roomTasks}>2 adults</Text>
              <Text style={styles.roomTasks}>2 adults</Text>
            </View>
            <Text style={styles.roomTasks}>VIP</Text>
          </View>
          {/* { numTasks ?
            <View style={styles.taskContainer}>
              <Text style={styles.roomTasks}>{ `${numTasks} tasks` }</Text>
            </View>
            : null
          } */}
        </View>
        <View style={[styles.roomIconsContainer]}>
          <Icon style={{alignSelf:"center"}} name="user" size={18} color={isGuestIn ? '#C93C46' : '#3CC86B'} />
          <View style={[ styles.breakfastIconView, {backgroundColor:isGuestIn ? '#f1b0b0' : '#c1e4c3'}]}>
            <MaterialIcons name="free-breakfast" size={18} color={slate.color} />
          </View>
          {/* <Icon name="envelope" size={18} color={isCommented ? '#4a4a4a' : '#F0F0F0'} />
          <Icon name="file-text-o" size={18} color={isNoted ? '#4a4a4a' : '#F0F0F0'} /> */}
        </View>
        { isRoomRestocked ? <View style={styles.doneOverlay}></View> : null }
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
    alignItems: 'center'
  },
  spacerContainer: {
    flex: 1,
    justifyContent: "space-around",
    flexDirection:"row"
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
  roomTasks: {
    color: '#ff8937',
  },
  breakfastIconView:{
    width:25,
    height:25,
    alignItems:"center",
    justifyContent:"center",
    borderRadius:12
  }
});

export default RoomRowItem;