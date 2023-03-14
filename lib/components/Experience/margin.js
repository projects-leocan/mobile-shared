import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

const Margin = ({top, bottom, right, left}) => {
  const style = {
    marginTop: top || 0,
    marginBottom: bottom || 0,
    marginRight: right || 0,
    marginLeft: left || 0
  };

  return (
    <View style={style}></View>
  )
}

export default Margin;
