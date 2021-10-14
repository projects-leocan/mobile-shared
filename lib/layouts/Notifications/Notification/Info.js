import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';

import {
  greyDk,
  margin,
  text,
  flxRow
} from '../../../styles';

export const Info = ({ personName, roomName }) => (
  <Text style={[greyDk.text]}>
    {personName}
    {personName && roomName && ' · '}
    {roomName}
  </Text>
)

export default Info
