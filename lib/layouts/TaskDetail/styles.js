import React from 'react';
import { Platform, Image } from 'react-native';
import I18n from 'react-native-i18n';
import styled, { css } from 'styled-components/native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';

import {
  slate,
  grey400,
  blueLt,
  red,
  green,
  white,
  splashBg,
  grey600,
  black,
  grey,
  themeTomato
} from 'rc-mobile-base/lib/styles';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from "react-native-modal";

const separatorColor = '#e6e8ed';
const greyText = '#838383';
const inputBorderColor = '#cfd4de';
const isIOS = Platform.OS === 'ios';

export const Container = styled.View`
  flex: 1;
  width: 100%;
  background-color: ${white.color};
  padding-horizontal: 14px;
  padding-top: 14px;
`

export const VideoContainer = styled.View`
  flex: 1;
  width: 100%;
  background-color: ${white.color};
`

export const SubheaderContainer = styled.View`
  height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding-horizontal: 5px;
`

export const SubheaderStatusText = styled.Text`
  font-size: 22px;
  font-weight: 500;
  flex: 1;
  color: ${splashBg.color};
`
export const SubheaderStatusTextCopy = styled.Text`
  font-size: 22px;
  font-weight: 500;
  color: ${splashBg.color};
`

export const SubheaderTimeText = styled.Text`
  font-size: 15px;
  color: ${slate.color};
  opacity: .8;
`

export const InformationContainer = styled.View`
  width: 100%;
  padding: 10px;
  background-color: ${grey600.color};
  border-radius: 8px;
  margin-vertical: 10px;
`;

export const HeaderContainer = styled.View`
  height: 50px;
  width: 100%;
  justify-content: center;
`;

export const HeaderText = styled.Text`
  font-size: 20px;
  color: ${splashBg.color};
  font-weight: 500;
  justify-content: center;

`;

export const HeaderSeparator = styled.View`
  height: 1px;
  width: 100%;
  background-color: ${separatorColor};
  align-self: flex-end;
  position: absolute;
  bottom: 0
`;

export const ItemContainer = styled.View`
  width: 100%;
  justify-content: center;
  padding-top: 5px;
`;

export const ItemLabel = styled.Text`
  font-size: 18px;
  line-height: 30;
  color: ${greyText};
  justify-content: center;
`;

export const ItemLabelDesc = styled.Text`
  font-size: 18px;
  line-height: 30;
  color: ${black.color};
  justify-content: center;
`;

export const HorizontalContainer = styled.View`
  flex-direction: row;
`;

export const CreateByContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-top: 12px;
`;

export const CreateByImageContainer = styled.View`
  height: 54px;
  width: 54px;
  border-radius: 27px;
  margin-right: 12px;
  overflow: hidden;
  background-color: ${grey.color};
`;

export const CreateByImage = styled.Image`
  flex: 1;
  resize-mode: contain;
`;

export const CreatedByName = styled.Text`
  flex: 1;
  font-size: 18px;
  line-height: 30;
  color: ${black.color};
  justify-content: center;
`;

export const TaskImageCellContainer = styled.TouchableOpacity`
  height: ${wp('30') - 40};
  width: ${wp('30') - 40};
  margin-horizontal: 5px;
  margin-vertical: 12px;
  border-radius: 8px;
  overflow: hidden;
  color: ${grey.color};
`;

export const TaskVideoCellContainer = styled(Video)`
  height: 100%;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
`;


export const TaskImageView = styled(FastImage)`
  height: 100%;
  width: 100%;
  resize-mode: cover;
`;

export const TaskVideoView = styled(Video)`
  height: 100%;
  width: 100%;
  resize-mode: cover;
`;

export const VideoPlayContainer = styled.View`
  align-items: center;
  justify-content: center;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  position: absolute;
`;

export const VideoPlayTouchable = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
`;

export const SafeAreaContainer = styled.SafeAreaView`
  flex: 1;
  width: 100%;
  background-color: #000;
`;

export const RootView = styled.View`
  flex: 1;
  width: 100%;
`;

export const TaskModalContainer = styled.View`
  height: ${hp('100%')};
  width: ${wp('100%')};
  position: absolute;
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
`;

export const HeaderIcon = styled(Icon)`
    align-self: center;
    color: #fff;
    font-size: 30px;
`;

export const TaskImageHeaderContainer = styled.View`
    top: ${isIOS ? getStatusBarHeight() : 0};
    background-color: #000;
    width: 100%;
    zIndex: 9999;
    flex-direction: row;
`;

export const HeaderImageIndicator = styled.Text`
    color: ${white.color};
    text-align: center;
    margin: 10px;
    font-size: 18px;
    flex: 1;
    justify-content: center;
    align-self: center;
`;

export const CloseIconPositionContainer = styled.View`
  right: 12;
  position: absolute;
`;

export const CloseIconContainer = styled.TouchableOpacity`
  height: 40px;
  width: 40px;
  justify-content: center;
  align-self: center;
  align-items: center;
`;

//--

