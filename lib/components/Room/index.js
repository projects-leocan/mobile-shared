import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import IcoMoonIcon from 'rc-mobile-base/lib/components/IcoMoonIcon';
import { get, last, first, flatten, map } from 'lodash'

import GuestStatus from './GuestStatus';
import Name from './Name';
import CleaningName from './CleaningName';
import Status from './Status';
import Special from './Special';
import Mice from './Mice';
import ExtraItems from './ExtraItems';
import { unixPrettyTime } from '../../utils/dates';

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
  FinishedOverlay,
  LeftContainer, RightContainer, LeftTopSection, LeftCenterContainer, LeftBottomContainer,
  LocationText, ETAContainer, ETAText, CleaningNameContainer, GuestExactStatus, EmptyETA
} from './styles';

import {
  green,
  red,
  slate,
  grey400
} from 'rc-mobile-base/lib/styles';
import styled, { css } from 'styled-components/native';

const yellowLT = '#ffdd86';
const yellowDK = '#f3bb2b';
const yellow = '#faca59';

const white = '#ffffff';
const yellowELT = '#fff6de';
const blueLT = '#e1f1ff';


export default class Room extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !checkEqual(this.props, nextProps)
  }

  // componentDidUpdate() {
  //   console.log(this.props.room.name, 'updated')
  // }

  renderCleanerStatus = (roomGuests) => {
    if (roomGuests && roomGuests.length) {
      const guestStatus = flatten(map(roomGuests, 'status'));
      const guestIsActive = flatten(map(roomGuests, 'isActive'));

      if (guestStatus.includes('stay')) {
        return (
          <Icon name="user" size={28} color={guestIsActive.includes(true) ? red.color : green.color} style={{ marginRight: 20, alignSelf: 'center', alignSelf: 'center', textAlign: 'center' }} />
        )
      } else if (guestStatus.includes('departure') || guestStatus.includes('departed')) {
        return (
          <Entypo name="log-out" color={guestIsActive.includes(true) ? red.color : green.color} size={28} style={{ marginRight: 20, textAlign: 'center', alignSelf: 'center' }} />
        )
      } else {
        <Entypo name="log-out" color={green.color} size={28} style={{ marginRight: 20, textAlign: 'center', alignSelf: 'center' }} />
      }
    }
  }

  renderETD = (guestStatus, etd, isPriority) => {
    const GuestStatus = String(guestStatus).toUpperCase();
    if (etd) {
      if (GuestStatus === 'DEP') {
        return (
          <ETAContainer isPriority={isPriority}>
            <ETAText>Dep {etd && unixPrettyTime(etd)}</ETAText>
          </ETAContainer>
        )
      } else if (GuestStatus === 'VAC' || GuestStatus === 'STAY') {
        return (
          <EmptyETA />
        )
      }
    }
  }

  renderETA = (guestStatus, eta, isPriority) => {
    const GuestStatus = String(guestStatus).toUpperCase();
    if (eta) {
      if (GuestStatus === 'ARR') {
        return (
          <ETAContainer isPriority={isPriority}>
            <ETAText>Arr {eta && unixPrettyTime(eta)}</ETAText>
          </ETAContainer>
        )
      } else if (GuestStatus === 'VAC' || GuestStatus === 'STAY') {
        return (
          <EmptyETA />
        )
      }
    }
  }

  render() {
    const {
      room,
      isAttendant = false,
      isRunner = false,
      roomNavigation,
      isEnableAdvancedMessages = false,
      isShowCreditsMain = false
    } = this.props;

    const isPriority = false;

    const activeReservationId = pickActiveReservation(get(room, 'guests', []), false);

    let eta = get(room, ['guests', 0, 'eta'], null);
    let etd = get(room, ['guests', 0, 'etd'], null);

    if (activeReservationId) {
      const foundActiveGuest = find(get(room, 'guests', []), { pmsId: activeId });
      eta = foundActiveGuest ? ['arrived', 'arrival'].includes(get(foundActiveGuest, 'status')) && get(foundActiveGuest, ['eta']) : eta;
      etd = foundActiveGuest ? ['departed', 'departure'].includes(get(foundActiveGuest, 'status')) && get(foundActiveGuest, ['etd']) : etd;
    }

    return (
      <Base onPress={() => roomNavigation(room.id)} style={{
        borderRadius: 8, backgroundColor: isPriority ? yellow : white, shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        marginBottom: 15,
        elevation: 4,
        marginHorizontal: 15
      }}>
        <Container>
          <LeftContainer>
            <LeftTopSection>
              {room.guestStatus
                &&
                <GuestStatus
                  guestStatus={room.guestStatus}
                  isPriority={isPriority}
                />
              }

              <Name
                name={`${room.name}`}
                housekeeping={room.roomHousekeeping}
              />

              <Status
                status={calcStatus(isAttendant, isRunner, room)}
                isPaused={isAttendant && (get(room, 'attendantStatus') === "paused" || get(room, 'update.isPaused'))}
              />
            </LeftTopSection>

            <LeftCenterContainer>
              <LocationText>{get(room, 'buildingName', '')}, {get(room, 'floorName', '')}</LocationText>
            </LeftCenterContainer>

            <LeftBottomContainer style={{ flexDirection: 'row' }}>
              {this.renderETA(room.guestStatus, eta, isPriority)}

              {this.renderETD(room.guestStatus, etd, isPriority)}

            </LeftBottomContainer>

          </LeftContainer>

          <RightContainer style={{ alignItems: 'center', justifyContent: 'space-evenly' }}>
            <CleaningNameContainer style={{ alignSelf: 'flex-end' }}>
              {get(room, 'roomPlanning.name')
                &&
                <GuestExactStatus isPriority={isPriority} style={{ backgroundColor: isPriority ? yellowDK : blueLT }}>
                  <ETAText>{get(room, 'roomPlanning.name', '')}</ETAText>
                </GuestExactStatus>
              }
            </CleaningNameContainer>

            <CleaningNameContainer style={{ alignSelf: 'flex-end' }}>
              {this.renderCleanerStatus(room.guests)}
            </CleaningNameContainer>

          </RightContainer>
        </Container>
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