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
import { Modal } from 'rc-mobile-base/lib/modal/components';
import { get } from 'lodash';

const styles = StyleSheet.create({
  taskText: {
    color: '#808080'
  }
})

export const Row = ({ index, toggleModal, modals, ...props }) => {
  const taskLabel = get(props, 'task', '');
  const isHideLocation = get(props, 'hideLocation', false);
  // const location = get(props, 'meta.location', null);
  const floorName = get(props, 'room.floorName', null);
  const roomName = get(props, 'room.name', null);
  const location = floorName + "\\" + roomName;
  const creator = get(props, 'creator', null);
  const createFName = get(props, 'creator.first_name', '');
  const createLName = get(props, 'creator.last_name', '');
  const dateTimeStamp = get(props, 'date_ts', null);
  const assignLabel = get(props, 'assigned.label', '');

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
      <View style={[flxCol, flx1]}>
        <Text style={[text.fw700, styles.taskText]}>
          {unixPrettyDate(dateTimeStamp)}
        </Text>
      </View>
      <PriorityStatus task={props} />
      <View style={{ width: 5 }}></View>
      <View style={[flxCol, flx1]}>
        <Text style={[text.fw700, styles.taskText]}>
          {assignLabel}
        </Text>
      </View>
      <View style={{ width: 5 }}></View>
      <View style={[flxCol, flx1]}>
        <Status task={props} />
      </View>

      <Modal
        isOpen={modals.task}
        onClosed={() => toggleModal('task', false)}
        style={{ width: 800 }}
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
