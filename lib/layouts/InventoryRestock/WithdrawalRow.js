import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const WithdrawalRow = ({ id, assetId, asset, index, withdrawal, isReplaced, handleRestock }) => {
  const containerStyles = [
    styles.container,
    index % 2 ? { backgroundColor: '#F0F0F0' } : null,
    isReplaced ? { backgroundColor: '#3CC86B' } : null
  ];

  return (
    <TouchableOpacity style={containerStyles} onPress={() => handleRestock(assetId, id)}>
      <Text style={[styles.assetName, isReplaced ? { color: 'white' } : null]}>{ asset }</Text>
      <Text style={[styles.withdrawal, isReplaced ? { color: 'white' } : null]}>{ withdrawal }</Text>
      <View style={styles.iconContainer}>
        { isReplaced ? <Icon name="check-square-o" size={24} color={'white'} /> : null }
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 50
  },
  assetName: {
    flex: 2,
    paddingLeft: 10
  },
  withdrawal: {
    flex: 1
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default WithdrawalRow;
