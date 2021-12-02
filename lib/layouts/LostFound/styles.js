import React from 'react';
import I18n from 'react-native-i18n';
import styled, { css } from 'styled-components/native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import {
  slate,
  grey400,
  blueLt,
  red,
  green
} from 'rc-mobile-base/lib/styles';

export const Container = styled.View`
  background-color: #F0F0F0;
`

export const SubheaderContainer = styled.View`
  background-color: white;
  height: 50;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding-horizontal: 12; 
`

export const SubheaderStatusText = styled.Text`
  font-size: 13;
  color: ${slate.color};
`

export const SubheaderTimeText = styled.Text`
  font-size: 13;
  color: ${slate.color};
  opacity: .8;
`

export const FocusLightboxContainer = styled.View`
  height: 160;
`

export const FocusImageContainer = styled.View`

`

export const FocusImageImage = styled.Image`
  width: 100%;
  height: 160;
  background-color: ${props => props.backgroundColor || grey400.color};
`

export const FocusImageBlackBar = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40;
  width: 100%;
  background-color: black;
  opacity: .3;
`

export const FocusImageTapText = styled.Text`
  position: absolute;
  bottom: 10;
  left: 0;
  right: 0;
  color: white;
  font-weight: bold;
  text-align: center;
`

export const FocusImageCloseContainer = styled.TouchableOpacity`
  position: absolute;
  bottom: 20;
  height: 50;
  width: 100;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

export const FocusImageClose = ({ handler = () => null }) => (
  <FocusImageCloseContainer onPress={handler}>
    <FocusImageTapText>{ I18n.t('base.ubiquitous.close').toUpperCase() }</FocusImageTapText>
  </FocusImageCloseContainer>
)

export const SectionContainer = styled.View`
  margin-top: 20;
  border-bottom-width: 1;
  border-bottom-color: #E5E5E5;
`

export const SectionHeader = styled.Text`
  padding-horizontal: 12;
  font-weight: bold;
  font-size: 13;
  color: ${slate.color};
  opacity: .7;
  margin-bottom: 4;
`

export const ItemContainer = styled.View`
  background-color: white;
  padding-horizontal: 12;
  padding-top: 15;
  padding-bottom: 11;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  border-top-width: 1;
  border-top-color: #E5E5E5;
`

export const ItemLabel = styled.Text`
  font-size: 13;
  color: ${slate.color};
  opacity: .8;

  ${props => props.isFocus && css`
    color: ${blueLt.color};
  `}
`

export const ItemValuesContainer = styled.View`

`

export const ItemValue = styled.Text`
  font-size: 14;
  color: ${slate.color};
  margin-bottom: 4;

  ${props => props.color && css`
    color: ${props.color};
  `}
`

export const OptionContainer = styled.TouchableOpacity`
  background-color: white;
  padding-horizontal: 12;
  padding-top: 15;
  padding-bottom: 15;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  border-top-width: 1;
  border-top-color: #E5E5E5;
`

export const OptionIconContainer = styled.View`
  width: 24;
`

export const OptionLabel = styled.Text`
  font-size: 13;
  color: ${blueLt.color};
`

export const MessageContainer = styled.View`
  flex-direction: row;
  background-color: white;
  padding-horizontal: 12;
  padding-vertical: 10;
  width: 100%;
  border-top-width: 1;
  border-top-color: #E5E5E5;
`

export const MessageAvatar = styled.Image`
  width: 48;
  height: 48;
  border-radius: 24;
  background-color: gray;
`

export const MessagesAltBg = styled.View`
  width: 48;
  height: 48;
  border-radius: 24;
  background-color: ${grey400.color};
  justify-content: center;
  align-items: center;
`

export const MessagesAltText = styled.Text`
  font-size: 17px;
  color: ${slate.color};
`

export const MessageAlt = ({ children }) => (
  <MessagesAltBg>
    <MessagesAltText>{ children && children.toUpperCase() }</MessagesAltText>
  </MessagesAltBg>
)

export const MessageFocusContainer = styled.View`
  flex: 1;
  margin-left: 12;
`

export const MessageTopRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 4;
`

export const MessageUserText = styled.Text`
  font-size: 15;
  color: ${slate.color};
  opacity: .7;
`

export const MessageTimeText = styled.Text`
  font-size: 12;
  color: ${slate.color};
  opacity: .6;
`

export const MessageMessageText = styled.Text`
  font-size: 13;
  color: ${slate.color};
  font-weight: 400;
`

export const CreateMessageContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: white;
  padding-horizontal: 12;
  padding-vertical: 10;
  border-top-width: 1;
  border-top-color: #E5E5E5;
`

export const CreateMessageTextContainer = styled.View`
  flex: 1;
  margin-horizontal: 12;
`

export const CreateMessageTextInput = styled.TextInput`
  font-size: 13;
  color: ${slate.color};
  font-weight: 400;
`

export const CreateMessageIconContainer = styled.TouchableOpacity`
  height: 50;
  width: 50;
  align-items: center;
  justify-content: center;
`