export const ButtonContainer = styled.TouchableOpacity`
  minHeight: 60px;
  width: 100%;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${splashBg.color};
  border-radius: 8px;
  margin-vertical: 12px;
`;

export const ButtonIconContainer = styled.View`
  height: 60px;
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
  font-size: 18px;
  text-align: center;
  color: ${splashBg.color};
  font-weight: bold;
`;

export const InputOuterContainer = styled.View`
    flex-direction: column;
    justify-content: space-between;
`;

export const InputContainer = styled.View`
  min-height: 60px;
  width: 100%;
  background-color: ${white.color};
  border-width: 1px;
  border-radius: 8px;
  padding: 8px;
  border-color: ${inputBorderColor}
  margin-vertical: 12px;
`;

export const TimeInputContainer = styled.TouchableOpacity`
  height: 60;
  width: 100%;
  background-color: ${white.color};
  border-width: 1px;
  border-radius: 8px;
  padding: 8px;
  border-color: ${inputBorderColor}
  margin-vertical: 12px;
  align-items: center;
  justify-content: center;
`;

export const TimeText = styled.Text`
  font-size: 16px;
  text-align: center;
  justify-content: center;
  color: ${props => props.isShowAsPlaceHolder ? '#C7C7CD' : black.color};
`;

export const InputField = styled.TextInput`
  flex: 1;
  height: 100%;
  width: 100%;
  font-size: 16px;
`;

export const MessageSendContainer = styled.View`
  height: 50;
  width: 50;
  border-radius: 25px;
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

export const SendMessageImage = styled(Image)`
  height: 15;
  width: 15;
  tint-color: ${white.color}
`;

export const BottomActionButton = styled.TouchableOpacity`
  flex: 1;
  width: 100%;
  min-height: 60px;
`;

// modal 

export const ModalContainer = styled.View`
  flex: 1;
  background-color: #F0F0F0;
`

export const ModalUserContainer = styled.TouchableOpacity`
  height: 70;
  flex-direction: row;
  align-items: center;
  padding-horizontal: 12px;
  background-color: white;
  border-bottom-width: 1px;
  border-color: ${grey400.color};
`

export const ModalUserText = styled.Text`
  font-size: 17px;
  color: ${slate.color};
  padding-left: 12px;
`

export const ModalSectionHeaderContainer = styled.View`
  padding-horizontal: 12px;
  padding-top: 15px;
  padding-bottom: 5px;
  border-bottom-width: 1px;
  border-color: ${grey400.color};
  background-color: #F0F0F0;
`

export const ModalSectionHeaderText = styled.Text`
  font-size: 17px;
  color: ${slate.color}; 
`

export const ModalSectionHeader = ({ children }) => (
  <ModalSectionHeaderContainer>
    <ModalSectionHeaderText>
      {children}
    </ModalSectionHeaderText>
  </ModalSectionHeaderContainer>
)

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
  font-size: 15px;
  font-weight: bold;
  color: white;
`

export const SelectBothSpacer = styled.View`
  flex: 1;
`

export const MessageContainer = styled.View`
  flex-direction: row;
  background-color: white;
  padding-horizontal: 12px;
  padding-vertical: 10px;
  width: 100%;
  border-top-width: 1px;
  border-top-color: #E5E5E5;
`

export const MessageAvatar = styled.Image`
  width: 48;
  height: 48;
  border-radius: 24px;
  background-color: gray;
`

export const MessagesAltBg = styled.View`
  width: 48;
  height: 48;
  border-radius: 24px;
  background-color: ${grey400.color};
  justify-content: center;
  align-items: center;
`

export const MessagesAltText = styled.Text`
  font-size: 17px;
  color: ${slate.color};
`

export const ModalImageContainer = styled(Modal)`
  flex: 1;
  width: 90%;
  align-self: center;
  justify-content: center;
  align-items: center;
`;

export const ModalImageWrapper = styled.View`
  flex: 0.8;
  width: 100%;
  border-radius: 5px;
  align-self: center;
  justify-content: center;
  align-items: center;
  padding-top: 30px;
  padding-right: 2px;
  background-color: ${white.color};
  overflow: visible;
`;

export const ModalImageClose = styled.TouchableOpacity`
  height: 34px;
  width: 34px;
  border-radius: 17px;
  right: -8px;
  top: -8px;
  position: absolute;
  background-color: ${themeTomato.color};
  zIndex: 1;
  justify-content: center;
  align-items: center;
`;

export const CloseModalIcon = styled(Icon)`
    align-self: center;
    color: #fff;
    font-size: 28px;
`;

export const ChatItemContainer = styled.View`
  height: 50px;
  margin: 2px;
  background-color: #f0f;
`;

export const ChatProfileContainer = styled.View`
  height: 50px;
  width: 50px;
  border-radius: 25px;
  background-color: ${grey400.color}
`;

export const DateDifferanceView = styled.View`
alignItems:flex-end
marginRight:-5px
`

export const MessageAlt = ({ children }) => (
  <MessagesAltBg>
    <MessagesAltText>{children && children.toUpperCase()}</MessagesAltText>
  </MessagesAltBg>
)
//--