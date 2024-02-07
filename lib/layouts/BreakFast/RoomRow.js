import React, { Component, } from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  Image,
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
const RoomRowItem = ({ room, isEnableAdvancedMessages,roomNavigation, allBreakfast, updatedBreakfastArray}) => {
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
      } = room;
      const { color: housekeepingColor } = roomHousekeeping;
      const skyDK = '#00bfff';
      const isOccupied = (rsCode === 'OCC');
      const isCommented = isEnableAdvancedMessages ? (messages && messages.length) : (comment && comment.length);
      const isNoted = (roomNotes && roomNotes.length);
      const isPaused = false;
      const numTasks = get(roomTasks, 'length', 0);
      const isLargeName = name.length > 8;
      const isNoGuest = !guestStatus;
      const activeReservationId = pickActiveReservation(get(room, 'guests', []), false);
      let roomCalendar = compact(flatten(map(get(room, 'roomCalendar', []))))
  
      let activeRoomCalender =  []
      !_.isEmpty(roomCalendar) && roomCalendar.map((data) => {
        // if (data?.id === activeReservationId) {
        //   return data
        // }
          // if (data.status !== 'arrival' && data.status !== 'arrived') {
            if ((!(data.status === 'arrival' || data.status === 'arrived')) && (!(data.occupants === 0))) {
            // return data
            activeRoomCalender.push(data)
          }
      })
  
      let breakfast  = !_.isEmpty(activeRoomCalender) && activeRoomCalender[0]?.otherProperties?.filter((data) => {
        if (data?.key === "product_name" && ((data?.value.includes("PDJ")) || (data?.value.includes("ALLCOUNT")) || (data?.value?.includes("PETIT")))) {
          return data?.value
        }
      })
      
      let reservation_id = get(activeRoomCalender[0], 'id', "")
      let cameToBreakFast = !_.isEmpty(updatedBreakfastArray) && updatedBreakfastArray.filter((data) =>{
        if (reservation_id == data.reservationId) {
          return data
        }
      })
      let guest_name = get(activeRoomCalender[0], 'guest_name', "")
      let groupName = get(activeRoomCalender[0], 'group_name', "")
      let vip = get(activeRoomCalender[0], 'vip', "")
      
      return (
        <TouchableOpacity  style={[styles.container,{backgroundColor: !_.isEmpty(cameToBreakFast) ? "#F0F0F0" : "white"}]} onPress={() => roomNavigation(id)}>
          <View style={[styles.roomContainer, isNoGuest ? { width: 100 } : null]}>
            <Text style={[styles.roomName, { color: `#${housekeepingColor || '000'}` }, isLargeName ? { fontSize: 12 } : null]} numberOfLines={3}>{name}</Text>
          </View>
          <View style={[styles.guestContainer, guestStatus ? { borderColor: '#F0F0F0', borderWidth: 1, borderRadius: 1 } : { width: 0 }]}>
            <Text style={[{ fontWeight: '500', color: '#4a4a4a' }]}>{`${guestStatus && I18n.t('base.ubiquitous.' + guestStatus) || ''}`.toUpperCase()}</Text>
            {/* <Text style={[{ fontWeight: '500', color: '#4a4a4a' }]}>{newGuestStatus.toUpperCase()}</Text> */}
          </View>
          <View style={styles.spacerContainer}>
            <View>
              <Text numberOfLines={1} style={styles.guestName}>{guest_name ? guest_name : ""}</Text>
              <View style={{flexDirection:"row"}}>
              {
                vip ?
                  <View style={{alignItems:"center", justifyContent:"center",marginRight:7}}>
                    <View style={{width:"auto",backgroundColor:skyDK, borderRadius: 5, alignItems:"center",justifyContent:"center",paddingHorizontal: 5}}>
                      <Text style={styles.vip}>VIP</Text>
                    </View>
                  </View> 
               : <></>
              }
              {groupName ? <Text numberOfLines={1} style={[styles.groupeNameText,{width: vip ? 150 : 200}]}>{groupName}</Text> : <></> }
              </View>
            </View>
          </View>
          <View style={[styles.roomIconsContainer]}>
            <Icon style={{ alignSelf: "center" }} name="user" size={18} color={isGuestIn ? '#C93C46' : '#3CC86B'} />
            {!_.isEmpty(breakfast) ? 
            <View style={[styles.breakfastIconView, { backgroundColor: !_.isEmpty(breakfast) ? '#c1e4c3' : 'white' }]}>
               <MaterialIcons name="free-breakfast" size={18} color={slate.color} />
            </View> : <></>
            //  <View style={[styles.breakfastIconView]}>
            //     <Image style={{width:18,height:18}} source={require("../../images/FreeBreakfast_Yellow.png")}/>
            //  </View>
            }
          </View>
          {/* {isRoomRestocked ? <View style={styles.doneOverlay}></View> : null} */}
        </TouchableOpacity>
      )
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
      // backgroundColor: 'white',
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
      flex:1,    
      flexDirection: "row",
      marginLeft:20,
      overflow:"hidden",
    },
    roomIconsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: 60,
      marginLeft:20,
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
      width: 200,
      
    },
    vip: {
      color: "white",
      textAlign: "center",
      alignSelf: "center",
      justifyContent: "center",
      fontSize:11,
      fontWeight: "600",
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
    },
  });
  
  export default RoomRowItem;