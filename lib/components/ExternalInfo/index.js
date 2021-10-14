import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Linking
} from 'react-native';
import I18n from 'react-native-i18n'

import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { get, has, find, map, keys } from 'lodash';
import { mapUrl } from '../../utils/map';
import {
  grey400,
  slate,
  blueLt,
  red
} from 'rc-mobile-base/lib/styles';

import {
  Container,
  InfoHeader,
  InfoContainer,
  InfoRow,
  IconContainer,
  InfoText,
  BoldText,
  InfoButton
} from './styles';

const FIELDS = ['access', 'trash', 'parking', 'wifi', 'other'];

export const Item = ({ label, value }) => (
  <InfoRow>
    <IconContainer>
      <BoldText>{ label && label.toUpperCase() }</BoldText>
    </IconContainer>
    <InfoText>{ value }</InfoText>
  </InfoRow>
)

export const LocationItem = ({ label, value, name, lat, long }) => (
  <InfoButton disabled={!lat || !long} onPress={() => lat && long ? Linking.openURL(mapUrl(lat, long, name)) : null}>
    <IconContainer>
      <Icon name="map" size={20} color={slate.color} />
    </IconContainer>
    <InfoText style={[lat && long && blueLt.text]}>{ value }</InfoText>
  </InfoButton>
)

const ExternalInfo = ({ room, inline = false, styles }) => {
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
    <Container style={[styles]}>
      <InfoHeader style={[ inline && { marginLeft: 15, marginBottom: 5 }]}>{ `Location Information`.toUpperCase() }</InfoHeader>
      <InfoContainer style={[ inline && { marginHorizontal: 0, backgroundColor: 'white', paddingHorizontal: 5 }]}>
        
        { get(externalInfo, 'location') ?
          <LocationItem
            label="location"
            value={get(externalInfo, 'location')}
            name={get(room, 'name')}
            lat={get(externalInfo, 'lat')}
            long={get(externalInfo, 'long')}
            />
          : null
        }
        
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
