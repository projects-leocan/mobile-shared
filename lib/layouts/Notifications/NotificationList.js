import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import ListView from 'rc-mobile-base/lib/components/ListView';

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

import Notification from './Notification';

export const NotificationList = ({ notifications, sent, reply, convert }) => (
  <View style={[margin.t10]}>
    <ListView
      data={notifications}
      renderRow={(task) => <Notification task={task} sent={sent} reply={reply} convert={convert} />}
    />
  </View>
)

export default NotificationList
