import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/FontAwesome';
import Camera, { RNCamera } from 'react-native-camera';
import CircleButton from 'rc-mobile-base/lib/components/CircleButton';

import {
  white,
  transparent
} from 'rc-mobile-base/lib/styles';

const FullscreenPhoto = ({ style, cameraStyle, takePhoto, noPhoto }) => {
  return (
    <View style={[styles.container, style]}>
      <RNCamera
        ref={(cam) => {
          this.camera = cam;
        }}
        style={[styles.preview, cameraStyle]}
        // captureQuality={Camera.constants.CaptureQuality.medium}
        // captureTarget={Camera.constants.CaptureTarget.temp}
        // aspect={Camera.constants.Aspect.fill}
        >
      </RNCamera>
      <View style={styles.photoRowOverlay}></View>
      <View style={styles.photoRowOptions}>
        <View style={styles.noOption}></View>
        <View style={styles.takePhoto}>
          <CircleButton radius={36} type={'highlight'} style={styles.cameraButton} onPress={() => takePhoto(this.camera)}>
            <Icon name="camera" size={30} color={'white'}/>
          </CircleButton>
        </View>
        <View style={styles.noPhoto}>
          <TouchableOpacity style={styles.noPhotoBtn} onPress={noPhoto}>
            <Text style={styles.noPhotoText}>{ I18n.t('base.components.fullscreenphoto.no-photo').toUpperCase() }</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height - 99,
    width: Dimensions.get('window').width
  },
  photoRowOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'black',
    opacity: .5
  },
  photoRowOptions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center'
  },
  takePhoto: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noOption: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noPhoto: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  noPhotoBtn: {
    flex: 1,
    paddingRight: 20,
    justifyContent: 'center'
  },
  noPhotoText: {
    color: 'white',
    fontSize: 15,
    backgroundColor: 'transparent',
    fontWeight: '600'
  },
  cameraButton: {
    borderColor: white.color,
    backgroundColor: transparent.color,
    borderWidth: 4,
  },
});

export default FullscreenPhoto;
