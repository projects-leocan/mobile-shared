import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';

// import Camera, { RNCamera } from 'react-native-camera';
import { RNCamera } from 'react-native-camera';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import I18n from 'react-native-i18n';
import Button from 'rc-mobile-base/lib/components/Button';
import FaIcon from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CircleButton from 'rc-mobile-base/lib/components/CircleButton';

import moment from 'moment';

import { connect } from 'react-redux';

import { getRoomById } from 'rc-mobile-base/lib/selectors/rooms';

import UpdatesActions from 'rc-mobile-base/lib/actions/updates';
import LostFoundActions from 'rc-mobile-base/lib/actions/lost-found';
import * as Colors from 'rc-mobile-base/lib/styles/colors';
import {
  ExtraBackgroundContainer,
  ExtraContainer,
  ExtraCloseButtonContainer,
  ExtraCloseButtonText,
  ExtraItemContainer,
  ExtraItemText,
  ExtraItemImage,
  ExtraPhotoCaptureBackground,
  ExtraPhotoCaptureContainer,
  ExtraPhotoCaptureButton,
  ExtraPhotoCapturedImage,
  ExtraFullContainer,
  ExtraExitContainer,
  FocusImageClose
} from './styles';

const { width, height } = Dimensions.get('window');

class LostFound extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isTakePhoto: false,
    }
  }

  componentWillMount() {
    const { room: { name } } = this.props;
    this.props.navigation.setParams({ title: `Lost Item (${name})` });
  }

  componentWillUnmount() {
    this.props.resetLF();
  }

  toggleCamera = () => {
    const { isTakePhoto } = this.state;
    this.setState({ isTakePhoto: !isTakePhoto })
  }

  _handleSubmitPhoto = () => {
    const { clearPhoto } = this.props;
    // this._handleXButtonPress()
    clearPhoto();
    this.setState({ isTakePhoto: false });
  }

  removeImage = (photoId) => {
    const { clearFromPhotos } = this.props;
    clearFromPhotos(photoId)
  }

  render() {
    const {
      photo,
      photos,
      description,
      submitting,
      submissionError,
    } = this.props;
    const { isTakePhoto } = this.state;
    const disableSubmit = this.disableSubmit();

    if (this.state.isTakePhoto) {
      return (
        <ExtraBackgroundContainer>
          {/* {photo.path ?
            <ExtraPhotoCapturedImage
              height={height}
              width={width}
              source={{ uri: photo.path }}
            />
            : */}
          <RNCamera
            ref={(cam) => {
              this.camera = cam;
            }}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              height: height - 99,
              width: width
            }}
            type={RNCamera.Constants.Type.back}
            useNativeZoom={true}
            flashMode={RNCamera.Constants.FlashMode.auto}
          // aspect={RNCamera.Constants.Aspect.fill}
          />
          {/* } */}

          <ExtraPhotoCaptureBackground />

          <ExtraPhotoCaptureContainer>
            {/* {photo.path ?
              <ExtraPhotoCaptureButton onPress={this._handleSubmitPhoto}>
                <Entypo name="check" size={36} color="white" />
              </ExtraPhotoCaptureButton>
              : */}
              <ExtraPhotoCaptureButton onPress={this._handleTakePicture}>
                <Entypo name="camera" size={36} color="white" />
              </ExtraPhotoCaptureButton>
            {/* } */}
          </ExtraPhotoCaptureContainer>

          {/* {photo.path ?
            <ExtraExitContainer onPress={() => this.props.setPhoto(null)}>
              <Entypo name="cross" size={24} color="black" />
            </ExtraExitContainer>
            : */}
            <ExtraExitContainer onPress={() => this.setState({ isTakePhoto: !isTakePhoto })}>
              <Entypo name="cross" size={24} color="black" />
            </ExtraExitContainer>
          {/* } */}
        </ExtraBackgroundContainer>
      )
    }

    return (
      <View style={styles.outerContainer}>
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          extraScrollHeight={30}
          scrollEnabled={true}
          contentContainerStyle={{ minHeight: '100%' }}
        >
          <View style={{ flex: 1, height: '100%', width: '100%' }}>
            <View style={[styles.listContainer]}>
              {photos.map((item, index) => {
                return (
                  <View style={styles.imageItemContainer}>
                    <View style={styles.cancelItemContainer}>
                      <TouchableOpacity style={styles.centerContainer} onPress={() => this.removeImage(item.photoId)}>
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
              )}
            </View>

            <TouchableOpacity style={styles.addImageButton} onPress={() => this.toggleCamera()}>
              <Entypo name="camera" size={24} color={Colors.slate.color} />
              <Text>{I18n.t('inspector.audits.add-photo')}</Text>
            </TouchableOpacity>
          </View>

          {/* { photo.path ?
          <View style={styles.imageContainer}>
            <Image source={{uri: photo.path}} style={{flex: 1}}/>
            <TouchableOpacity onPress={this._handleXButtonPress} style={styles.xButtonContainer}>
              <Entypo name='cross' size={30} style={styles.xButton} />
            </TouchableOpacity>
          </View>
          :
          <View style={{ flex: 1}}>
            <RNCamera
              ref={ cam => {
                this.camera = cam;
              }}
              style={[styles.preview, { flex: 1 }]}
              // aspect={RNCamera.Constants.Aspect.fill}
              type={RNCamera.Constants.Type.back}>
            </RNCamera>
            <View style={[styles.cameraButtonContainer]}>
              <CircleButton radius={36} type={'highlight'} style={styles.cameraButton} onPress={this._handleTakePicture}>
                <FaIcon name="camera" size={30} color={Colors.white.color}/>
              </CircleButton>
            </View>
          </View>
        } */}

          <View style={[styles.innerContainer, { backgroundColor: 'white' }]}>
            <TextInput
              style={styles.textDesc}
              value={description}
              onChangeText={(text) => this.props.setDescription(text)}
              multiline={false}
              maxLength={200}
              placeholder={I18n.t('attendant.lostfound.index.description')}
              underlineColorAndroid={Colors.transparent.color} />
            <TouchableOpacity disabled={disableSubmit} onPress={this._handleAddLostItem} style={[styles.submitButton, disableSubmit ? styles.submitButtonDisabled : {}]}>
              <Text style={styles.submitButtonText}>{I18n.t('attendant.lostfound.index.submit-found-item')}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    )
  }

  // _handleTakePicture = () => {
  //   const options = {
  //     fixOrientation: false
  //   };

  //   // this.camera.capture()
  //   this.camera.capture(options)
  //     .then((data) => {
  //       const photoId = moment().format('X');
  //       const photoPath = data.path;

  //       // this.props.uploadPhoto(photoPath, photoId);
  //       this.props.setPhoto(photoPath, photoId);


  //     })
  //     .catch(err => console.error(err));
  // }

  _handleTakePicture = async () => {
    const options = {
      fixOrientation: false,
      quality: .5,
      width: 960
    };

    if ((this.camera.status || this.camera.getStatus()) !== 'READY') {
      return;
    }

    // this.camera.capture()
    const photoId = moment().format('X');
    await this.camera.takePictureAsync(options).then(data => {
      const photoPath = data.uri;

      this.props.setPhoto(photoPath, photoId);
      this.props.setPhotos(photoPath, photoId);
    }).then(() => {
      this._handleSubmitPhoto()
    })
      .catch(err => {
        console.log(err);
      });
  }

  _handleXButtonPress = () => {
    const {
      photoId,
      clearPhoto,
      photoRemove,
    } = this.props;

    clearPhoto(photoId);
    photoRemove(photoId);
  }

  _handleAddLostItem = () => {
    const {
      room: { id: roomId, hotelId, roomCalendar },
      photos,
      photoId,
      description,
    } = this.props;
    let guest_name = null;
    if (roomCalendar.length > 0) {
      const { guest_name: Guest_name } = roomCalendar[0];
      guest_name = Guest_name;
    }

    const insertLFPayload = {
      hotelId: hotelId,
      room_id: roomId,
      guest_name: guest_name,
      location: null,
      category: null,
      name_or_description: description,
      image: null,
      user_id: null,
      status: "open",
      pending_message: null,
      notes: null,
      reference: null
    }

    // this.props.addLostItem(description, roomId, photoId);
    this.props.addLostItem(photos, insertLFPayload);
    this.props.navigation.goBack();
  }

  disableSubmit = () => {
    const {
      photo,
      photos,
      photoPath,
      description,
      submitting,
      submissionError,
      uploadingPhoto
    } = this.props;

    if (submitting) return true;
    if (photo.loading) return true;
    // if (!description && !photoPath) return true;
    if(photos.length <= 0) return true;
    
    return false;
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    paddingTop: 0,
  },
  innerContainer: {
    padding: 10,
    height: 125,
    justifyContent: 'space-around',
  },
  imageContainer: {
    flex: 1,
  },
  preview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
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
  xButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.red.color,
    borderRadius: 3,
  },
  xButton: {
    color: 'white',
  },
  textDesc: {
    height: 40,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 14,
  },
  submitButton: {
    borderRadius: 3,
    height: 50,
    backgroundColor: '#61b62d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: Colors.greyDk.color,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 17
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
    justifyContent: 'center',
    backgroundColor:"white",
    borderColor:"lightgray",
    alignItems:"center",
    borderWidth:1
  }
});

