import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'
import Octicons from 'react-native-vector-icons/Octicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import IcoMoonIcon from 'rc-mobile-base/lib/components/IcoMoonIcon';
import { get, last, first, flatten, map, isEmpty, compact, find } from 'lodash'

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
  LocationText, ETAContainer, ETAText, CleaningNameContainer, GuestExactStatus, EmptyETA,
  RightCenterContainer, VipContainer, VipText, BedSheetContainer, LocatorProceedImage,
  RoomCategoryContainer, CategoryLabel
} from './styles';

import {
  green,
  red,
  slate,
  grey400
} from 'rc-mobile-base/lib/styles';
import styled, { css } from 'styled-components/native';
import moment from 'moment';

const yellowLT = '#ffdd86';
const yellowDK = '#f3bb2b';
const yellow = '#faca59';

const white = '#ffffff';
const yellowELT = '#fff6de';
const blueLT = '#e1f1ff';

const skyDK = '#00bfff';

export default class Room extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !checkEqual(this.props, nextProps)
  }

  // componentDidUpdate() {
  //   console.log(this.props.room.name, 'updated')
  // }
  renderLocatorStatus = (room, isGuestIn) => {
    if (room.guests && room.guests.length) {
      const GuestStatus = last(room.guests).display

      if (GuestStatus === 'STAY') {
        if (!isGuestIn) {
          return (
            <Octicons name="person" size={28} color={isGuestIn ? red.color : green.color} style={{ marginRight: 20, alignSelf: 'center', alignSelf: 'center', textAlign: 'center' }} />
          )
        }
      } else if (GuestStatus === 'ARR') {
        return (
          <Octicons name="person" size={28} color={isGuestIn ? red.color : green.color} style={{ marginRight: 20, alignSelf: 'center', alignSelf: 'center', textAlign: 'center' }} />
        )
      } else if (GuestStatus === 'DEP') {
        if (!isGuestIn) {
          return (
            <LocatorProceedImage color={isGuestIn ? red.color : green.color} source={require('../../images/locator_proceed.png')} />
          )
        }
      } else if (GuestStatus === 'VAC') {
        return (
          <LocatorProceedImage source={require('../../images/locator_proceed.png')} />
        )
      }
    } else {
      return (
        <LocatorProceedImage source={require('../../images/locator_proceed.png')} />
      )
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
      isShowCreditsMain = false,
      showCleaningOrderValue = false,
      orderCleaningsByRoomName = false
    } = this.props;

    const isPriority = get(room, 'roomPlanning.is_priority', 0)
    const validatePriority = get(room, 'attendantStatus', null) === "" && isPriority;
    const isChangeSheets = get(room, 'isChangeSheets', false);
    let vip = !isEmpty(compact(flatten(map(get(room, 'roomCalendar', []), 'vip'))));

    // let vip = get(room, ['roomCalendar', 0, 'vip'], null);
    const activeReservationId = pickActiveReservation(get(room, 'guests', []), false);

    let eta = get(room, ['guests', 0, 'eta'], null);
    let etd = get(room, ['guests', 0, 'etd'], null);

    // if (activeReservationId) {
    //   const foundActiveGuest = find(get(room, 'guests', []), { pmsId: activeId });
    //   const foundActivePms = find(get(room, 'roomCalendar', []), { pms_id: activeId });
    //   eta = foundActiveGuest ? ['arrived', 'arrival'].includes(get(foundActiveGuest, 'status')) && get(foundActiveGuest, ['eta']) : eta;
    //   etd = foundActiveGuest ? ['departed', 'departure'].includes(get(foundActiveGuest, 'status')) && get(foundActiveGuest, ['etd']) : etd;
    //   vip = foundActivePms ? get(foundActivePms, 'vip') : vip;
    // }

    return (
      <Base onPress={() => roomNavigation(room.id)} style={{
        borderRadius: 8, backgroundColor: validatePriority ? yellow : white, shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        marginBottom: 15,
        elevation: 4,
        marginHorizontal: 15
      }}>
        <Container>
          <LeftContainer style={{ flex: 1 }}>
            <LeftTopSection>
              <LeftContainer style={{ flexDirection: 'row' }}>

                <GuestStatus
                  guestStatus={get(room, 'guestStatus', null)}
                  isPriority={validatePriority}
                />

                <Name
                  name={`${room.name}`}
                  housekeeping={room.roomHousekeeping}
                />

                <Status
                  status={calcStatus(isAttendant, isRunner, room)}
                  isPaused={isAttendant && (get(room, 'attendantStatus') === "paused" || get(room, 'update.isPaused'))}
                />
              </LeftContainer>
            </LeftTopSection>

            {get(room, 'buildingName', '')
              ?
              <LeftCenterContainer style={{ flex: 1 }}>
                <LocationText>{get(room, 'buildingName', '')}, {String(get(room, 'floorName', '')).toLowerCase().includes('floor') ? get(room, 'floorName', '') : `Floor ${get(room, 'floorName', '')}`}</LocationText>
              </LeftCenterContainer>
              : null
            }

            <LeftBottomContainer style={{ flexDirection: 'row' }}>
              {this.renderETA(room.guestStatus, eta, validatePriority)}

              {this.renderETD(room.guestStatus, etd, validatePriority)}

            </LeftBottomContainer>

            {get(room, 'roomCategoryName', '')
              ?
              <RoomCategoryContainer>
                <CategoryLabel>{get(room, 'roomCategoryName', '')}</CategoryLabel>
              </RoomCategoryContainer>
              : null
            }

            {!isEmpty(get(room, 'roomPlanning', {}))
              && (
                <ExtraContainer>
                  <Special
                    tasks={get(room, 'roomTasks', [])}
                    showCleaningOrderValue={showCleaningOrderValue}
                    orderCleaningsByRoomName={orderCleaningsByRoomName}
                    calculated_scheduled_order={get(room, 'calculated_scheduled_order', null)}
                    scheduledOrder={get(room, 'roomPlanning.scheduled_order', null)}
                    scheduledTs={get(room, 'roomPlanning.scheduled_ts', null)}
                  />
                </ExtraContainer>
              )}


          </LeftContainer>

          <RightContainer style={{ alignItems: 'center', justifyContent: 'space-evenly', flexGrow: 1 }}>
            <CleaningNameContainer style={{ alignSelf: 'flex-end', width: '100%' }}>
              {get(room, 'roomPlanning.name')
                ?
                <GuestExactStatus isPriority={validatePriority} style={{ backgroundColor: validatePriority ? yellowDK : blueLT }}>
                  <ETAText>{get(room, 'roomPlanning.name', '')}</ETAText>
                </GuestExactStatus>
                : null
              }
            </CleaningNameContainer>

            <RightCenterContainer>
              {vip
                ?
                <VipContainer bgColor={skyDK}>
                  <VipText>VIP</VipText>
                </VipContainer>
                : null
              }

              {isChangeSheets
                ?
                <BedSheetContainer>
                  <Icon name="bed" color={red.color} size={20} style={{ marginRight: 5 }} />
                </BedSheetContainer>
                : null
              }
            </RightCenterContainer>

            <CleaningNameContainer style={{ alignSelf: 'flex-end', justifyContent: 'flex-end' }}>
              {this.renderLocatorStatus(room, get(room, 'isGuestIn'))}
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