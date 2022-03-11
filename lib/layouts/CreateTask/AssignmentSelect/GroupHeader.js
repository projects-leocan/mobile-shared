import React, { Component } from 'react';
import I18n from 'react-native-i18n';

import {
  ListGroupHeader,
  ListGroupHeaderLabel
} from './styles';

const GroupHeader = ({ label }) => (
  <ListGroupHeader>
    <ListGroupHeaderLabel>{label}</ListGroupHeaderLabel>
  </ListGroupHeader>
)

export default GroupHeader;