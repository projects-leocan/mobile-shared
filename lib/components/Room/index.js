import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome'
import Octicons from 'react-native-vector-icons/Octicons'
import { get, last, first, flatten, map, isEmpty, compact, find } from 'lodash'

import Name from './Name';
import Status from './Status';
import Special from './Special';
import { unixPrettyTime } from '../../utils/dates';

import { calcStatus } from './utils';
import pickActiveReservation from 'rc-mobile-base/lib/utils/pick-active-reservation';

import {
  Base, Container,
  LeftContainer, RightContainer,
  LocationLabelContainer, LocationText, RoomInfoContainer, SpecialInfoContainer, VipContainer, VipText,
  BedSheetContainer, RoomStatusOuterContainer, RoomStatusContainer, RoomStatusText, ETAContainer, ETAText,
  RoomCategoryContainer, CategoryLabel, CleaningNameContainer, GuestExactStatus, LocatorProceedImage, ExtraContainer,
  GuestExactStatusLabel, CleaningStatusContainer, PlaceHolderView, CleaningNameContainerInner, SpecialText
} from './styles';

import {
  green,
  red,
  slate,
  grey400,
  orange
} from 'rc-mobile-base/lib/styles';
import _ from "lodash"
import moment from 'moment';
const yellowLT = '#ffdd86';
const yellowDK = '#f3bb2b';
const yellow = '#faca59';

const white = '#ffffff';
const yellowELT = '#fff6de';
const blueLT = '#e1f1ff';

const skyDK = '#00bfff';

export default class Room extends React.Component {

