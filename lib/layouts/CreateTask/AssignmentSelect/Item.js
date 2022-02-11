import React, { Component } from 'react';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  ListItem,
  ListFooter,
  Name,
  BackupContainer,
  BackupLabel,
  CheckBoxContainer
} from './styles';

import {
  blueLt,
  splashBg
} from 'rc-mobile-base/lib/styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { get } from 'lodash'

const BackupImage = ({ name }) => (
  <BackupContainer>
    <BackupLabel>{`${(name || ' ')[0].toUpperCase()}`}</BackupLabel>
  </BackupContainer>
)

const Item = ({ row, onPress, index }) => (
  <ListItem index={index} onPress={() => onPress(row)}>
    {/* <BackupImage name={name} /> */}
    <CheckBoxContainer>
      <Ionicons
        name={row.isSelected ? 'ios-checkbox' : 'ios-square-outline'}
        size={30}
        color={splashBg.color}
      />
    </CheckBoxContainer>
    <Name>{row.name}</Name>
    {/* { isSelected ?
      <Icon name="check-square-o" size={24} color={blueLt.color} />
      : null
    } */}
  </ListItem>
)

export default Item;