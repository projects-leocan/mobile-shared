import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

// import Camera, { RNCamera } from 'react-native-camera';
import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/FontAwesome';
import CircleButton from './CircleButton';

import * as Colors from 'rc-mobile-base/lib/styles/colors';
import { mergeStyles } from 'rc-mobile-base/lib/utils/styles';

const TakePhoto = ({ handlePress, style }) => {
  return (
    <View style={styles.container}>
      <RNCamera
        ref={(cam) => {
          this.camera = cam;
        }}
        style={[styles.preview]}
        type={RNCamera.Constants.Type.back}
        // aspect={Camera.constants.Aspect.fill}
        >
      </RNCamera>
      <View style={styles.cameraButtonContainer}>
        <CircleButton radius={36} type={'highlight'} style={styles.cameraButton} onPress={() => { return this.camera.takePictureAsync({ fixOrientation: false, quality: .5 }).then(data => handlePress(data)) }}>
          <Icon name="camera" size={30} color={'white'}/>
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
    alignItems: 'center'
  },
  cameraButtonContainer: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    borderColor: Colors.white.color,
    backgroundColor: Colors.transparent.color,
    borderWidth: 4,
  },
});

export default TakePhoto;
