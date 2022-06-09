import React from 'react';
import styled from 'styled-components/native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import {
  white,
  splashBg,
  black,
  themeTomato
} from 'rc-mobile-base/lib/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';

const inputBorderColor = '#cfd4de';

export const SafeAreaContainer = styled.SafeAreaView`
  flex: 1;
  width: 100%;
  background-color: #000;
`;

export const RootView = styled.View`
  flex: 1;
  width: 100%;
`;

export const HeaderIcon = styled(Icon)`
    align-self: center;
    color: #fff;
    font-size: 30;
`;

export const TaskImageHeaderContainer = styled.View`
    top: ${getStatusBarHeight()};
    background-color: #000;
    width: 100%;
    zIndex: 9999;
    flex-direction: row;
    position: absolute;
`;

export const HeaderImageIndicator = styled.Text`
    color: ${white.color};
    text-align: center;
    margin: 10px;
    font-size: 18;
    flex: 1;
    justify-content: center;
    align-self: center;
`;

export const CloseIconPositionContainer = styled.View`
  right: 12;
  position: absolute;
`;

export const CloseIconContainer = styled.TouchableOpacity`
  height: 40;
  width: 40;
  justify-content: center;
  align-self: center;
  align-items: center;
`;

//--

export const ButtonContainer = styled.TouchableOpacity`
  minHeight: 60;
  width: 100%;
  align-items: center;
  justify-content: center;
  border-width: 1;
  border-color: ${splashBg.color};
  border-radius: 8px;
  margin-vertical: 12px;
`;

export const ButtonIconContainer = styled.View`
  height: 60;
  left: 15;
  position: absolute;
  align-items: center;
  justify-content: center;
`;

export const ButtonIcon = styled.Image`
  height: 28;
  width: 28;
  resize-mode: contain;
`;

export const ButtonLabel = styled.Text`
  font-size: 18;
  text-align: center;
  color: ${splashBg.color};
  font-weight: bold;
`;

export const InputOuterContainer = styled.View`
    flex-direction: column;
    justify-content: space-between;
`;

export const InputContainer = styled.View`
  min-height: 60;
  width: 100%;
  background-color: ${white.color};
  border-width: 1;
  border-radius: 8px;
  padding: 8px;
  border-color: ${inputBorderColor}
  margin-vertical: 12px;
`;

export const TimeInputContainer = styled.TouchableOpacity`
  height: 60;
  width: 100%;
  background-color: ${white.color};
  border-width: 1;
  border-radius: 8px;
  padding: 8px;
  border-color: ${inputBorderColor}
  margin-vertical: 12px;
  align-items: center;
  justify-content: center;
`;

export const TimeText = styled.Text`
  font-size: 16;
  text-align: center;
  justify-content: center;
  color: ${props => props.isShowAsPlaceHolder ? '#C7C7CD' : black.color};
`;

export const InputField = styled.TextInput`
  flex: 1;
  height: 100%;
  width: 100%;
  font-size: 16;
`;

export const MessageSendContainer = styled.View`
  height: 50;
  width: 50;
  border-radius: 25;
  position: absolute;
  bottom: 8px;
  right: 8px;
  overflow: hidden;
`;

export const MessageSendTouchable = styled.TouchableOpacity`
  flex: 1;
  background-color: ${themeTomato.color};
  align-items: center;
  justify-content: center;
`;

export const SendMessageImage = styled.Image`
  height: 15;
  width: 15;
  resize-image: contain;
  tint-color: ${white.color}
`;

export const BottomActionButton = styled.TouchableOpacity`
  flex: 1;
  width: 100%;
  min-height: 60;
`;