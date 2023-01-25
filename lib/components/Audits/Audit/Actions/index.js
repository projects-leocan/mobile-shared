import React from 'react';
import { View, Modal, Text, Platform } from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import Camera, { RNCamera } from 'react-native-camera';
import { RNCamera } from 'react-native-camera';
import SignatureCapture from 'react-native-signature-capture';
import SignatureScreen from "react-native-signature-canvas";
import { isTablet } from 'react-native-device-info';
import AntDesignIcons from "react-native-vector-icons/AntDesign"

import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';

import {
  Actions,
  ActionWrapper,
  ActionText,
  ModalBackdrop,
  ModalWrapper,
  ModalHeader,
  ModalContent,
  ModalInput,
  ModalActions,
  ModalButton,
  ModalLink,
  ModalSubmit,
  ModalCancel,
  ModalPhoto,
  ModalCapture,
  ModalPreview,
  Thumb,
  SignatureIconContainer,
  SignatureIcon,
  SignatureContent,
  SignatureModalWrapper,
  SignatureText,
  ModalHeaderSignature
} from './styles';

import digitalSignature from 'rc-mobile-base/lib/images/icons/digital-signature.png';
import _ from 'lodash';

const style = `.m-signature-pad { margin: 12px;  } .m-signature-pad--body {border: none;} `;


class Note extends React.Component {
  state = {
    isOpen: false,
    value: this.props.value
  }

  handleOpen = () => !this.props.readOnly && this.setState({ isOpen: !this.state.isOpen, value: null })
  handleChange = (value) => this.setState({ value })

  render() {
    const {
      onChange,
      active,
      noteText,
      addNoteText,
      saveText,
      cancelText,
      ...props
    } = this.props
    return (
      <View>
        <ActionWrapper
          {...props}
          onPress={this.handleOpen}
          style={{ marginRight: 5 }}
        >
          <FontAwesome
            name="file-text-o"
            size={24}
            color={active ? '#222222' : '#B4B4B4'}
          />
          <ActionText active={active}>
            {noteText}
          </ActionText>
        </ActionWrapper>
        <Modal
          transparent
          animationType={"fade"}
          visible={this.state.isOpen}
          onRequestClose={() => this.setState({ isOpen: false })}
        >
          <ModalBackdrop>
            <ModalWrapper>
              <ModalHeader>{addNoteText}</ModalHeader>
              <ModalContent>
                <ModalInput
                  multiline={true}
                  numberOfLines={4}
                  placeholder="Start typing to add a note..."
                  onChangeText={this.handleChange}
                  value={this.state.value}
                />
                <ModalActions>
                  <ModalButton onPress={() => {
                    onChange(this.state.value)
                    this.handleOpen()
                  }}>
                    <ModalSubmit>
                      {saveText}
                    </ModalSubmit>
                  </ModalButton>
                  <ModalLink onPress={this.handleOpen}>
                    <ModalCancel>
                      {cancelText}
                    </ModalCancel>
                  </ModalLink>
                </ModalActions>
              </ModalContent>
            </ModalWrapper>
          </ModalBackdrop>
        </Modal>
      </View>
    )
  }
}

Note.defaultProps = {
  noteText: 'Note',
  addNoteText: 'Add a note',
  saveText: 'Save',
  cancelText: 'Cancel',
}

class Photo extends React.PureComponent {
  state = {
    isOpen: false,
    value: this.props.value,
  }

  handleOpen = () => {
    !this.props.readOnly && this.setState({ isOpen: !this.state.isOpen })
  }

  handleChange = (value) => this.setState({ value })
  takePhoto = async () => {
    try {
      const options = {
        fixOrientation: false,
        quality: .5,
        width: 960
      };

      if ((this.camera.status || this.camera.getStatus()) !== 'READY') {
        console.log('Camera not valid');
        return;
      }

      const data = await this.camera.takePictureAsync(options);
      const photoPath = data.uri;
      console.log(photoPath)
      this.handleChange(photoPath)
    } catch (error) {
      console.log(error)
    }
  }

  clearDefaultPhoto = () => {
    this.setState({ value: null })
    this.props.onClearValue('photo')
  }

  render() {
    const {
      onChange,
      active,
      photo,
      photoText,
      addPhotoText,
      saveText,
      cancelText,
      clearText,
      ...props
    } = this.props
    const isPad = isTablet()

    return (
      <View>
        <ActionWrapper
          {...props}
          onPress={this.handleOpen}
          isTablet={isPad}
        >
          {
            photo ? (
              <Thumb source={{ uri: photo }} />
            ) : (
              <SignatureIconContainer>
              <FontAwesome
                name="camera"
                size={24}
                color={active ? '#2185D0' : '#B4B4B4'}
              />
              </SignatureIconContainer>
            )
          }
          <ActionText active={active}>
            {photoText}
          </ActionText>
        </ActionWrapper>
        <Modal
          transparent
          animationType={"fade"}
          visible={this.state.isOpen}
          onRequestClose={() => this.setState({ isOpen: false })}
        >
          <ModalBackdrop>
            <ModalPhoto>
            <ModalHeaderSignature>
                <SignatureText>
                {addPhotoText}
                </SignatureText>
                <AntDesignIcons 
                    style={{position:"absolute" , right:0 , paddingTop:12 , paddingRight:10}}
                    name='close'
                    size={28} color="#fff" 
                    onPress={this.handleOpen}
                     />
                </ModalHeaderSignature>
              <ModalContent>
                {
                  this.state.value ? (
                    <ModalPreview
                      source={{ uri: this.state.value }}
                    />
                  ) : (
                    <RNCamera
                      style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}
                      ref={cam => {
                        this.camera = cam;
                      }}
                    // aspect={Camera.constants.Aspect.fill}
                    // captureTarget={Camera.constants.CaptureTarget.temp}
                    >
                      <ModalCapture onPress={this.takePhoto}>
                        <FontAwesome name="camera" size={20} />
                      </ModalCapture>
                    </RNCamera>
                  )
                }
                <ModalActions>
                  <ModalButton
                    disabled={!this.state.value}
                    onPress={() => {
                      onChange(this.state.value)
                      this.handleOpen()
                    }}>
                    <ModalSubmit>
                      {saveText}
                    </ModalSubmit>
                  </ModalButton>
                  <ModalLink onPress={this.clearDefaultPhoto} style={{ position: "absolute", right: 0 }}>
                    <ModalCancel>
                      {clearText}
                    </ModalCancel>
                  </ModalLink>
                </ModalActions>
              </ModalContent>
            </ModalPhoto>
          </ModalBackdrop>
        </Modal>
      </View>
    )
  }
}

