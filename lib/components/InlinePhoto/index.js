import React from 'react';
import { Modal, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import FullscreenPhoto from 'rc-mobile-base/lib/components/FullscreenPhoto';

import {
  slate,
  blueLt
} from 'rc-mobile-base/lib/styles';

import {
  Button,
  ButtonLabel,
  Picture
} from './styles';

import { getIconSize } from './styles';

export default class InlinePhoto extends React.Component {
  
  state = {
    isTakePhoto: false,
    photoPath: null,
  }

  _handleCancelPhoto = () => this.setState({ isTakePhoto: false })
  _handleTakePhoto = async (camera) => {
    const { photos } = this.state;
    
    if ((camera.status || camera.getStatus()) !== 'READY') {
      console.log('Camera not valid');
      return;
    }

    const data = await camera.takePictureAsync({ quality: .7 });
    this.setState({ isTakePhoto: false, photoPath: data.uri });
    this.props.onPhoto && this.props.onPhoto(data.uri);

    // camera.capture()
    //   .then((data) => {
    //     this.setState({ isTakePhoto: false, photoPath: data.path });
    //     this.props.onPhoto && this.props.onPhoto(data.path);
    //   })
    //   .catch(err => console.error(err));
  }

  _handleRemovePhoto = () => {
    this.setState({ photoPath: null });
    this.props.onPhoto && this.props.onPhoto(null);
  }
  
  render() {
    const { label, style, photoUrl } = this.props;
    const { isTakePhoto, photoPath } = this.state;

    return (
      <View style={style}>
        { photoPath || photoUrl ?
          <Picture
            source={{ uri: photoPath || photoUrl }}
            >
            <Icon.Button
              name="times"
              size={24}
              backgroundColor="transparent"
              color="white"
              onPress={this._handleRemovePhoto}
              />
          </Picture>
          :
          <Button onPress={() => this.setState({ isTakePhoto: true })}>
            <Icon name="camera" size={getIconSize('sm')} color={blueLt.color} />
            { label &&
              <ButtonLabel>{ label.toUpperCase() }</ButtonLabel>
            }
          </Button>
        }
        
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={isTakePhoto}
          onRequestClose={this._handleCancelPhoto}
          >
          <FullscreenPhoto
            cameraStyle={null}
            takePhoto={this._handleTakePhoto}
            noPhoto={this._handleCancelPhoto}
            />
        </Modal>
      </View>
    )
  }
}