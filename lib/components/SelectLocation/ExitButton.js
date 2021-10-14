import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import I18n from 'react-native-i18n';

import {
  flxRow,
  margin,
  padding,
  eitherGrey_100_200,
  eitherGreyRed,
  greyDk,
  blueLt,
  slate,
  lCenterCenter,
  white
} from 'rc-mobile-base/lib/styles';

const ExitButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.exitBtn} onPress={onPress}>
      <Text style={styles.exitBtnText}>
        { I18n.t('base.ubiquitous.exit-selection') }
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  exitBtn: {
    ...flxRow,
    ...greyDk.bg,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  exitBtnText: {
    fontSize: 17,
    fontWeight: 'bold',
    ...white.text
  }
});

export default ExitButton;
