import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import IcoMoonIcon from 'rc-mobile-base/lib/components/IcoMoonIcon';
import { get, last, first } from 'lodash'

import GuestStatus from './GuestStatus';
import Name from './Name';
import Status from './Status';
import Special from './Special';
import Mice from './Mice';
import ExtraItems from './ExtraItems';

import { calcStatus } from './utils';
import pickActiveReservation from 'rc-mobile-base/lib/utils/pick-active-reservation';
import checkEqual from 'rc-mobile-base/lib/utils/check-equal';

import {
  Base,
  Container,
  NameContainer,
  NameText,
  StatusContainer,
  ExtraContainer,
  ExtraItemContainer,
  ExtraItemText,
  Spacer,
  IconsContainer,
  FinishedOverlay
} from './styles';

import {
  green,
  red,
  slate,
  grey400
} from 'rc-mobile-base/lib/styles';

export default class Room extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !checkEqual(this.props, nextProps)
  }

  // componentDidUpdate() {
  //   console.log(this.props.room.name, 'updated')
  // }
  
  render() {
    const {
      room,
      isAttendant = false,
      isRunner = false,
      roomNavigation,
      isEnableAdvancedMessages = false,
      isShowCreditsMain = false
    } = this.props;
    
    return (
      <Base onPress={() => roomNavigation(room._id)}>
        <Container>
          <Name
            name={room.name}
            housekeeping={room.roomHousekeeping}
            />
      
          <GuestStatus
            guestStatus={room.guestStatus}
            />
      
          <Status
            status={calcStatus(isAttendant, isRunner, room)}
            isPaused={isAttendant && (get(room, 'attendantStatus') === "paused" || get(room, 'update.isPaused'))}
            />
      
          <ExtraContainer>
            <Special
              tasks={get(room, 'roomTasks', [])}
              scheduledOrder={get(room, 'roomPlanning.scheduled_order', null)}
              scheduledTs={get(room, 'roomPlanning.scheduled_ts', null)}
              />
          </ExtraContainer>
      
          <Spacer />
      
          <IconsContainer>
            { room.isChangeSheets &&
              <Icon name="bed" color={red.color} size={16} style={{ marginRight: 5 }} />
            }
            { room.guests && room.guests.length && last(room.guests).status === "departed" && first(room.guests).status !== "arrived" ?
              <Entypo name="log-out" color={room.isGuestIn ? green.color : red.color} size={16} style={{ marginRight: 5 }} />
              :
              <Icon name="user" size={16} color={room.isGuestIn ? green.color : red.color} style={{ marginRight: 5 }} />
            }
            {/* <Ionicons name="ios-hand" size={16} color={red.color} style={{ marginRight: 5 }} /> */}
            {/* <Ionicons name="ios-thumbs-up" size={16} color={green.color} style={{ marginRight: 5 }} /> */}
            
            <Icon name="envelope" color={(isEnableAdvancedMessages ? (room.messages && room.messages.length) : (room.comment && room.comment.length)) ? slate.color : grey400.color} size={16} />
            { get((pickActiveReservation(room.guests, false, true) || {}), 'guest.mice') &&
              <Mice color={get((pickActiveReservation(room.guests, false, true) || {}), 'guest.mice.color')} style={{ marginLeft: 5 }} />
            }
          </IconsContainer>
        </Container>
        
        <ExtraItems
          room={room}
          isAttendant={isAttendant}
          isRunner={isRunner}
          isShowCreditsMain={isShowCreditsMain}
          />

        { isRunner && room.isRoomRestocked &&
          <FinishedOverlay />     
        }
      </Base>
    )
  }
}

// <Container onPress={() => roomNavigation(room._id)} isLong={(isAttendant && config.isAttendantLongPress)} isWhiteBg>
// export default Room = ({ room, config = {}, isAttendant = false, isRunner = false, roomNavigation }) => (
//   <Container onPress={() => roomNavigation(room._id)}>
//     <Name
//       name={room.name}
//       housekeeping={room.roomHousekeeping}
//       />

//     <GuestStatus
//       guestStatus={room.guestStatus}
//       />

//     <Status
//       status={calcStatus(isAttendant, isRunner, room)}
//       isPaused={isAttendant && (get(room, 'attendantStatus') === "paused" || get(room, 'update.isPaused'))}
//       />

//     <ExtraContainer>
//       <Special
//         tasks={get(room, 'roomTasks', [])}
//         scheduledOrder={get(room, 'roomPlanning.scheduled_order', null)}
//         scheduledTs={get(room, 'roomPlanning.scheduled_ts', null)}
//         />
//     </ExtraContainer>

//     <Spacer />

//     <IconsContainer>
//       { room.isChangeSheets &&
//         <Icon name="bed" color={red.color} size={16} style={{ marginRight: 5 }} />
//       }
//       { room.guests && room.guests.length && last(room.guests).status === "departed" && first(room.guests).status !== "arrived" ?
//         <Entypo name="log-out" color={room.isGuestIn ? green.color : red.color} size={16} style={{ marginRight: 5 }} />
//         :
//         <Icon name="user" size={16} color={room.isGuestIn ? green.color : red.color} style={{ marginRight: 5 }} />
//       }
      
//       <Icon name="envelope" color={(config.isEnableAdvancedMessages ? (room.messages && room.messages.length) : (room.comment && room.comment.length)) ? slate.color : grey400.color} size={16} />
//       { get((pickActiveReservation(room.guests, false, true) || {}), 'guest.mice') &&
//         <Mice color={get((pickActiveReservation(room.guests, false, true) || {}), 'guest.mice.color')} style={{ marginLeft: 5 }} />
//       }
//     </IconsContainer>

//     { isRunner && room.isRoomRestocked &&
//       <FinishedOverlay />     
//     }
//   </Container>
// )