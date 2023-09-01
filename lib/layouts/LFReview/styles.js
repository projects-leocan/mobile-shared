import React from 'react';
import styled, { css } from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Dimensions } from 'react-native';

import {
  grey400,
  grey100,
  grey,
  greyDk,
  white,
  blueLt,
  blue,
  red,
  orange,
  slate
} from 'rc-mobile-base/lib/styles';
import { Platform } from 'react-native';

export const Container = styled.View`
  flex: 1;
  background-color: #F0F0F0; 
`

export const SubheaderContainer = styled.View`
  flex-direction: row;
  background-color: ${white.color};
  height: 60px;
  padding-left: 10px;
  padding-right: 20px;
`

export const Content = styled.View`
  flex: 1;
  padding-horizontal: 20px;
`

export const ContentSpacing = styled.View`
  margin-vertical: 10px;
`

export const ListHeaderContainer = styled.View`
  
`

export const ListHeaderDate = styled.Text`
  padding-top: 24px;
  padding-bottom: 8px;
`

export const ItemContainer = styled.View`
  flex-direction: row;
  height: 60px;
  align-items: center;
  background-color: white;
  margin-bottom: 4px;
`

export const ItemImage = styled.Image`
  height: 60px;
  width: 60px;
  margin-right: 10px;
`

export const ItemImagePlaceholderContainer = styled.View`
  height: 60px;
  width: 60px;
  margin-right: 10px;
  background-color: ${grey100.color};
  justify-content: center;
  align-items: center;
`

export const ItemImagePlaceholder = () => (
  <ItemImagePlaceholderContainer>
    <Icon name="picture-o" size={24} color={slate.color} />
  </ItemImagePlaceholderContainer>
)

export const ItemDescription = styled.Text`
  color: ${slate.color};
  font-size: 14px;
  flex: 2;
  margin-left: 10px;
`

export const ItemTypeContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`

export const ItemTypeBg = styled.View`
  padding-vertical: 6px;
  padding-horizontal: 8px;
  background-color: ${props => props.isFound ? blueLt.color : red.color};
  border-radius: 4px;
`

export const ItemTypeText = styled.Text`
  font-weight: bold;
  color: white;
  font-size: 13px;
`

export const ItemReference = styled.Text`
  color: ${slate.color};
  font-size: 14px;
  flex: 1;
`

export const ItemGuest = styled.Text`
  color: ${slate.color};
  font-size: 14px;
  flex: 2;
`

export const ItemLocation = styled.Text`
  color: ${slate.color};
  font-size: 14px;
  flex: 1;
`

export const ItemUser = styled.Text`
  color: ${slate.color};
  font-size: 14px;
  flex: 1;
`

export const ItemStatusContainer = styled.View`
  justify-content: center;
  align-items: center;
  margin-horizontal: 10px;
`

export const ItemStatusButton = styled.TouchableOpacity`
  height: 44px;
  width: 100px;
  padding-horizontal: 4px;
  background-color: ${blue.color};
  justify-content: center;
  border-radius: 4px;
`

export const ItemStatusText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 13px;
  text-align: center;
`

export const ModalContainer = styled.View`
  background-color: white;
  width: ${ Platform.isPad ? 800 : Dimensions.get('window').width - 40};
  height: 600px;
`

export const ModalContent = styled.View`
  flex: 1;
  padding-horizontal: 20px;
  margin-vertical: 20px;
`

export const OptionsContainer = styled.View`
  flex: 1;
`

export const OptionsContent = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`

export const OptionButton = styled.TouchableOpacity`
  width: 100px;
  height: 100px;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
  background-color: ${props => props.isActive ? blue.color: greyDk.color};
  padding-horizontal: 4px;
  margin-bottom: 10px;
`

export const OptionText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 13px;
  text-align: center;
  margin-top: 8px;
`

export const HandDeliveredContainer = styled.View`
  padding-horizontal: 20px;
  flex: 1;
`

export const HandDelieverdSignatureContainer = styled.View`
  height: 430px;
`

export const HandDelieverdSignatureContent = styled.View`
  width: 100%;
  height: 400px;
`

export const HandDeliveredHeaderText = styled.Text`
  font-size: 14px;
  color: #4A4A4A;
  opacity: 0.6;
  margin-bottom: 10px;
`

export const HandDeliveredSubheaderText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: #4A4A4A;
  opacity: 0.4;
`

export const HandDeliveredResetButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 10;
  left: 10;
  width: 80px;
  height: 50px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  background-color: ${orange.color};
`

export const HandDeliveredOkayButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 10;
  right: 10;
  width: 80px;
  height: 50px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  background-color: ${blue.color}; 
`

export const HandDelieverdButtonText = styled.Text`
  font-weight: bold;
  color: white;
`

export const HandDelieverdSignatureImage = styled.Image`
  width: 100%;
  height: 400px;
`

export const PhotosContainer = styled.View`
  flex: 1;
  margin-top: 20px;
`

export const PhotosContent = styled.View`
  flex-direction: row;
  flex-wrap:wrap
`

export const NotesContainer = styled.View`
  flex: 1;
  margin-top: 20px;
`

export const NotesInput = styled.TextInput`
  flex: 1;
  border-width: 1;
  border-color: ${grey400.color};
  padding-top: 10px;
  padding-horizontal: 15px;
  font-size: 16px;
`

export const Spacer = styled.View`
  flex: 1;
`

export const SelectionButtonContainer = styled.TouchableOpacity`
  height: 60px;
  width: 100px;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.isActive ? blueLt.color: white.color};
  border-color: ${grey100.color};
  border-right-width: ${props => props.isActive ? 0 : 1}px;
  border-left-width: ${props => props.isActive ? 0 : 1}px;
  padding-horizontal: 10px;
  marginRight: ${Platform.isPad ? 0 : 5}px
`

export const SelectionButtonText = styled.Text`
  text-align: center;
  font-weight: bold;
  font-size: 13px;
  color: ${props => props.isActive ? white.color : blueLt.color};
`

export const ImageContainer = styled.View`
height: 60px;
width: 60px;
justify-content: center;
align-items: center;
`