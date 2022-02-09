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
  text,
  orange
} from '../../styles';

import Picture from '../Picture';
import H2 from '../H2';
import Button from '../Button';
import ModalToggler from '../ModalToggler';
import SwipeoutOptions from '../TaskRow/SwipeoutOptions';

import TimeAgo from './TimeAgo';
import Status from './Status';
import SectionHeader from './SectionHeader';
import get from 'lodash/get';

const ActivityBase = ({ activity, task, onPress }) => {
  const taskType = get(task, 'type', null)
  const isTypeQuick = (taskType === "quick")
  const validateActivity = isTypeQuick ? { ...activity, status: 'completed' } : activity
  return (
    <Button
      key={activity.text}
      style={[{ margin: 2, marginVertical: 5 }, { backgroundColor: isTypeQuick ? green.color : activity.backgroundColor }]}
      onPress={() => onPress(task, validateActivity)}
    >
      <Text
        style={[text.center, { color: activity.color, width: 80, fontWeight: 'bold' }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {isTypeQuick ? 'Finish' : I18n.t(`base.ubiquitous.${activity.text.toLowerCase()}`)}
      </Text>
    </Button>
  )
}

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
  const guestName = get(task, 'guest_info.guest_name', '');
  const isPriority = get(task, 'is_priority', false);

  return (
    <View>
      <View style={[white.bg, padding.a10, padding.b15]}>
        <View style={[flxRow]}>
          <Picture
            value={task.meta.image}
            size={120}
          />
          <View style={[margin.l10, flxCol, flx1]}>
            <View>
              <Text
                style={[slate.text, text.fw600, margin.r10, { width: 'auto', fontSize: 15 }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {assetName}
              </Text>

              {isPriority
                ?
                <Icon
                  name="star"
                  color={orange.color}
                  size={25}
                  style={{ marginTop: 8 }}
                /> : null
              }
            </View>

            <Text
              style={[greyDk.text, text.fw600, { width: 'auto' }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {taskAction}
            </Text>
            <TimeAgo value={task.date_ts} />
            {/* <Status task={task} /> */}
          </View>
          <TouchableOpacity onPress={onClose} style={[padding.a0, margin.r10, aife,]}>
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

        <SectionHeader value={I18n.t('maintenance.filters.index.guest-status')} />
        <View style={[flxRow]}>
          <View style={[flxRow, aic]}>
            <Text style={[greyDk.text]}>
              {task.room.guestStatus}
            </Text>
          </View>
        </View>

        {guestName ?
          <>
            <SectionHeader value={I18n.t('runner.glitch-form.index.guest-information')} />
            <View style={[flxRow]}>
              <View style={[flxRow, aic]}>
                <Text style={[greyDk.text]}>
                  {guestName}
                </Text>
              </View>
            </View>
          </> : null}

        <SectionHeader value={I18n.t('base.ubiquitous.creator')} />
        <Text style={[greyDk.text]}>
          {task.creator.fullName}
        </Text>

        {task.lastMessage ?
          <View>
            <SectionHeader value={I18n.t('base.ubiquitous.last-message')} />
            <Text style={[greyDk.text]}>
              {task.lastMessage}
            </Text>
          </View>
          : null
        }

      </View>
      <View style={[flxRow, grey400.bg, aic, jcc, { flex: 1, maxHeight: 55 }]}>
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
