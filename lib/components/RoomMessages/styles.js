import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

import { grey400, grey100, grey, greyDk, text, blue, slate, orange, blueLt } from 'rc-mobile-base/lib/styles';

export const Container = styled.View`
justify-content: flex-start;
align-items: flex-start;
`

export const Title = styled.Text`
color: ${greyDk.color};
font-weight: 400;
font-size: 14;
`

export const Subtitle = styled.Text`
color: ${greyDk.color};
font-weight: 400;
font-size: 13;
opacity: .8;
`

export const MessageContainer = styled.View`
flex-direction: row;
border-bottom-width: 1;
border-bottom-color: ${grey100.color};
padding-bottom: 12;
padding-top: 24;
`

export const MessageContainerColumnSM = styled.View`
width: 32;
`

export const MessageContainerColumnLG = styled.View`
flex: 1;
`

export const MessageToggleContainer = styled.TouchableOpacity`

`

export const MessageFocusDetailsRow = styled.View`
flex-direction: row;
margin-bottom: 8;
`

export const Spacer = styled.View`
flex: 1;
`

export const MessageFocusMessageRow = styled.View`
margin-bottom: 20;
`

export const MessageFocusUserRow = styled.View`
flex-direction: row;
align-items: center;
`

export const MessageTypeText = styled.Text`
font-size: 14;
font-weight: 500;
color: ${blue.color};
`

export const MessageDatesUserText = styled.Text`
font-size: 14;
font-weight: 500;
color: ${greyDk.color};
`

export const MessageMessageText = styled.Text`
font-size: 16;
color: ${slate.color};
`

export const MessageMessageInput = styled.TextInput`
font-size: 16;
height: 44;
border-color: ${blueLt.color};
border-width: 1;
padding-horizontal: 8;
border-radius: 4;
color: ${slate.color};
`

export const MessageAvatarContainer = styled.View`
background-color: ${grey.color};
justify-content: center;
align-items: center;
height: 24;
width: 24;
border-radius: 12;
margin-right: 8;
`

export const MessageAvatarImage = styled.Image`
height: 24;
width: 24;
border-radius: 12;
`

export const ButtonContainer = styled.TouchableOpacity`
flex-direction: row;
align-items: center;
padding-horizontal: 10;
`

export const ButtonText = styled.Text`
margin-left: 8;
font-size: 14;
font-weight: 500;
color: ${(props) => props.color || grey.color};
`

export const OptionsRow = styled.View`
flex-direction: row;
padding-top: 12;
`

export const RadioRow = styled.View`
flex-direction: row;
`

export const RadioOptionContainer = styled.TouchableOpacity`
flex-direction: row;
margin-right: 20;
align-items: center;
`

export const RadioLabel = styled.Text`
font-size: 14;
color: ${greyDk.color};
font-weight: 500;
margin-left: 4;
`

export const NewMessageInput = styled.TextInput`
height: 40;
width: 100%;
border-width: 1px;
border-color: ${grey400.color};
border-radius: 2;
padding-horizontal: 10;
`

export const DatesContainer = styled.View`
flex-direction: row;
flex-wrap: wrap;
`

export const DateContainer = styled.TouchableOpacity`
height: 50;
width: 50;
justify-content: center;
align-items: center;
border-width: 1;
border-color: ${grey400.color};
margin-horizontal: 1;
margin-vertical: 1;
`

export const DateText = styled.Text`
color: ${props => props.isActive ? 'white' : slate.color};
font-size: 22;
font-weight: bold;
background-color: transparent;
`

export const DateSubtext = styled.Text`
color: ${props => props.isActive ? 'white' : slate.color};
font-size: 14;
background-color: transparent;
`

export const DateStartBg = styled.View`
position: absolute;
top: 0;
left: 0;
right: 0;
bottom: 0;
background-color: ${blue.color};
`

export const DateEndBg = styled.View`
position: absolute;
top: 0;
left: 0;
right: 0;
bottom: 0;
background-color: ${orange.color};
`

export const DateFirstHalfBg = styled.View`
position: absolute;
top: 0;
left: 0;
right: 24;
bottom: 0;
background-color: ${blue.color};
`

export const DateSecondHalfBg = styled.View`
position: absolute;
top: 0;
left: 24;
right: 0;
bottom: 0;
background-color: ${orange.color};
`