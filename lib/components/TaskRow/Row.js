import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import { get } from 'lodash';

import {
  flxRow,
  flxCol,
  white,
  grey,
  margin,
  jcsb,
  flex1,
  aife
} from 'rc-mobile-base/lib/styles';

import Picture from '../Picture';

import Title from './Title';
import Guest from './Guest';
import Message from './Message';
import TimeAgo from './TimeAgo';
import Status from './Status';

export const TaskRow = ({ task, onPress }) => (
  <TouchableOpacity
    style={[flex1, flxRow, white.bg, grey.bc]}
    onPress={() => onPress(task)}
  >
    <Status
      style={[flxCol]}
      task={task}
    />
    <Picture
      size={68}
      style={[flxCol]}
      value={get(task, 'image_urls', [])}
    />
    <View style={[flex1, margin.l10, flxCol, { paddingBottom: 5 }]}>
      <Title value={task.task} message={get(task, 'comment', '')} isGuest={get(task, 'is_guest_request', false)} isPriority={get(task, 'is_priority', false)} />
      <Message value={task.lastMessage} />
      <View style={[jcsb, aife, flxRow, margin.t15]}>
        <Guest
          room={get(task, 'room', {})}
          roomName={task.room.name}
          isGuestIn={task.room.isGuestIn}
          roomHousekeeping={task.room.roomHousekeeping}
          guestStatus={task.room.guestStatus}
        />
        <TimeAgo value={task.created_at} />
      </View>
    </View>
  </TouchableOpacity>
)

export default TaskRow
