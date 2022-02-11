import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { splashBg } from 'rc-mobile-base/lib/styles';


const SectionHeading = ({ heading, style, children }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{ `${children || heading || ''}` }</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
    // borderBottomWidth: 1,
    // borderBottomColor: '#C2C2C2',
    borderStyle: 'solid',
    paddingBottom: 1
  },
  text: {
    fontWeight: '700',
    color: splashBg.color,
    fontSize: 18
  },
});

export default SectionHeading;
