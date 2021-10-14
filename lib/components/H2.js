import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';

import { greyDk, text } from 'rc-mobile-base/lib/styles';
import { mergeStyles } from 'rc-mobile-base/lib/utils/styles';

import { childrenToText } from '../utils/children-to-text';

export const H2 = ({ style, children, ...props }) => (
  <Text
    style={mergeStyles([greyDk.text, text.b2], style)}
    {...props}
  >
    {childrenToText(children || '')}
  </Text>
);

H2.propsTypes = {
  children: PropTypes.string
};

export default H2;
