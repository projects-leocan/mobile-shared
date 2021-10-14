import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  flxRow,
  margin,
  padding,
  aic,
  text,
  white,
  grey,
  greyDk,
} from 'rc-mobile-base/lib/styles';
import FormField from 'rc-mobile-base/lib/components/FormField';

export const SearchFormContent = ({ onPress, placeholder }) => (
  <View style={[flxRow, white.bg, padding.a10, aic, { height: 60 }]}>
    <FormField
      autoCapitalize="none"
      autoCorrect={false}
      style={[grey.bg, greyDk.text, text.center, text.fw600, {borderRadius: 20, height: 40}]}
      name="search"
      placeholderTextColor='#ccc'
      placeholder={placeholder}
    />
    {/*
     <TouchableOpacity
      onPress={() => onPress()}
    >
      <Icon
        style={[margin.x20]}
        name="filter"
        size={30}
        color={grey.color}
      />
    </TouchableOpacity> 
    */}
  </View>
)

export default SearchFormContent
