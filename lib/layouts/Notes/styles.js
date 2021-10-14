import React from 'react';
import I18n from 'react-native-i18n'
import styled from 'styled-components/native';
import {
  grey400
} from 'rc-mobile-base/lib/styles';

export const NewNoteContainer = styled.View`
  flex-direction: row;
  width: 100%;
  margin-bottom: 10;
  margin-top: 5;
`

export const NewNoteInput = styled.TextInput`
  height: 80
  flex: 1;
  color: #000;
  border-color: #DDDDDD
  background-color: white
  border-width: 1
  border-radius: 2
  padding-horizontal: 10
  padding-vertical: 5
  fontSize: 14
`

export const NewNotePhotoButton = styled.TouchableOpacity`
  height: 80;
  width: 80;
  margin-left: 10;
  background-color: white;
  align-items: center;
  justify-content: center;
  border-color: #DDDDDD;
  border-width: 1;
  border-radius: 2;
`

export const NewPhotoPlaceholderContainer = styled.TouchableOpacity`
  height: 80;
  width: 80;
  background-color: white;
  margin-left: 10;
  border-radius: 2;
`

export const NewPhotoPlaceholder = styled.Image`
  height: 80;
  width: 80;
`

export const NewPhotoXContainer = styled.View`
  position: absolute;
  top: 8;
  right: 8;
`

export const NoteContainer = styled.View`
  flex-direction: row;
  min-height: 50;
  justify-content: flex-start;
  padding-vertical: 10;
  padding-horizontal: 8;
  border-radius: 1;
  background-color: white;
  margin-bottom: 10;
  border-color: ${grey400.color};
  border-width: 1;
  border-radius: 2;
`

export const NoteUserImage = styled.Image`
  height: 40;
  width: 40;
  border-radius: 20;
`

export const NoteContentContainer = styled.View`
  padding-horizontal: 10;
  flex: 1;
  padding-top: 4;
`

export const NoteUserTimeText = styled.Text`
  font-size: 11;
  color: #7C7C7C;
  font-weight: 500;
`

export const NoteNoteText = styled.Text`
  color: #4a4a4a;
  font-weight: 400;
  font-size: 15;
  padding-bottom: 5;
`

export const NoteNoteImageContainer = styled.TouchableOpacity`
  height: 40;
  width: 40;
`

export const NoteNoteImage = styled.Image`
  height: 40;
  width: 40;
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