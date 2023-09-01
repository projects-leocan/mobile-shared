import React from 'react';
import I18n from 'react-native-i18n'
import styled from 'styled-components/native';
import {
  grey400
} from 'rc-mobile-base/lib/styles';

export const NewNoteContainer = styled.View`
  flex-direction: row;
  width: 100%;
  margin-bottom: 10px;
  margin-top: 5px;
`

export const NewNoteInput = styled.TextInput`
  height: 80px
  flex: 1;
  border-color: #DDDDDD
  color: #000
  background-color: white
  border-width: 1px
  border-radius: 2px
  padding-horizontal: 10px
  padding-vertical: 5px
  fontSize: 14px
`

export const NewNotePhotoButton = styled.TouchableOpacity`
  height: 80px;
  width: 80px;
  margin-left: 10px;
  background-color: white;
  align-items: center;
  justify-content: center;
  border-color: #DDDDDD;
  border-width: 1px;
  border-radius: 2px;
`

export const NewPhotoPlaceholderContainer = styled.TouchableOpacity`
  height: 80px;
  width: 80px;
  background-color: white;
  margin-left: 10px;
  border-radius: 2px;
`

export const NewPhotoPlaceholder = styled.Image`
  height: 80px;
  width: 80px;
`

export const NewPhotoXContainer = styled.View`
  position: absolute;
  top: 8;
  right: 8;
`

export const NoteContainer = styled.View`
  flex-direction: row;
  min-height: 50px;
  justify-content: flex-start;
  padding-vertical: 10px;
  padding-horizontal: 8px;
  border-radius: 1px;
  background-color: white;
  margin-bottom: 10px;
  border-color: ${grey400.color};
  border-width: 1px;
  border-radius: 2px;
`

export const NoteUserImage = styled.Image`
  height: 40px;
  width: 40px;
  border-radius: 20px;
`

export const NoteContentContainer = styled.View`
  padding-horizontal: 10px;
  flex: 1;
  padding-top: 4px;
`

export const NoteUserTimeText = styled.Text`
  font-size: 11px;
  color: #7C7C7C;
  font-weight: 500;
`

export const NoteNoteText = styled.Text`
  color: #4a4a4a;
  font-weight: 400;
  font-size: 15px;
  padding-bottom: 5px;
`

export const NoteNoteImageContainer = styled.TouchableOpacity`
  height: 40px;
  width: 40px;
`

export const NoteNoteImage = styled.Image`
  height: 40px;
  width: 40px;
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
  height: 50px;
  width: 100px;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

export const FocusImageClose = ({ handler = () => null }) => (
  <FocusImageCloseContainer onPress={handler}>
    <FocusImageTapText>{ I18n.t('base.ubiquitous.close').toUpperCase() }</FocusImageTapText>
  </FocusImageCloseContainer>
)