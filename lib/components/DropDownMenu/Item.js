import React, { Component } from 'react';
import {
  View,
} from 'react-native';

import {
  flxRow,
  jcc,
  aic,
  text,
  slate
} from '../../styles';

import H2 from '../H2';
import Button from './Button'

export const Item = ({ option, property, style, onPress }) => (
  <Button
    style={style.modalItem}
    onPress={onPress}
  >
    <View style={[flxRow, aic]}>
      <H2 style={[slate.text, text.fw600]}>
        {option[property]}
      </H2>
    </View>
  </Button>
)

export default Item