export const ExtraSpace = styled.View`
  margin-vertical: 10;
`

export const ModalContainer = styled.View`
  flex: 1;
  background-color: #F0F0F0;
`

export const ModalUserContainer = styled.TouchableOpacity`
  height: 70;
  flex-direction: row;
  align-items: center;
  padding-horizontal: 12;
  background-color: white;
  border-bottom-width: 1;
  border-color: ${grey400.color};
`

export const ModalUserText = styled.Text`
  font-size: 17;
  color: ${slate.color};
  padding-left: 12;
`

export const ModalSectionHeaderContainer = styled.View`
  padding-horizontal: 12;
  padding-top: 15;
  padding-bottom: 5;
  border-bottom-width: 1;
  border-color: ${grey400.color};
  background-color: #F0F0F0;
`

export const ModalSectionHeaderText = styled.Text`
  font-size: 17;
  color: ${slate.color}; 
`

export const ModalSectionHeader = ({ children }) => (
  <ModalSectionHeaderContainer>
    <ModalSectionHeaderText>
      { children }
    </ModalSectionHeaderText>   
  </ModalSectionHeaderContainer> 
)

export const ExtraContainer = styled.ScrollView`
  
`

export const ExtraBackgroundContainer = styled.View`
  background-color: #F0F0F0;
  flex: 1;
`

export const ExtraFullContainer = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;  
  flex: 1;
  width: 100%;
  height: 100%;
  
  ${props => props.isImage && css`
    align-items: center;
    justify-content: center;
  `}
`

export const ExtraItemContainer = styled.TouchableOpacity`
  height: 120px;
  width: 100%;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-bottom-width: 1;
  border-color: ${grey400.color};
`

export const ExtraItemText = styled.Text`
  font-size: 17;
  color: ${props => props.color || slate.color};
  margin-top: 4;
`

export const ExtraItemImage = styled.Image`
  height: 120px;
  width: 100%;
`

export const ExtraCloseButtonContainer = styled.TouchableOpacity`
  height: 50px;
  width: 100%;
  justify-content: center;
  align-items: center;
  background-color: ${red.color};
`

export const ExtraCloseButtonText = styled.Text`
  color: #FFF;
  font-weight: bold;
  font-size: 16px;
  text-align: center;
`

export const ExtraExitContainer = styled.TouchableOpacity`
  position: absolute;
  top: 12;
  right: 12;
  height: 50;
  width: 50;
  border-radius: 25;
  background-color: white;
  align-items: center;
  justify-content: center;
`

export const ExtraPhotoCaptureBackground = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100;
  background-color: rgba(0,0,0,.2);
`

export const ExtraPhotoCaptureContainer = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100;
  justify-content: center;
  align-items: center;
`

export const ExtraPhotoCaptureButton = styled.TouchableOpacity`
  height: 80;
  width: 80;
  align-items: center;
  justify-content: center;
`

export const ExtraPhotoCapturedImage = styled.Image`
  flex: 1;
  justify-content: center;
  align-items: center;
  
  ${props => props.height && css`
    height: ${props.height - 99};
  `}
  ${props => props.width && css`
    width: ${props.width};
  `}
`

export const SelectBothContainer = styled(ScrollableTabView)`
  flex: 1;
`

export const SelectBothViewContainer = styled.View`
  flex: 1;
`

export const SelectBothButtonContainer = styled.TouchableOpacity`
  height: 50px;
  width: 100%;
  background-color: ${blueLt.color};
  align-items: center;
  justify-content: center;
`

export const SelectBothButtonText = styled.Text`
  font-size: 15;
  font-weight: bold;
  color: white;
`

export const SelectBothSpacer = styled.View`
  flex: 1;
`

export const ExtraModelsContainer = styled.ScrollView`
  padding-horizontal: 20;
`

export const ExtraModelsSpacer = styled.View`
  margin-vertical: 15;
`

export const ExtraModelCardContainer = styled.View`
  width: 100%;
  background-color: white;
  border-width: 1;
  border-color: ${grey400.color};
  margin-bottom: 15;
`

export const ExtraModelImageContainer = styled.View`
  height: 160;
  align-items: center;
  justify-content: center;
`

export const ExtraModelCardTitleContainer = styled.View`
  width: 100%;
  padding-vertical: 10;
  justify-content: center;
  align-items: center;
  background-color: ${blueLt.color};
`

export const ExtraModelCardSelectedContainer = styled.View`
  position: absolute;
  top: 10;
  left: 10;
  background-color: ${green.color};
  height: 30;
  width: 30;
  border-radius: 15;
  align-items: center;
  justify-content: center;
`

export const ExtraModelCardButtonContainer = styled.TouchableOpacity`
  position: absolute;
  top: 120;
  right: 15;
  padding-horizontal: 12;
  padding-vertical: 8;
  background-color: ${blueLt.color};
`

export const ExtraModelCardButtonText = styled.Text`
  font-size: 13;
  font-weight: bold;
  color: white;
  border-radius: 4;
`