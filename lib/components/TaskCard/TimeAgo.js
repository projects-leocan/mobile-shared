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
  <Text style={[greyDk.text, margin.t5, {fontSize: 13}]}>
    {moment.unix(value).fromNow()}
  </Text>
) : null

export default TimeAgo
