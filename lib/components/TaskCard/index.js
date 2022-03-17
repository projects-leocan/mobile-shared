import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IcoMoonIcon from 'rc-mobile-base/lib/components/IcoMoonIcon';
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
import { get, filter } from 'lodash';
import { renderLocatorStatus } from 'rc-mobile-base/lib/components/TaskRow/Guest';

const ActivityBase = ({ activity, task, onPress }) => {
  const taskType = get(task, 'type', null)
  const is_claimed = get(task, 'is_claimed', false);
  const isTypeQuick = (taskType === "quick")
  const validateTaskActivity = isTypeQuick && is_claimed && get(task, 'task', '');
  const validateActivity = validateTaskActivity ? { ...activity, status: 'completed' } : activity;

  return (
    <Button
      key={activity.text}
      style={[{ margin: 2, marginVertical: 5 }, { backgroundColor: validateTaskActivity ? green.color : activity.backgroundColor }]}
      onPress={() => onPress(task, validateActivity)}
    >
      <Text
        style={[text.center, { color: activity.color, width: 80, fontWeight: 'bold' }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {validateTaskActivity ? 'Finish' : I18n.t(`base.ubiquitous.${activity.text.toLowerCase()}`)}
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
  const isGuestReq = get(task, 'is_guest_request', false);
  const validateActivities = filter(get(task, 'activities', []), function (o) { return o.type !== 'delay' });

  return (
    <View>
      <View style={[white.bg, padding.a10, padding.b15]}>
        <View style={[flxRow]}>
          <Picture
            value={get(task, 'image_urls', [])}
            size={120}
          />
          <View style={[margin.l10, flxCol, flx1]}>
            <View>
              {assetName.split(/\s*,\s*/).map((item, index) => {
                return (
                  <Text
                    style={[slate.text, text.fw600, margin.r10, { flexWrap: 'wrap', width: 'auto', fontSize: 15 }]}
                    ellipsizeMode="tail"
                    key={index.toString()}
                  >
                    {item}
                  </Text>
                )
              })}

              {isPriority || isGuestReq
                ?
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                  {isPriority
                    ?
                    <Icon
                      name="star"
                      color={orange.color}
                      size={25}
                      style={{ marginRight: 8 }}
                    />
                    : null
                  }

                  {isGuestReq
                    ?
                    <MaterialCommunityIcons
                      name="playlist-star"
                      color={red.color}
                      size={35}
                    />
                    : null
                  }
                </View>
                : null
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
            <View style={{ marginRight: 10 }}>
              {renderLocatorStatus(get(task, 'room', ''), get(task, 'room.isGuestIn', false))}
            </View>
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

        {get(task, 'comment', '') ?
          <View>
            <SectionHeader value={I18n.t('base.ubiquitous.message')} />
            <Text style={[greyDk.text]}>
              {get(task, 'comment', '')}
            </Text>
          </View>
          : null
        }

      </View>
      <View style={[flxRow, grey400.bg, aic, jcc, { flex: 1, maxHeight: 55 }]}>
        {
          onPress && validateActivities.map(activity => (
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
