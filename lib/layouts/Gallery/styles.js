import React from 'react';
import I18n from 'react-native-i18n';
import styled from 'styled-components/native';

import {
  grey100,
  grey400,
  slate
} from 'rc-mobile-base/lib/styles';

export const Container = styled.ScrollView`
  flex: 1;
`

export const ImageContainer = styled.View`
  border-bottom-width: 2px;
  border-bottom-color: ${grey400.color};
`

export const ImageContent = styled.TouchableOpacity`

`

export const DescriptionContainer = styled.View`
  background-color: ${grey100.color};
  justify-content: center;
  align-content: center;
  padding-horizontal: 20;
  padding-vertical: 10;
`

export const DescriptionText = styled.Text`
  color: ${slate.color};
  text-align: center;
`

export const PdfContainer = styled.View`
  border-bottom-width: 2px;
  border-bottom-color: ${grey400.color};
`

export const PdfContent = styled.TouchableOpacity`
  height: 240px;
  width: 100%;
  align-items: center;
  justify-content: center;
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

export const PdfFullContainer = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;  
  flex: 1;
  width: 100%;
  height: 100%;
`

export const PdfExitContainer = styled.TouchableOpacity`
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