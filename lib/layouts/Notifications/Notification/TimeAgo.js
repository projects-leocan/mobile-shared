import React, { Component } from 'react';
import {
  View,
  Text,
  Image
} from 'react-native';
import moment from 'moment';

import {
  greyDk,
  margin,
  text
} from '../../../styles';

export const TimeAgo = ({ value }) => value ? (
  <Text style={[greyDk.text, margin.r10]}>
    {moment.unix(value).fromNow()}
  </Text>
) : null

export default TimeAgo