const mapStateToProps = (state, props) => {
  const photoId = state.lostFound.photoId;
  const photoPath = state.lostFound.photoPath;
  const photos = state.updates.photos;
  const lfPhotos = state.lostFound.photos;

  let photo = photoId && photos[photoId] ? photos[photoId] : { path: photoPath };
  photo = { ...photo, id: photoId };

  const roomId = props.navigation.state.params.roomId
  return {
    room: getRoomById(roomId)(state),
    photoPath,
    photo,
    photos: lfPhotos,
    ...state.lostFound,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetLF: () => dispatch(LostFoundActions.reset()),
    setPhoto: (path, id) => dispatch(LostFoundActions.setPhoto(path, id)),
    clearPhoto: () => dispatch(LostFoundActions.clearPhoto()),
    setPhotos: (path, id) => dispatch(LostFoundActions.setPhotos(path, id)),
    clearFromPhotos: (photoId) => dispatch(LostFoundActions.clearFromPhotos(photoId)),
    setDescription: (text) => dispatch(LostFoundActions.setDescription(text)),
    uploadPhoto: (path, id) => dispatch(UpdatesActions.photoUpload({ path, id })),
    photoRemove: (id) => dispatch(UpdatesActions.photoRemove(id)),
    addLostItem: (photos, insertLFPayload) => dispatch(UpdatesActions.lostItemAdd(photos, insertLFPayload)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(LostFound);
