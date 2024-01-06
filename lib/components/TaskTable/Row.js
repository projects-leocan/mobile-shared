import React, { Component } from 'react';
import { compose, withStateHandlers } from 'recompose';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native';
import I18n from 'react-native-i18n';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  eitherGrey_100_200,
  flxRow,
  aic,
  jcc,
  padding,
  flxCol,
  flx3,
  flx2,
  flx1,
  margin,
  text,
  greyDk,
  circle,
  green
} from 'rc-mobile-base/lib/styles';

import { taskOptions, userType } from './utils';
import { unixPrettyDate } from 'rc-mobile-base/lib/utils/dates';

import RowBase from './RowBase';
import Status from './Status';
import TaskModal from './TaskModal';
import PriorityStatus from './PriorityStatus';
// import { Modal } from 'rc-mobile-base/lib/modal/components';
import Modal from 'react-native-modal';
import { get, _ } from 'lodash';
import styled from 'styled-components/native';
import RecurringStatus from 'rc-mobile-base/lib/components/TaskTable/RecurringStatus';
import { prop } from 'ramda';

const styles = StyleSheet.create({
  taskText: {
    color: '#808080'
  },
  modalDesign: {
    flex: 1,
    width: 800,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export const EtaEtd = styled.Text`
  font-size: 12px;
  color: #808080;
  padding-left: 2px;
  font-weight: 700;
`
export const EtaEtdTitle = styled.Text`
  font-size: 12px;
  color: #808080;
  align-self:flex-start;
  font-weight: 700;
`

export const Row = ({ index, toggleModal, modals, ...props }) => {
  const taskLabel = get(props, 'task', '');
  const isHideLocation = get(props, 'hideLocation', false);
  // const location = get(props, 'meta.location', null);
  const isHaveMultipleBuilding = get(props, 'isHaveMultipleBuilding', true);
  const buildingName = get(props, 'room.buildingName', null);
  const floorName = get(props, 'room.floorName', null);
  const roomName = get(props, 'room.name', null);
  const location = isHaveMultipleBuilding ? (buildingName + '\u2022' + floorName + '\u2022' + roomName) : (floorName + '\u2022' + roomName);
  const creator = get(props, 'creator', null);
  const createFName = get(props, 'creator.first_name', '');
  const createLName = get(props, 'creator.last_name', '');
  const dateTimeStamp = get(props, 'date_ts', null);
  const createTaskTime = get(props, 'starts_at_string', '')
  const assignLabel = get(props, 'assigned.label', '');
  const guests = get(props, 'room.guests', [])
  const room = get(props, 'room', null)
  const guestStatus = get(props, 'room.guestStatus', '')
  let etaTime = get(room, ['guests', 0, 'etaTime'], null);
  let etdTime = get(room, ['guests', 0, 'etdTime'], null);
  const renderETD = (guestStatus, etd) => {
    const GuestStatus = String(guestStatus).toUpperCase();
    if (etd) {
      if (GuestStatus === 'DEP') {
        return (
            <View style={{flexDirection:"row",marginLeft:20}}>
                <EtaEtdTitle>ETD:</EtaEtdTitle>
                <EtaEtd>{etd}</EtaEtd>
            </View>
        )
      }
    }
  }


  const renderETA = (guestStatus, eta) => {
    const GuestStatus = String(guestStatus).toUpperCase();
    if (eta) {
      if (GuestStatus === 'ARR') {
        return (
            <View style={{flexDirection:"row",marginLeft:20}}>
                <EtaEtdTitle>ETA:</EtaEtdTitle>
                <EtaEtd>{eta}</EtaEtd>
            </View>
        )
      }
    }
  }

  const renderEtaEtdBoth = (guestStatus, guests) => {
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
                        <View style={{flexDirection:"row"}}>
                            <EtaEtdTitle>ETD:</EtaEtdTitle>
                            <EtaEtd>{gue?.etdTime}</EtaEtd>
                        </View>
                    :
                    gue?.status === "arrival" || gue?.status === "arrived" ?
                        <View style={{flexDirection:"row"}}>
                            <EtaEtdTitle>ETA:</EtaEtdTitle>
                            <EtaEtd>{gue?.etaTime}</EtaEtd>
                        </View>
                    : null
                )
              })
            )
          }
        </>
      )
    }

  }

  return (
    <RowBase index={index}>
      <TouchableOpacity style={[flxCol, flx2, jcc, { height: 50 }]} onPress={() => toggleModal('task', true)}>
        <Text style={[text.fw700, margin.x10, styles.taskText]}>
          {taskLabel}
        </Text>
      </TouchableOpacity>
      <View style={{ width: 5 }}></View>
      <View style={[flxCol, flx1]}>
        {
          !isHideLocation &&
          <Text style={[text.fw700, styles.taskText]}>
            {location || I18n.t('base.ubiquitous.no-location')}
          </Text>
        }
      </View>
      <View style={{ width: 5 }}></View>
      <View style={[flxCol, flx1]}>
        <View>
          <Text style={[text.fw700, text.b3, styles.taskText]}>
            {creator && `${createFName} ${createLName}`}
          </Text>
          <Text style={[text.b3, greyDk.text]}>
            {userType(creator)}
          </Text>
        </View>
      </View>
      <View style={{ width: 5 }}></View>
      <View style={[flxRow, flx1]}>
        <Text style={[text.fw700, styles.taskText]}>
          {unixPrettyDate(dateTimeStamp,createTaskTime)}
        </Text>
          {renderETA(guestStatus, etaTime)}
          {renderETD(guestStatus, etdTime)}
          <View style={{flexDirection:"column",marginLeft:20}}>
            {renderEtaEtdBoth(guestStatus, guests,)}
          </View>
      </View>
      <PriorityStatus task={props} />
      <RecurringStatus task={props}/>
      <View style={{ width: 5 }}></View>
      <View style={[flxCol, flx1]}>
        {/* <Text style={[text.fw700, styles.taskText]}>
          {assignLabel}
        </Text> */}
        <Text style={[text.fw700, styles.taskText]}>
        {roomName}
        </Text>
      </View>
      <View style={{ width: 5 }}></View>
      <View style={[flxCol, flx1]}>
        <Status task={props} />
      </View>

      <Modal
        isVisible={modals.task}
        onClosed={() => toggleModal('task', false)}
        style={styles.modalDesign}
      >
        <TaskModal
          task={props}
          closeModal={() => toggleModal('task', false)}
        />
      </Modal>
    </RowBase>
  )
}

const enhance = withStateHandlers(
  {
    modals: {
      task: false,
    },
  },
  {
    toggleModal: ({ modals }) => (modalName, value) => ({ modals: { ...modals, [modalName]: value } }),
  }
)

export default enhance(Row);
