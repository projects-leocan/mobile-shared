import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';

import {
  margin,
} from '../../styles';

import H2 from '../../components/H2';

const SectionHeader = ({ value }) => (
  <View style={[margin.t20, margin.b5]}>
    <H2>
      {value}
    </H2>
  </View>
)

export default SectionHeader;