Photo.defaultProps = {
  photoText: 'Photo',
  addPhotoText: 'Add a photo',
  saveText: 'Save',
  cancelText: 'Cancel',
  clearText: "Clear"
}

class Signature extends React.Component {
  state = {
    isOpen: false,
    value: this.props.value
  }

  handleOpen = () => !this.props.readOnly && this.setState({ isOpen: !this.state.isOpen })
  handleChange = (value) => this.setState({ value })

  handleSignature(signature, onChange, handleOpen, handleChange) {
    console.log(signature);
    const dirs = Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath : RNFS.ExternalDirectoryPath; // 外部文件，共享目录的绝对路径（仅限android）
    const downloadDest = `${dirs}/${((Math.random() * 10000000) | 0)}.png`;
    const imageDatas = signature.split('data:image/png;base64,');
    const imageData = imageDatas[1];

    RNFetchBlob.fs.writeFile(downloadDest, imageData, 'base64').then((rst) => {
      console.log('writeFile', downloadDest)
      try {
        onChange(downloadDest)
        handleChange(downloadDest)
        handleOpen()
      } catch (e3) {
        // Alert.alert(JSON.stringify(e3))
        console.log('catch', e3)
      }
    });
  }

  handleEmpty() {
    this.handleOpen()
  }

  clearDefaultPhoto = () => {
    this.setState({ value: null })
    this.props.onClearValue('note')
  }

  render() {
    const {
      onChange,
      active,
      signatureText,
      addSignatureText,
      saveText,
      cancelText,
      clearText,
      ...props
    } = this.props
    const isPad = isTablet()
    return (
      <View>
        <ActionWrapper
          {...props}
          onPress={this.handleOpen}
          style={{ marginRight: 5, flex: 1 }}
        >
          {/* <MaterialCommunityIcons
             name="file-sign"
             size={24}
             color={active ? '#222222' : '#B4B4B4'}
           /> */}
          <SignatureIconContainer>
            {/* <SignatureScreen onOK={this.handleSignature} onEmpty={this.handleEmpty} autoClear={true} /> */}
            <SignatureIcon source={digitalSignature} style={{ tintColor: active ? '#2185D0' : '#B4B4B4' }} />
          </SignatureIconContainer>
          <ActionText active={active}>
            {signatureText}
          </ActionText>
        </ActionWrapper>
        <Modal
          transparent
          animationType={"fade"}
          visible={this.state.isOpen}
          onRequestClose={() => this.setState({ isOpen: false })}
        >
          <ModalBackdrop>
            <SignatureModalWrapper>
              <ModalHeaderSignature>
                <SignatureText>
                {addSignatureText}
                </SignatureText>
                <AntDesignIcons 
                    style={{position:"absolute" , right:0 , paddingTop:12 , paddingRight:10}}
                    name='close'
                    size={28} color="#fff" 
                    onPress={this.handleOpen}
                     />
                </ModalHeaderSignature>
              <ModalContent isTablet={isPad}>
                <SignatureContent>
                  {
                    this.state.value ? (
                      <>
                        <ModalPreview
                          source={{ uri: this.state.value }}
                        />
                        <ModalActions>
                          <ModalButton
                            disabled={true}
                          >
                            <ModalSubmit>
                              {saveText}
                            </ModalSubmit>
                          </ModalButton>
                          <ModalLink  style={{ position: "absolute", right: 0 }} onPress={this.clearDefaultPhoto}>
                            <ModalCancel>
                              {clearText}
                            </ModalCancel>
                          </ModalLink>
                        </ModalActions>
                      </>
                    ) : (
                      <SignatureScreen
                        onOK={(signature) => this.handleSignature(signature, onChange, this.handleOpen, this.handleChange)}
                        onClear={this.clearDefaultPhoto}
                        autoClear={false}
                        clearText={clearText}
                        confirmText={saveText}
                        imageType="image/png"
                        webStyle={style}
                      />
                    )}
                </SignatureContent>
                {/* <ModalActions>
                  <ModalButton onPress={() => {
                    onChange(this.state.value)
                    this.handleOpen()
                  }}>
                    <ModalSubmit>
                      {saveText}
                    </ModalSubmit>
                  </ModalButton>
                  <ModalLink onPress={this.handleOpen}>
                    <ModalCancel>
                      {cancelText}
                    </ModalCancel>
                  </ModalLink>
                </ModalActions> */}
              </ModalContent>
            </SignatureModalWrapper>
          </ModalBackdrop>
        </Modal>
      </View>
    )
  }
}

Signature.defaultProps = {
  signatureText: 'Signature',
  addSignatureText: 'Add a signature',
  saveText: 'Save',
  cancelText: 'Cancel',
  clearText: "Clear"
}

Actions.Note = Note
Actions.Photo = Photo
Actions.Signature = Signature

export default Actions
