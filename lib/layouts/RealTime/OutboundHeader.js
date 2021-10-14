import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

import {
  slate,
  red,
  orange
} from 'rc-mobile-base/lib/styles';

export default OutboundHeader = ({ title, type }) => (
  <View style={[styles.container, type.toLowerCase() === "pending" ? orange.bg : red.bg]}>
    <Text style={styles.title}>{ title && title.toUpperCase() }</Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    height: 36,
    justifyContent: 'center',
    paddingLeft: 10
  },
  title: {
    color: 'white',
    fontSize: 14
  }
});