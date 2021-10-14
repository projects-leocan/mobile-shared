import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

import {
  flxRow,
  flxCol,
  white,
  grey,
  margin,
  padding,
  flex1,
  jcc,
  aic,
  jcsb,
  greyDk,
  grey400,
  asc
} from 'rc-mobile-base/lib/styles';
import H2 from 'rc-mobile-base/lib/components/H2';

const Button = ({ children, onPress }) => (
  <TouchableOpacity
    style={[flxRow, jcc, aic, padding.a10, { height: 45 }]}
    onPress={onPress}
  >
    {children}
  </TouchableOpacity>
)

const marginTop = (Dimensions.get('window').height - 300) / 2

export const SwipeoutOptions = ({ value, task, close, onPress }) => (
  <View style={[asc, {width: 200, height: 300, marginTop}]}>
    <View style={[padding.a10, flex1, flxCol, grey.bg, grey400.bc, jcsb]}>
      <View style={[flex1]}>
        {
          value.map((activity, index) => (
            <Button
              key={index}
              text={activity.text}
              onPress={() => {
                onPress(task, activity)
                close();
              }}
            >
              <View style={[flxRow, aic]}>
                <Icon
                  style={[margin.r5]}
                  size={18}
                  name={activity.icon}
                  color={greyDk.color}
                />
                <H2>{activity.text}</H2>
              </View>
            </Button>
          ))
        }
      </View>
      <Button
        style={[margin.t15]}
        text="Close"
        onPress={() => close()}
      >
        <H2>Close</H2>
      </Button>
    </View>
  </View>
)

export default SwipeoutOptions
