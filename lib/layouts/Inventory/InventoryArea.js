import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import {
  grey400,
  lCenterCenter,
  white,
  padding,
  slate
} from 'rc-mobile-base/lib/styles';

const InventoryArea = ({ area, onPress }) => (
  <TouchableOpacity style={styles.container} onPress={() => onPress(area)}>
    <View style={[styles.overlay, area && area.image ? null : white.bg]}>
      <Text style={[styles.areaText, area && area.image ? null : slate.text]}>{ area.label }</Text>
    </View>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  container: {
    height: 160,
    backgroundColor: 'white',
    borderBottomColor: grey400.color,
    borderBottomWidth: 1
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,.1)',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    ...lCenterCenter,
    ...padding.x20
  },
  areaText: {
    ...white.text,
    fontSize: 22,
    fontWeight: '500'
  }
});

export default InventoryArea;
