import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import I18n from 'react-native-i18n'

import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { get, has, find, map, keys } from 'lodash';
import {
  grey400,
  red
} from 'rc-mobile-base/lib/styles';

import {
  Container,
  InfoHeader,
  InfoContainer,
  InfoRow,
  IconContainer,
  InfoText,
  BoldText
} from './styles';

const FIELDS = ['location', 'access', 'trash', 'parking', 'wifi', 'other'];

export const Item = ({ label, value }) => (
  <InfoRow>
    <IconContainer>
      <BoldText>{ label && label.toUpperCase() }</BoldText>
    </IconContainer>
    <InfoText>{ value }</InfoText>
  </InfoRow>
)

const ExternalInfo = ({ room }) => {
  if (!room) {
    return null;
  }

  const { externalInfo = {} } = room;
  const availableItems = FIELDS
    .map(k => {
      const value = get(externalInfo, k, null);
      return !value ? null : { value, label: k };
    })
    .filter(Boolean);

  if (!availableItems.length) {
    return null;
  }

  return (
    <Container>
      <InfoHeader>{ `Location Information`.toUpperCase() }</InfoHeader>
      <InfoContainer>
        { availableItems.map(item =>
          <Item
            key={item.label}
            { ...item }
            />
        )}
      </InfoContainer>
    </Container>
  )
}

export default ExternalInfo;
