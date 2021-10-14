import React, { Component } from 'react';
import { compose, withStateHandlers } from 'recompose';
import {
  View,
  TouchableOpacity,
  Text
} from 'react-native';
import moment from 'moment';
import I18n from 'react-native-i18n';

import {
  eitherGrey_100_200,
  flxRow,
  lCenterCenter,
  aic,
  padding,
  flxCol,
  flx3,
  flx2,
  flx1,
  margin,
  text,
  greyDk,
  circle,
  green,
  orange,
  taskCompleted,
  taskStarted,
  taskAccepted,
  taskWaiting,
  taskPending,
  taskCancelled,
} from 'rc-mobile-base/lib/styles';

import { taskOptions, userType } from './utils';
import { unixPrettyDate } from 'rc-mobile-base/lib/utils/dates';

import RowBase from './RowBase';
import TaskModal from './TaskModal';
import { Modal } from 'rc-mobile-base/lib/modal/components';

const TaskOption = ({ onUpdate, task, status, label, color }) => {
  return (
    <TouchableOpacity
      style={[flxCol, margin.r10, lCenterCenter, { height: 60 }]}
      onPress={() => onUpdate(task.uuid, status)}
    >
      <Text style={[text.underline, text.b1, color && color.text]}>
        { `${label} task`.toUpperCase() }
      </Text>
    </TouchableOpacity>
  )
}

const Options = ({ task, onUpdate }) => {
  const options = taskOptions(task);

  if (!options || !options.length) {
    return null;
  }

  const displayOptions = options.map((option, index) =>
    <TaskOption key={index} task={task} onUpdate={onUpdate} {...option} />
  );

  return (
    <View style={[flxRow]}>
      { displayOptions }
    </View>
  )
}

export const Row = ({ index, onUpdate, toggleModal, modals, ...props }) => (
  <RowBase index={index}>
    <TouchableOpacity style={[flxCol, flx2, { height: 60, justifyContent: 'center' }]} onPress={() => toggleModal('task', true)}>
      <Text style={[text.fw700, margin.x10]}>
        { props.task }
      </Text>
    </TouchableOpacity>
    <View style={{ width: 5 }}></View>
    <View style={[flxCol, flx1]}>
      {
        !props.hideLocation &&
          <Text style={[text.fw700]}>
            { props.meta.location || I18n.t('base.ubiquitous.no-location') }
          </Text>
      }
    </View>
    <View style={{ width: 5 }}></View>
    <View style={[flxCol, flx1]}>
      <View>
        <Text style={[text.fw700, text.b3]}>
          { props.creator.first_name } { props.creator.last_name }
        </Text>
        <Text style={[text.b3, greyDk.text]}>
          { userType(props.creator) }
        </Text>
      </View>
    </View>
    <View style={{ width: 5 }}></View>
    <View style={[flxCol, flx1]}>
      <Text style={[text.fw700]}>
        { unixPrettyDate(props.date_ts) }
      </Text>
    </View>
    <View style={{ width: 5 }}></View>
    <View style={[flxCol, flx2]}>
      <Options task={props} onUpdate={onUpdate} />
    </View>

    <Modal
      isOpen={modals.task}
      onClosed={() => toggleModal('task', false)}
      style={{width: 800}}
      >
      <TaskModal
        task={props}
        closeModal={() => toggleModal('task', false)}
        />
    </Modal>
  </RowBase>
)

// export default Row
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
