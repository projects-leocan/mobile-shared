import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-spinkit';
import I18n from 'react-native-i18n';

import {
  flxCol,
  flxRow,
  margin,
  padding,
  text,
  white,
  red,
  green,
  grey400,
  blueLt, 
  slate,
  aic,
  jcc
} from 'rc-mobile-base/lib/styles';

const TouchableBackground = styled.TouchableOpacity`
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: ${(props) => props.bg.color};
`

const BigText = styled.Text`
    color: ${(prop) => prop.text.color};
    font-size: 36px;
    text-align: center;
    font-weight: 600;
`

const SmallText = styled.Text`
    color: ${(prop) => prop.text.color};
    font-size: 18px;
    text-align: center;
    font-weight: 600;
    margin-top: 12px;
`

export const ErrorState = ({ onPress }) => (
    <TouchableBackground bg={white} onPress={onPress}>
        <Icon name={"exclamation-circle"} size={160} color={red.color} />
        <BigText text={red}>{ `Error sending task`.toUpperCase() }</BigText>
        <SmallText text={red}>{ taskError.toString() }</SmallText>
    </TouchableBackground>
)

export const SendingState = ({ onPress }) => (
    <TouchableBackground bg={blueLt} onPress={onPress}>
        <Spinner style={[margin.b50]} isVisible={true} size={100} type={'Bounce'} color={"#FFFFFF"}/>
        <BigText text={white}>{ `Sending task`.toUpperCase() }</BigText>
        <SmallText text={white}>{ I18n.t('base.ubiquitous.tap-to-continue').toUpperCase() }</SmallText>
    </TouchableBackground>
)

export const SentState = ({ onPress }) => (
    <TouchableBackground bg={white} onPress={onPress}>
        <Icon name={"check-circle"} size={160} color={green.color} />
        <BigText text={green}>{ `Task sent`.toUpperCase() }</BigText>
    </TouchableBackground>
)