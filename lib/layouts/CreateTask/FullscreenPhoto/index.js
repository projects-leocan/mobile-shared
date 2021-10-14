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
import { RNCamera } from 'react-native-camera';
import * as Colors from 'rc-mobile-base/lib/styles/colors';

import CircleButton from './CircleButton';

import {
  flx1,
  margin,
  padding,
  lCenterCenter,
  white,
  red,
  blueLt,
  slate
} from 'rc-mobile-base/lib/styles';

class FullscreenPhoto extends Component {
  
  state = {
    isShowCamera: false
  }

  _activateCamera = () => this.setState({ isShowCamera: true })

  render() {
    const { style, cameraStyle, takePhoto, noPhoto } = this.props;
    
    return (
      <View style={[styles.container, style]}>
        { this.state.isShowCamera ?
          <View style={[flx1]}>
            <RNCamera
              ref={(cam) => {
                this.camera = cam;
              }}
              style={[styles.preview, cameraStyle]}
              type={RNCamera.Constants.Type.back}
              // aspect={Camera.constants.Aspect.fill}
              >
            </RNCamera>
            <View style={styles.photoRowOverlay}></View>
            <View style={styles.photoRowOptions}>
              <View style={styles.noOption}></View>
              <View style={styles.takePhoto}>
                <CircleButton radius={36} type={'highlight'} style={styles.cameraButton} onPress={() => takePhoto(this.camera)}>
                  <Icon name="camera" size={30} color={Colors.white.color} />
                </CircleButton>
              </View>
              <View style={styles.noPhoto}>
                <TouchableOpacity style={styles.noPhotoBtn} onPress={noPhoto}>
                  <Text style={styles.noPhotoText}>{ I18n.t('base.ubiquitous.no-photo').toUpperCase() }</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          :
          <View style={[flx1]}>
            <TouchableOpacity style={[flx1, lCenterCenter]} onPress={this._activateCamera}>
              <Icon name="camera" size={64} color={slate.color} />
              <Text style={[slate.text, { opacity: .9 }]}>{ I18n.t('base.ubiquitous.tap-to-start-camera').toUpperCase() }</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.passBtn} onPress={noPhoto}>
              <Text style={styles.passBtnText}>{ I18n.t('base.ubiquitous.continue-without-photo').toUpperCase() }</Text>
            </TouchableOpacity>
          </View>
        }
      </View>
    )
  }
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
    alignItems: 'center',
    // backgroundColor: 'red'
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
    borderColor: Colors.white.color,
    backgroundColor: Colors.transparent.color,
    borderWidth: 4,
    marginBottom: 15
  },
  passBtn: {
    height: 60,
    ...lCenterCenter,
    backgroundColor: 'white'
  },
  passBtnText: {
    ...red.text
  }
});

export default FullscreenPhoto;
