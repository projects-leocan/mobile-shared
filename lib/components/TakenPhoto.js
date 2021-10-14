import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import CircleButton from './CircleButton';

import * as Colors from 'rc-mobile-base/lib/styles/colors';
import { mergeStyles } from 'rc-mobile-base/lib/utils/styles';

const TakenPhoto = ({ path, handlePress, style }) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: path }}
        style={[styles.preview]}
      />
      <View style={styles.cameraButtonContainer}>
        <CircleButton radius={36} type={'highlight'} style={styles.cameraButton} onPress={handlePress}>
          <Icon name="times" size={30} color={'white'}/>
        </CircleButton>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 240,
    width: 240
  },
  preview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.greyDk.color
  },
  cameraButtonContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  cameraButton: {
    borderColor: Colors.white.color,
    backgroundColor: Colors.transparent.color,
    borderWidth: 4,
  },
});

export default TakenPhoto;
