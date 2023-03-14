import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';

import {
    slate,
    margin,
    flxRow,
    jcc,
    jcfs,
    aifs,
    aic,
    red,
    orange,
    green
} from 'rc-mobile-base/lib/styles';

const GlitchTask = ({ task, uuid, is_claimed, is_completed }) => {

  let color = slate;
  if (is_completed) {
    color = green;
  } else if (is_claimed) {
    color = orange;
  } else if (!is_completed && !is_claimed) {
    color = red;
  }

  return (
    <View style={[flxRow, jcfs, aic, margin.b5]}>
      <View style={[{ height: 10, width: 10, borderRadius: 5, ...color.bg, marginRight: 2 }]}></View>
      <Text key={task} style={[slate.text]}>{ task }</Text>
    </View>
  );
}

export default GlitchTask;
