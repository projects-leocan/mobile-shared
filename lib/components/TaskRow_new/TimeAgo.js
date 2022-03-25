import React, { Component } from 'react';
import {
  View,
  Text,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

import {
  greyDk,
  margin,
  text
} from 'rc-mobile-base/lib/styles';

export const TimeAgo = ({ value }) => value ? (
  <Text style={[greyDk.text, margin.r10, { fontSize: 12 }]}>
    {moment.unix(value).fromNow()}
  </Text>
) : null

export default TimeAgo
