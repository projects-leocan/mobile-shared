import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Dimensions } from 'react-native';
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
  center
} from 'rc-mobile-base/lib/styles';

const greyText = '#838383';
const numColumns = 3;
const size = (Dimensions.get('window').width - 30)/numColumns;

export const SafeAreaContainer = styled.SafeAreaView`
  flex: 1;
  width: 100%;
`;

export const RootContainer = styled.View`
  flex: 1;
  width: 100%;
`;

export const HeaderImageSliderContainer = styled.View`
  height: ${hp('30%')};
  width: 100%;
  align-items: center;
  justify-content: center;
  background-color: ${black.color}
`;

export const PageContainer = styled(TouchableOpacity)`
  flex: 1;
  width: 100%;
`;

export const HeaderImages = styled(FastImage)`
  height: ${hp('30%')};
  width: 100%;
  align-items: center;
  justify-content: center;
  resize-mode: contain;
`;

export const ImageDescriptionContainer = styled.View`
  flex: 1;
  width: 100%;
  padding: 8px;
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
  font-size: 18;
  line-height: 30;
  color: ${black.color};
  justify-content: center;
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
  },
  imageThumbnail: {
    // justifyContent: 'center',
    // alignItems: 'center',
    height: size,
    width: size ,
    // shadowColor: '#171717',
    // shadowOffset: {width: 4, height: 4},
    // shadowOpacity: 0.4,
    // shadowRadius: 3,
    borderWidth: 0.5,
    borderColor: 'grey'
  },
  imageView: {
    flex: 1,
    flexDirection: 'column',
    // margin: 1,
    marginTop: 5,
    // margin: 10,
    // backgroundColor: 'orange',
    // alignItems: 'center'
    padding: 5
  }
})