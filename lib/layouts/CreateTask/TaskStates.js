import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Spinner from 'react-native-spinkit';
import I18n from 'react-native-i18n';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

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
    jcc,
    splashBg,
    themeTomato
} from 'rc-mobile-base/lib/styles';
import TaskButton from './TaskButton';

const activeGreen = '#9afdaa';

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

const RootContainer = styled.View`
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 25px;
    background-color: ${(props) => props.bg.color};
`;

const BottomButtonContainer = styled.View`
    width: 100%;
   bottom: ${hp('8%')};
   position: absolute;
`;

const BottomButton = styled.TouchableOpacity`
    height: 60px;
    width: 100%;
    background-color: ${themeTomato},
`;

export const ErrorState = ({ onPress }) => (
    <TouchableBackground bg={white} onPress={onPress}>
        <Icon name={"exclamation-circle"} size={160} color={red.color} />
        <BigText text={red}>{`Error sending task`.toUpperCase()}</BigText>
        <SmallText text={red}>{taskError.toString()}</SmallText>
    </TouchableBackground>
)

export const SendingState = ({ onPress }) => (
    <TouchableBackground bg={blueLt} onPress={onPress}>
        <Spinner style={[margin.b50]} isVisible={true} size={100} type={'Bounce'} color={"#FFFFFF"} />
        <BigText text={white}>{`Sending task`.toUpperCase()}</BigText>
        <SmallText text={white}>{I18n.t('base.ubiquitous.tap-to-continue').toUpperCase()}</SmallText>
    </TouchableBackground>
)

export const SentState = ({ onPress }) => (
    <RootContainer bg={splashBg} onPress={onPress}>
        <Icon name={"check"} size={160} color={activeGreen} />
        <BigText text={white}>{`Task Sent`}</BigText>

        <BottomButtonContainer>
            <TaskButton
                label="Back to Dashboard"
                buttonStyle={{ backgroundColor: themeTomato.color, borderWidth: 0 }}
                labelStyle={{ color: '#000' }}
                onPress={() => onPress()}
            />
        </BottomButtonContainer>
    </RootContainer>
)