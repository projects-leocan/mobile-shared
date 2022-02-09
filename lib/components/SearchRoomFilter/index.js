import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import {
  flxRow,
  margin,
  padding,
  aic,
  text,
  white,
  grey,
  greyDk,
  splashBg
} from 'rc-mobile-base/lib/styles';
import FormField from 'rc-mobile-base/lib/components/FormField';
import SearchFormField from 'rc-mobile-base/lib/components/SearchFormField';
const buttonBorderColor = '#cfd4de';


export const SearchFormContent = ({ onPress, placeholder }) => (
  <View style={[flxRow, white.bg, padding.a10, aic, { height: 80, width: '100%' }]}>
    <View style={styles.searchContainer}>
      <View style={styles.searchIconContainer}>
        <Icon
          name='search'
          size={30}
          color={splashBg.color}
        />
      </View>

      <View style={styles.searchFieldContainer}>
        <SearchFormField
          autoCapitalize="none"
          autoCorrect={false}
          style={[white.bg, greyDk.text, text.fw600, { height: '100%', width: '100%', paddingLeft: 8 }]}
          name="search"
          placeholderTextColor={'#808080'}
          placeholder={placeholder}
        />
      </View>

    </View>
  </View>
)

export default SearchFormContent

const styles = StyleSheet.create({
  searchContainer: {
    height: '100%',
    flex: 1,
    flexDirection: 'row',
    marginVertical: 12,
    marginHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: buttonBorderColor
  },
  searchIconContainer: {
    width: 50,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchFieldContainer: {
    flexGrow: 1,
    backgroundColor: '#f0f'
  }
})