  renderLocatorStatus = (room, isGuestIn) => {
    if (room.guests && room.guests.length) {
      const GuestStatus = last(room.guests).display

      if (GuestStatus === 'STAY') {
        if (!isGuestIn) {
          return (
            <Octicons name="person" size={38} color={isGuestIn ? red.color : green.color} />
          )
        }
      } else if (GuestStatus === 'ARR') {
        return (
          <Octicons name="person" size={38} color={isGuestIn ? red.color : green.color} />
        )
      } else if (GuestStatus === 'DEP') {
        if (room.guestStatus === 'da') {
          return (
            <LocatorProceedImage source={isGuestIn ? require('../../images/locator_proceed_red.png') : require('../../images/locator_proceed.png')} />
          )
        } else {
          return (
            <LocatorProceedImage source={isGuestIn ? require('../../images/locator_proceed_red.png') : require('../../images/locator_proceed.png')} />
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
          <RoomStatusContainer>
            <RoomStatusText>DEP</RoomStatusText>
            <ETAContainer isPriority={isPriority}>
              {/* <ETAText>{etd && unixPrettyTime(etd)}</ETAText> */}
              <ETAText>{etd && etd}</ETAText>
            </ETAContainer>
          </RoomStatusContainer>
        )
      }
    }
  }


  renderETA = (guestStatus, eta, isPriority) => {
    const GuestStatus = String(guestStatus).toUpperCase();
    if (eta) {
      if (GuestStatus === 'ARR') {
        return (
          <RoomStatusContainer>
            <RoomStatusText>ARR</RoomStatusText>
            <ETAContainer isPriority={isPriority}>
              {/* <ETAText>{eta && unixPrettyTime(eta)}</ETAText> */}
              <ETAText>{eta && eta}</ETAText>
            </ETAContainer>
          </RoomStatusContainer>
        )
      }
    }
  }

  renderEtaEtdBoth = (guestStatus, guests, isPriority) => {
    const GuestStatus = String(guestStatus).toUpperCase();
    let sortGuestData = !_.isEmpty(guests) ? [...guests].sort((a, b) => b?.status.localeCompare(a?.status)) : []

    if (GuestStatus === 'DA') {
      return (
        <>
          {
            !_.isEmpty(sortGuestData) && (
              sortGuestData.map((gue) => {
                return (
                  gue?.status === "departed" || gue?.status === "departure" ?
                    <RoomStatusContainer>
                      <RoomStatusText>DEP</RoomStatusText>
                      {gue?.etdTime ?
                        <ETAContainer>
                          <ETAText>{gue?.etdTime}</ETAText>
                        </ETAContainer>
                        : null}
                    </RoomStatusContainer>
                    :
                    gue?.status === "arrival" || gue?.status === "arrived" ?
                      <RoomStatusContainer>
                        <RoomStatusText>ARR</RoomStatusText>
                        {
                          gue?.etaTime ?
                            <ETAContainer isPriority={isPriority}>
                              <ETAText>{gue?.etaTime}</ETAText>
                            </ETAContainer>
                            : null}
                      </RoomStatusContainer>
                      : null
                )
              })
            )
          }
        </>
      )
    }

  }

  renderRoomStatus = (guestStatus) => {
    if (guestStatus) {
      const GuestStatus = String(guestStatus).toUpperCase();

      if (GuestStatus !== 'ARR' && GuestStatus !== 'DEP' && GuestStatus !== 'DA') {
        return (
          <RoomStatusContainer>
            <RoomStatusText>{GuestStatus}</RoomStatusText>
          </RoomStatusContainer>
        )
      }
    }
  }

  render() {
    const {
      room,
      hotelPlanning,
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

    const isPlanningAssign = !isEmpty(get(room, 'roomPlanning', []));

    const isChangeSheets = isPlanningAssign ? get(room, 'roomPlanning.is_change_sheets', 0) : get(room, 'isChangeSheets', false);

    // const isChangeSheets =  get(room, 'isChangeSheets', false);

    let vip = !isEmpty(compact(flatten(map(get(room, 'roomCalendar', []), 'vip'))));

    // let vip = get(room, ['roomCalendar', 0, 'vip'], null);
    const activeReservationId = pickActiveReservation(get(room, 'guests', []), false);

    let eta = get(room, ['guests', 0, 'eta'], null);
    let etd = get(room, ['guests', 0, 'etd'], null);

    let etaTime = get(room, ['guests', 0, 'etaTime'], null);
    let etdTime = get(room, ['guests', 0, 'etdTime'], null);

    let getStartString = get(room, 'roomPlanning.recommended_interval_start_string', null)
    let roomMessage = get(room, 'roomMessage', [])
    let guests = get(room, 'guests', [])

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
          <LeftContainer>
            {get(room, 'buildingName', '')
              ?
              <LocationLabelContainer>
                <LocationText>{get(room, 'buildingName', '')}, {String(get(room, 'floorName', '')).toLowerCase().includes('floor') ? get(room, 'floorName', '') : `Floor ${get(room, 'floorName', '')}`}</LocationText>
              </LocationLabelContainer>
              :
              <LocationLabelContainer>
                <LocationText>{String(get(room, 'floorName', '')).toLowerCase().includes('floor') ? get(room, 'floorName', '') : `Floor ${get(room, 'floorName', '')}`}</LocationText>
              </LocationLabelContainer>
            }

            <RoomInfoContainer>
              <Name
                name={`${room.name}`}
                housekeeping={room.roomHousekeeping}
              />

              {vip ? <SpecialInfoContainer>
                <VipContainer bgColor={skyDK}>
                  <VipText>VIP</VipText>
                </VipContainer>
              </SpecialInfoContainer>
                : null}

              {isChangeSheets
                ?
                <SpecialInfoContainer>
                  <BedSheetContainer>
                    <Icon name="bed" color={red.color} size={20} style={{ marginRight: 5 }} />
                  </BedSheetContainer>
                </SpecialInfoContainer>
                : null}

              {roomMessage
                ?
                <SpecialInfoContainer>
                  <BedSheetContainer>
                    <Icon name="envelope" color={slate.color} size={16} />
                  </BedSheetContainer>
                </SpecialInfoContainer>
                : null}

            </RoomInfoContainer>

            <RoomStatusOuterContainer>
              {this.renderETA(room.guestStatus, etaTime, validatePriority)}

              {this.renderETD(room.guestStatus, etdTime, validatePriority)}

              {this.renderEtaEtdBoth(room.guestStatus, guests, validatePriority)}

              {this.renderRoomStatus(room.guestStatus)}
            </RoomStatusOuterContainer>

            {get(room, 'roomCategoryName', '')
              ?
              <RoomCategoryContainer>
                <CategoryLabel>{get(room, 'roomCategoryName', '')}</CategoryLabel>
              </RoomCategoryContainer>
              : null
            }
          </LeftContainer>

          <RightContainer>
            <CleaningNameContainer style={{ alignSelf: 'flex-end', width: '100%' }}>
              {get(room, 'roomPlanning.name')
                ?
                // <GuestExactStatus isPriority={validatePriority} style={{ backgroundColor: validatePriority ? yellowDK : blueLT }}>
                <CleaningNameContainerInner
                  style={{
                    backgroundColor: get(room, 'roomPlanning.cleaningColor', null) ? get(room, 'roomPlanning.cleaningColor', null) + '50' : null,
                    borderColor: get(room, 'roomPlanning.cleaningColor', null),
                    borderWidth: get(room, 'roomPlanning.cleaningColor', null) ? 3 : 1
                  }}
                >
                  <GuestExactStatusLabel>{get(room, 'roomPlanning.name', '')}</GuestExactStatusLabel>
                </CleaningNameContainerInner>
                // </GuestExactStatus>
                : null
              }
            </CleaningNameContainer>

            <RoomInfoContainer style={{ flex: 1 }}>
              <PlaceHolderView></PlaceHolderView>
              {calcStatus(isAttendant, isRunner, room)
                ?
                <CleaningStatusContainer>
                  <Status
                    status={calcStatus(isAttendant, isRunner, room)}
                    isPaused={isAttendant && (get(room, 'attendantStatus') === "paused" || get(room, 'update.isPaused'))}
                  />
                </CleaningStatusContainer>
                : <CleaningNameContainer></CleaningNameContainer>
              }

              <CleaningNameContainer>
                {this.renderLocatorStatus(room, get(room, 'isGuestIn'))}
              </CleaningNameContainer>
            </RoomInfoContainer>


            {!isEmpty(get(room, 'roomPlanning', {}))
              ? (
                <>
                  {/* getStartString &&  */}
                  <ExtraContainer>
                    <Special
                      tasks={get(room, 'roomTasks', [])}
                      showCleaningOrderValue={showCleaningOrderValue}
                      orderCleaningsByRoomName={orderCleaningsByRoomName}
                      calculated_scheduled_order={get(room, 'calculated_scheduled_order', null)}
                      scheduledOrder={get(room, 'roomPlanning.scheduled_order', null)}
                      scheduledTs={get(room, 'roomPlanning.scheduled_ts', null)}
                    />

                    {getStartString && getStartString !== "00:00" ?
                      <SpecialText color={orange.color} style={{ marginLeft: 10 }}>{getStartString}</SpecialText> : null}

                  </ExtraContainer>
                </>
              ) : null}
          </RightContainer>
        </Container>
      </Base>
    )
  }
}