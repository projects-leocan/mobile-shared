import React from 'react';
import styled, { css } from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';

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

export const Container = styled.View`
  flex: 1;
  background-color: #F0F0F0; 
`

export const SubheaderContainer = styled.View`
  flex-direction: row;
  background-color: ${white.color};
  height: 60;
  padding-left: 10;
  padding-right: 20;
`

export const Content = styled.View`
  flex: 1;
  padding-horizontal: 20;
`

export const ContentSpacing = styled.View`
  margin-vertical: 10;
`

export const ListHeaderContainer = styled.View`
  
`

export const ListHeaderDate = styled.Text`
  padding-top: 24;
  padding-bottom: 8;
`

export const ItemContainer = styled.View`
  flex-direction: row;
  height: 60;
  align-items: center;
  background-color: white;
  margin-bottom: 4;
`

export const ItemImage = styled.Image`
  height: 60;
  width: 60;
  margin-right: 10;
`

export const ItemImagePlaceholderContainer = styled.View`
  height: 60;
  width: 60;
  margin-right: 10;
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
  font-size: 14;
  flex: 2;
  margin-left: 10;
`

export const ItemTypeContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`

export const ItemTypeBg = styled.View`
  padding-vertical: 6;
  padding-horizontal: 8;
  background-color: ${props => props.isFound ? blueLt.color : red.color};
  border-radius: 4;
`

export const ItemTypeText = styled.Text`
  font-weight: bold;
  color: white;
  font-size: 13;
`

export const ItemReference = styled.Text`
  color: ${slate.color};
  font-size: 14;
  flex: 1;
`

export const ItemGuest = styled.Text`
  color: ${slate.color};
  font-size: 14;
  flex: 2;
`

export const ItemLocation = styled.Text`
  color: ${slate.color};
  font-size: 14;
  flex: 1;
`

export const ItemUser = styled.Text`
  color: ${slate.color};
  font-size: 14;
  flex: 1;
`

export const ItemStatusContainer = styled.View`
  justify-content: center;
  align-items: center;
  margin-horizontal: 10;
`

export const ItemStatusButton = styled.TouchableOpacity`
  height: 44;
  width: 100;
  padding-horizontal: 4;
  background-color: ${blue.color};
  justify-content: center;
  border-radius: 4;
`

export const ItemStatusText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 13;
  text-align: center;
`

export const ModalContainer = styled.View`
  background-color: white;
  width: 800;
  height: 600;
`

export const ModalContent = styled.View`
  flex: 1;
  padding-horizontal: 20;
  padding-vertical: 20;
`

export const OptionsContainer = styled.View`
  flex: 1;
`

export const OptionsContent = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`

export const OptionButton = styled.TouchableOpacity`
  width: 100;
  height: 100;
  border-radius: 4;
  justify-content: center;
  align-items: center;
  margin-right: 8;
  background-color: ${props => props.isActive ? blue.color: greyDk.color};
  padding-horizontal: 4;
  margin-bottom: 10;
`

export const OptionText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 13;
  text-align: center;
  margin-top: 8;
`

export const HandDeliveredContainer = styled.View`
  padding-horizontal: 20;
  flex: 1;
`

export const HandDelieverdSignatureContainer = styled.View`
  height: 430;
`

export const HandDelieverdSignatureContent = styled.View`
  width: 100%;
  height: 400;
`

export const HandDeliveredHeaderText = styled.Text`
  font-size: 14px;
  color: #4A4A4A;
  opacity: 0.6;
  margin-bottom: 10;
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
  width: 80;
  height: 50;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  background-color: ${orange.color};
`

export const HandDeliveredOkayButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 10;
  right: 10;
  width: 80;
  height: 50;
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
  height: 400;
`

export const PhotosContainer = styled.View`
  flex: 1;
  margin-top: 20;
`

export const PhotosContent = styled.View`
  flex-direction: row;
`

export const NotesContainer = styled.View`
  flex: 1;
  margin-top: 20;
`

export const NotesInput = styled.TextInput`
  flex: 1;
  border-width: 1;
  border-color: ${grey400.color};
  padding-top: 10;
  padding-horizontal: 15;
  font-size: 16;
`

export const Spacer = styled.View`
  flex: 1;
`

export const SelectionButtonContainer = styled.TouchableOpacity`
  height: 60;
  width: 100;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.isActive ? blueLt.color: white.color};
  border-color: ${grey100.color};
  border-right-width: ${props => props.isActive ? 0 : 1};
  border-left-width: ${props => props.isActive ? 0 : 1};
  padding-horizontal: 10;
`

export const SelectionButtonText = styled.Text`
  text-align: center;
  font-weight: bold;
  font-size: 13;
  color: ${props => props.isActive ? white.color : blueLt.color};
`