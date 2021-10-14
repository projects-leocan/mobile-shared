import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import I18n from 'react-native-i18n'

import {
  padding,
  jcfe,
  flx1
} from 'rc-mobile-base/lib/styles';

const FloorLabel = ({ children }) => {
  return (
    <View style={[styles.container, jcfe]}>
      <Text style={styles.number}>{ `${I18n.t('base.ubiquitous.floor').toUpperCase()} ${children}` }</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height:40,

  },
  number: {
    paddingTop: 15,
    paddingLeft: 9,
    ...flx1
  }
});

export default FloorLabel;
