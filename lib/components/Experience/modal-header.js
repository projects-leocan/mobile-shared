import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { blueLt } from 'rc-mobile-base/lib/styles'

const ModalHeader = ({ style, children }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{ children }</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 54,
    backgroundColor: blueLt.color,
    justifyContent: "center",
    alignItems: 'center',
    paddingBottom:10
  },
  title: {
    color: 'white',
    fontSize: 17
  }
});

export default ModalHeader;
