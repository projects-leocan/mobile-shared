import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Image,
  FlatList
} from 'react-native';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import Camera, { RNCamera } from 'react-native-camera';
import { RNCamera } from 'react-native-camera';

import * as Colors from 'rc-mobile-base/lib/styles/colors';

import CircleButton from './CircleButton';
import VideoComponent from 'rc-mobile-base/lib/components/VideoComponent';

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

const { width, height } = Dimensions.get('window');

class FullscreenPhoto extends Component {

  state = {
    isShowCamera: false,
    isCaptureModeImage: null,
  }

  toggleCamera = (isCaptureModeImage) => {
    const { toggleCamera } = this.props;
    this.setState({ isCaptureModeImage: isCaptureModeImage, isShowCamera: true });
    toggleCamera(isCaptureModeImage)
  }

  _activateCamera = () => {
    const { isCaptureModeImage } = this.state;
    if (isCaptureModeImage) {
      this.toggleCamera(isCaptureModeImage)
    } else {
      Alert.alert(
        'Please choose option',
        'Continue with image or video', // <- this part is optional, you can pass an empty string
        [
          { text: 'IMAGE', onPress: () => this.toggleCamera(true) },
          { text: 'VIDEO', onPress: () => this.toggleCamera(false) },
        ],
        { cancelable: false },
      );
    }
  }

  renderTakenImages = (item, index) => {
    const { removeImage } = this.props;
    return (
      <View style={styles.imageItemContainer}>
        <View style={styles.cancelItemContainer}>
          <TouchableOpacity style={styles.centerContainer} onPress={() => removeImage(item.photoId)}>
            <Ionicons name="close" size={30} color={Colors.red.color} style={{ alignSelf: 'center' }} />
          </TouchableOpacity>
        </View>
        <Image
          source={{ uri: item.photoPath }}
          style={styles.itemImage}
        />
      </View>
    )
  }

  resetState = () => {
    const { toggleCamera } = this.props;
    this.setState({
      isShowCamera: false,
      isCaptureModeImage: null,
    })
    toggleCamera(null)
    // this.toggleCamera(null)
  }

  confirmImageArray = () => {
    const { confirmImageArray } = this.props;
    confirmImageArray();
    setTimeout(() => {
      this.resetState()
    }, 500);
  }

  confirmSelectVideo = () => {
    const { selectVideo } = this.props;
    selectVideo();
    setTimeout(() => {
      this.resetState()
    }, 500);
  }

  onNoPhoto = () => {
    const { noPhoto, isStartRecording } = this.props;
    if(isStartRecording) {
      return;
    }
    noPhoto();
    this.resetState()
  }

  onTakePicture = (camera) => {
    const { takePhoto } = this.props;
    takePhoto(camera, (val) => {
      if(val) {
        this.setState({ isShowCamera: false })
      }
  });
  }

  render() {
    const isShowTakenVideo = true;
    const { isCaptureModeImage } = this.state;
    const { style, cameraStyle, takePhoto, noPhoto, isStartRecording, handleStartTakeVideo,
      handleStopTakeVideo, taskImages, confirmImageArray, recordPath, isVideoRecorded, closeVideo, selectVideo } = this.props;

    if (isVideoRecorded) {
      return (
        <View style={styles.centerContainer}>
          <VideoComponent
            videoSource={recordPath}
            closeVideo={closeVideo}
            selectVideo={this.confirmSelectVideo} />
        </View>
      )
    }

    return (
      <View style={[styles.container, style]}>
        {this.state.isShowCamera ?
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
                {isCaptureModeImage
                  &&
                  <CircleButton radius={36} type={'highlight'} style={styles.cameraButton} onPress={() => {
                    this.onTakePicture(this.camera)
                  }}>
                    <Icon name="camera" size={30} color={Colors.white.color} />
                  </CircleButton>
                }

                {!isCaptureModeImage
                  &&
                  <View style={styles.recordButtonOuterContainer}>
                    <TouchableOpacity style={isStartRecording ? styles.recordButtonStopInnerContainer : styles.recordButtonInnerContainer}
                      onPress={() => isStartRecording ? handleStopTakeVideo(this.camera) : handleStartTakeVideo(this.camera)}>
                    </TouchableOpacity>
                  </View>
                }

              </View>
              <View style={styles.noPhoto}>
                <TouchableOpacity style={styles.noPhotoBtn} onPress={() => this.onNoPhoto()}>
                  <Text style={styles.noPhotoText}>{I18n.t('base.ubiquitous.no-photo').toUpperCase()}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          :
          <View style={[flx1]}>
            {/* <TouchableOpacity style={[flx1, lCenterCenter]} onPress={this._activateCamera}>
              <Icon name="camera" size={64} color={slate.color} />
              <Text style={[slate.text, { opacity: .9 }]}>{I18n.t('base.ubiquitous.tap-to-start-camera').toUpperCase()}</Text>
            </TouchableOpacity> */}
            <View style={{ flex: 1, height: '100%', width: '100%' }}>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <FlatList
                  data={taskImages}
                  numColumns={2}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => this.renderTakenImages(item, index)}
                />
              </View>

              {isCaptureModeImage
                ?
                <View style={[styles.listContainer, { flex: 0 }]}>
                  <TouchableOpacity style={styles.imageItemContainer} onPress={() => this._activateCamera()}>
                    <Entypo name="camera" size={24} color={Colors.slate.color} />
                    <Text>{I18n.t('inspector.audits.add-photo')}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.imageItemContainer} onPress={() => this.confirmImageArray()}>
                    <Ionicons name="checkmark-circle-outline" size={30} color={Colors.green.color} style={{ alignSelf: 'center' }} />
                    <Text>Done</Text>
                  </TouchableOpacity>
                </View>
                :
                <TouchableOpacity style={styles.addImageButton} onPress={() => this._activateCamera()}>
                  <Entypo name="camera" size={24} color={Colors.slate.color} />
                  {/* <Text>{I18n.t('inspector.audits.add-photo')}</Text> */}
                  <Text>add Assetes</Text>
                </TouchableOpacity>
              }

            </View>
            <TouchableOpacity style={styles.passBtn} onPress={noPhoto}>
              <Text style={styles.passBtnText}>{I18n.t('base.ubiquitous.continue-without-photo').toUpperCase()}</Text>
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
  },
  recordButtonOuterContainer: {
    height: 70,
    width: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: Colors.white.color,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  recordButtonInnerContainer: {
    height: 70,
    width: 70,
    borderRadius: 35,
    backgroundColor: Colors.red.color,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  recordButtonStopInnerContainer: {
    height: 30,
    width: 30,
    borderRadius: 8,
    backgroundColor: Colors.red.color,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  addImageButton: {
    height: 120,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: Colors.grey400.color
  },
  listContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  imageItemContainer: {
    // height: 120,
    height: (width / 2) - 32,
    width: (width / 2) - 24,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: Colors.grey400.color
  },
  itemImage: {
    height: '100%',
    width: '100%',
  },
  cancelItemContainer: {
    height: 30,
    width: 30,
    top: 8,
    right: 8,
    position: 'absolute',
    zIndex: 2
  },
  centerContainer: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center'
  }
});

export default FullscreenPhoto;
