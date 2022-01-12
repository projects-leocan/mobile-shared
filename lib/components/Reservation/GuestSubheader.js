import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const GuestSubheader = ({ name, occupants, vip, guestStatus, bedName, style }) => {
  if (!name) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.statusText}>{guestStatus}</Text>
      <View style={[styles.container, style]}>
        <Text style={styles.textItem}>{name}</Text>
        <Text style={[styles.textItem, { paddingLeft: 3, paddingRight: 3 }]}>·</Text>
        <Text style={[styles.textItem, { marginRight: 2 }]}>{occupants}</Text>
        <Icon name="user" size={13} color="#5E5E5E" />
        {
          vip ?
            <Text style={[styles.textItem, { marginRight: 2 }]}>{` · ${vip}`}</Text>
            : null
        }
      </View>
      <Text style={styles.bedNameText}>{bedName}</Text>
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
  },
  statusText: {
    color: '#7f0000',
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: 15
  },
  bedNameText: {
    color: '#7f0000',
    fontSize: 18,
    fontWeight: 'bold',
    paddingRight: 10
  }
});

export default GuestSubheader;
