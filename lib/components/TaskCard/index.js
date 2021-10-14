import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import I18n from 'react-native-i18n';

import {
  margin,
  padding,
  flxRow,
  flxCol,
  slate,
  white,
  grey,
  green,
  red,
  aic,
  aife,
  flx1,
  jcc,
  jcfe,
  greyDk,
  grey400,
  text
} from '../../styles';

import Picture from '../Picture';
import H2 from '../H2';
import Button from '../Button';
import ModalToggler from '../ModalToggler';
import SwipeoutOptions from '../TaskRow/SwipeoutOptions';

import TimeAgo from './TimeAgo';
import Status from './Status';
import SectionHeader from './SectionHeader';

const ActivityBase = ({ activity, task, onPress }) => (
  <Button
    key={activity.text}
    style={[{ margin: 2 }, {backgroundColor: activity.backgroundColor}]}
    onPress={() => onPress(task, activity)}
  >
    <Text
      style={[text.center, {color: activity.color, width: 80, fontWeight: 'bold' }]}
      numberOfLines={1}
      ellipsizeMode="tail"
    >
      {I18n.t(`base.ubiquitous.${activity.text.toLowerCase()}`)}
    </Text>
  </Button>
)

const Activity = ({ activity, task, onPress }) => activity.children ? (
  <ModalToggler
    modalProps={{
      transparent: true
    }}
    renderValue={(toggle) => (
      <ActivityBase
        activity={activity}
        onPress={toggle}
      />
    )}
    renderModal={(toggle) => (
      <SwipeoutOptions
        value={activity.children}
        task={task}
        onPress={onPress}
        close={toggle}
      />
    )}
  />
) : (
  <ActivityBase activity={activity} task={task} onPress={onPress} />
)

const TaskCard = ({ task, onClose, onPress }) => {
  const [assetName, taskAction] = task.task.split(':').map(i => i.trim());

  return (
    <View>
      <View style={[white.bg, padding.a10, padding.b15]}>
        <View style={[flxRow]}>
          <Picture
            value={task.meta.image}
            size={120}
          />
          <View style={[margin.l10, flxCol]}>
            <Text
              style={[slate.text, text.fw600, margin.r10, {width: 145, fontSize: 15}]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {assetName}
            </Text>
            <Text
              style={[greyDk.text, text.fw600, {width: 145}]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {taskAction}
            </Text>
            <TimeAgo value={task.date_ts} />
            {/* <Status task={task} /> */}
          </View>
          <TouchableOpacity onPress={onClose} style={[padding.a0, margin.r10, aife, flx1]}>
            <Icon
              name="times"
              size={24}
              color={red.color}
            />
          </TouchableOpacity>
        </View>

        <SectionHeader value={I18n.t('base.ubiquitous.location')} />
        <View style={[flxRow]}>
          <View style={[flxRow, aic]}>
            <Icon
              name="user"
              style={[flxCol, margin.r5]}
              color={task.room.isGuestIn ? green.color : red.color}
            />
            <Text style={[greyDk.text]}>
              {task.room.name}
            </Text>
          </View>
        </View>

        <SectionHeader value={I18n.t('base.ubiquitous.creator')} />
        <Text style={[greyDk.text]}>
          {task.creator.fullName}
        </Text>

        { task.lastMessage ?
          <View>
            <SectionHeader value={I18n.t('base.ubiquitous.last-message')} />
            <Text style={[greyDk.text]}>
              {task.lastMessage}
            </Text>
          </View>
          : null
        }
        
      </View>
      <View style={[flxRow, grey400.bg, aic, jcc, padding.y5, {height: 55}]}>
        {
          onPress && task.activities.map(activity => (
            <Activity
              key={activity.text}
              activity={activity}
              task={task}
              onPress={(...args) => {
                onClose()
                onPress(...args)
              }}
            />
          ))
        }
      </View>
    </View>
  )
}

export default TaskCard
