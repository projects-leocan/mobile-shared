import React from 'react';
import { StyleSheet } from 'react-native';
import I18n from 'react-native-i18n';
import styled from 'styled-components/native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {
  grey100,
  grey400,
  slate
} from 'rc-mobile-base/lib/styles';

export const SafeAreaContainer = styled.SafeAreaView`
  flex: 1;
  width: 100%;
`;

export const RootContainer = styled.View`
  flex: 1;
`;

export const HeaderImageSliderContainer = styled.View`
  height: ${hp('30%')};
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export const PageContainer = styled.View`
  flex: 1;
  width: 100%;
`;

export const HeaderImages = styled.Image`
  height: ${hp('30%')};
  width: 100%;
  align-items: center;
  justify-content: center;
  resize-mode: contain;
`;

export const ImageDescriptionContainer = styled.View`
  flex: 1;
  width: 100%;
  background-color: #ff0
`;

export const DescriptionFlatList = styled.FlatList`
  flex: 1;
`;

export const styles = StyleSheet.create({
  pagerStyle: {
    height: '100%',
    width: '100%',
  }
})