import React, { Component } from 'react';
import { compose, withStateHandlers } from 'recompose';
import {
  View,
  TouchableOpacity,
  Text
} from 'react-native';
import I18n from 'react-native-i18n';
import moment from 'moment';

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
import { Modal } from 'rc-mobile-base/lib/modal/components';

export const Row = ({ index, toggleModal, modals, ...props }) => (
  <RowBase index={index}>
    <TouchableOpacity style={[flxCol, flx2, jcc, { height: 50 }]} onPress={() => toggleModal('task', true)}>
      <Text style={[text.fw700, margin.x10]}>
        {props.task}
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
          {props.creator && `${props.creator.first_name} ${ props.creator.last_name }`}
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
    <View style={[flxCol, flx1]}>
      <Text style={[text.fw700]}>
        { props.assigned.label }
      </Text>
    </View>
    <View style={{ width: 5 }}></View>
    <View style={[flxCol, flx1]}>
      <Status task={props} />
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
