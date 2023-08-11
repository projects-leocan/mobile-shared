import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import I18n from 'react-native-i18n';
import styled from 'styled-components/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';

import {
  grey100,
  grey400,
  grey600,
  slate,
  black,
  white
} from 'rc-mobile-base/lib/styles';

const greyText = '#838383';

export const SafeAreaContainer = styled.SafeAreaView`
  flex: 1;
  width: 100%;
`;

export const RootContainer = styled.View`
  flex: 1;
  width: 100%;
`;

export const HeaderImageSliderContainer = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export const PageContainer = styled.View`
  flex: 1;
  width: 100%;
`;

export const HeaderImages = styled(FastImage)`
  height: ${hp('30%')};
  width: 100%;
  align-items: center;
  justify-content: center;
  resize-mode: contain;
  background-color: ${black.color}
`;

export const ImageDescriptionContainer = styled.View`
  flex: 1;
  width: 100%;
  padding: 8px;
  background-color: ${white.color}
`;

export const DescriptionFlatList = styled(FlatList)`
  flex: 1;
`;

export const InformationContainer = styled.View`
  width: 100%;
  padding: 10px;
  background-color: ${grey600.color};
  border-radius: 8px;
  margin-vertical: 10px;
`;

export const ItemLabel = styled.Text`
  font-size: 18;
  line-height: 30;
  color: ${greyText};
  justify-content: center;
`;

export const ItemLabelDesc = styled.Text`
  font-size: 19;
  line-height: 30;
  color: ${black.color};
  justify-content: center;
  font-weight: bold 
`;

export const ItemSubLabelDesc = styled.Text`
  font-size: 18;
  line-height: 30;
  color: ${black.color};
  justify-content: center;
  padding-left: 15
`;

export const PagerBottomContainer = styled.View`
    height: 50;
    width: 100%;
    flex-direction: row;
    bottom: 10;
    zIndex: 99;
    position: absolute;
`;

export const PagerBottomInnerContainer = styled.TouchableOpacity`
    flex: 1;
    zIndex: 99;
    align-content: center;
    justify-content: center;
`;

export const styles = StyleSheet.create({
  pagerStyle: {
    height: '100%',
    width: '100%',
  }
})

export const ImageNameContainer = styled.Text`
padding: 5px;
fontSize:16
`