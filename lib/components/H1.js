import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';

import { margin, text } from '../styles';
import { mergeStyles } from '../utils/styles';

import { childrenToText } from '../utils/children-to-text';

export const H1 = ({ style, children, ...props }) => (
  <Text
    style={mergeStyles([margin.y5, text.b1], style)}
    {...props}
  >
    {childrenToText(children)}
  </Text>
);

H1.propsTypes = {
  children: PropTypes.string
};

export default H1;
