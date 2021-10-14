import React, { Component } from 'react';
import I18n from 'react-native-i18n';

import {
  ListHeader,
  ListHeaderLabel
} from './styles';

const Header = ({ label }) => (
  <ListHeader>
    <ListHeaderLabel>{ I18n.t(`base.ubiquitous.${label}`).toUpperCase() }</ListHeaderLabel>
  </ListHeader>
)

export default Header;