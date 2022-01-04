import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { get } from 'lodash/object';
import { last } from 'lodash/array';

import {
  flxRow,
  flxCol,
  white,
  grey,
  margin,
  jcsb,
  flex1,
  aife,
  green,
  lCenterCenter
} from 'rc-mobile-base/lib/styles';

import Picture from 'rc-mobile-base/lib/components/Picture';

import Title from './Title';
import Message from './Message';
import TimeAgo from './TimeAgo';
import Status from './Status';

const getLastMessage = (messages) => get(messages, 'length', 0) && get(last(messages), 'message');

export const TaskRow = ({ task, updateTask, props }) => (
  <View
    style={[flex1, flxRow, white.bg, grey.bc]}
    >
    <Status
      style={[flxCol]}
      task={task}
    />
    <Picture
      size={68}
      style={[flxCol]}
      value={task.meta.image}
    />
    <View style={[flex1, margin.l10, flxCol]}>
      <Title value={task.task} />
      { get(task, 'messages.length') > 0 ?
        <Message value={getLastMessage(task.messages)} />
        : null
      }
      <View style={[jcsb, aife, flxRow, margin.t15]}>
        <TimeAgo value={task.date_ts} />
      </View>
    </View>
    { get(task, 'type') === 'action' && !get(task, 'is_started') ?
      <TouchableOpacity style={{ height: 68, width: 68, ...lCenterCenter, ...green.bg }} onPress={() => updateTask(get(task, 'uuid'), 'started')}>
        <Icon name="play" color="white" size={32} />
      </TouchableOpacity>
      :
      <TouchableOpacity style={{ height: 68, width: 68, ...lCenterCenter, ...green.bg }} onPress={() => updateTask(get(task, 'uuid'), 'completed')}>
        <Icon name="check" color="white" size={32} />
      </TouchableOpacity>
    }
  </View>
)

export default TaskRow
