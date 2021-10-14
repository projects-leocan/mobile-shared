import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

import { greyLt, grey, margin } from 'rc-mobile-base/lib/styles';
import { mergeStyles } from 'rc-mobile-base/lib/utils/styles';

const SearchSubheader = ({ style, searchQuery, updateQuery, children }) => {
  return (
    <View style={mergeStyles([styles.container, style && style.container])}>
      <TextInput
        style={mergeStyles([styles.searchInput, style && style.input, { color: '#000' }])}
        placeholder={children}
        placeholderTextColor="#ccc" 
        value={searchQuery}
        onChangeText={updateQuery}
        />
      <TouchableOpacity style={[styles.closeBtn, style && style.btn]} onPress={() => updateQuery("")}>
        <Icon name="cross" size={32} color="white" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    ...grey.bg,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  searchInput: {
    height: 50,
    ...greyLt.bg,
    ...margin.x10,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    flex: 1
  },
  closeBtn: {
    position: 'absolute',
    right: 12,
    top: 12,
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  }
});

export default SearchSubheader;
