import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const GuestSubheader = ({ name, occupants, style }) => {
  if (!name) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.textItem}>{ name }</Text>
      <Text style={[styles.textItem, { paddingLeft: 3, paddingRight: 3 }]}>·</Text>
      <Text style={[styles.textItem, { marginRight: 2 }]}>{ occupants }</Text>
      <Icon name="user" size={13} color="#5E5E5E" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FDFDFD',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: 40,
    marginBottom: 15
  },
  textItem: {
    color: '#5E5E5E',
    fontSize: 15
  }
});

export default GuestSubheader;
