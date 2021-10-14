import React from 'react';

import {
  MiceText
} from './styles';

import {

} from 'rc-mobile-base/lib/styles';

export default Mice = ({ color, label = "Mice", style }) => (
  <MiceText style={[style]} color={color}>{ label.toUpperCase() }</MiceText>
)