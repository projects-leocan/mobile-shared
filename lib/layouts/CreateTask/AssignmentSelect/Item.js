import React, { Component } from 'react';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  ListItem,
  ListFooter,
  Name,
  BackupContainer,
  BackupLabel
} from './styles';

import {
  blueLt
} from 'rc-mobile-base/lib/styles';

const BackupImage = ({ name }) => (
  <BackupContainer>
    <BackupLabel>{ `${(name || ' ')[0].toUpperCase()}` }</BackupLabel>
  </BackupContainer>
)

const Item = ({ name, onPress, isSelected, value, index }) => (
  <ListItem index={index} onPress={() => onPress(value)}>
    <BackupImage name={name} />
    <Name>{ name }</Name>
    { isSelected ?
      <Icon name="check-square-o" size={24} color={blueLt.color} />
      : null
    }
  </ListItem>
)

export default Item;