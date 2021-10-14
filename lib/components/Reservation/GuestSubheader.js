import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const GuestSubheader = ({ name, occupants, vip, style }) => {
  if (!name) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.textItem}>{ name }</Text>
      <Text style={[styles.textItem, { paddingLeft: 3, paddingRight: 3 }]}>·</Text>
      <Text style={[styles.textItem, { marginRight: 2 }]}>{ occupants }</Text>
      <Icon name="user" size={13} color="#5E5E5E" />
      {
        vip ?
        <Text style={[styles.textItem, { marginRight: 2 }]}>{ ` · ${vip}` }</Text>
        : null
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    height: 40,
    marginBottom: 15
  },
  textItem: {
    color: '#5E5E5E',
    fontSize: 15
  }
});

export default GuestSubheader;
