import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import * as Colors from 'rc-mobile-base/lib/styles/colors';

const CircleButton = (props) => {
  const {
    radius,
    onPress,
    style,
    children,
    type,
    ...otherProps
  } = props;

  const dimensions = {
    height: radius * 2,
    width: radius * 2,
    borderRadius: radius,
  };

  const Button = type === 'opacity' ? TouchableOpacity : TouchableHighlight;

  return (
    <Button onPress={onPress} style={[defaultStyles.container, style, dimensions]} {...otherProps} >
      <View>
        {children}
      </View>
    </Button>
  )
}

// CircleButton.propTypes = {
//   radius: PropTypes.number.isRequired,
//   onPress: PropTypes.func,
//   type: PropTypes.oneOf(['opacity', 'highlight']),
//   style: PropTypes.oneOfType([
//     PropTypes.object,
//     PropTypes.number,
//   ]),
// }

CircleButton.defaultProps = {
  type: 'opacity',
  style: {},
  onPress: () => undefined,
  children: null,
}

const defaultStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white.color,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 20
  },
});

export default CircleButton;
