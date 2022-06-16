import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  Image,
  ImageBackground,
  Dimensions,
  StyleSheet,
  Modal
} from 'react-native';

import ListView from 'rc-mobile-base/lib/components/ListView';
import Lightbox from 'react-native-lightbox';
import Icon from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Pdf from 'react-native-pdf';
import ImageViewer from 'react-native-image-zoom-viewer';

import { connect } from 'react-redux';
import { getRoomById, getCatalogByRoomId } from 'rc-mobile-base/lib/selectors/rooms';

import {
  Container,
  ImageContainer,
  ImageContent,
  DescriptionContainer,
  DescriptionText,
  PdfContainer,
  PdfContent,
  FocusImageClose,
  PdfFullContainer,
  PdfExitContainer
} from './styles';

import {
  lCenterCenter,
  white,
  slate
} from 'rc-mobile-base/lib/styles';

const GalleryImage = ({ item, handler = () => null }) => (
  <ImageContainer>
    <ImageContent
      onPress={handler}
      >
      <ImageBackground
          style={styles.largeWideImage}
          source={{ uri: item && item.image || '' }}
        >
        <View style={styles.tile}>
          <Text style={styles.title}>{ item.comment }</Text>
        </View>
      </ImageBackground>
    </ImageContent>

    { item.description ?
      <DescriptionContainer>
        <DescriptionText>{ item.description }</DescriptionText>
      </DescriptionContainer>
      : null
    }
  </ImageContainer>
)

const GalleryPdf = ({ item, handler = () => null }) => (
  <PdfContainer>
    <PdfContent onPress={handler}>
      <Icon name={'file-pdf-o'} color={slate.color} size={64} />
      
      <View style={styles.tile}>
        <Text style={styles.title}>{ item.comment }</Text>
      </View>
    </PdfContent>

    { item.description ?
      <DescriptionContainer>
        <DescriptionText>{ item.description }</DescriptionText>
      </DescriptionContainer>
      : null
    }
  </PdfContainer>
)

class GalleryLayout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeImage: null,
      activePdf: null
    }
  }

  static navigationOptions = {
    title: 'Gallery',
  };

  componentWillMount() {
    const { room: { name }} = this.props;
  }

  _handlePress(item) {
    const { activeItem } = this.state;
    this.setState({ activeItem: activeItem === item ? null : item });
  }

  _setActivePdf = (pdf) => this.setState({ activePdf: pdf, activeImage: null })
  _setActiveImage = (image) => this.setState({ activeImage: image, activePdf: null })

  render() {
    const { activePdf, activeImage } = this.state;
    const { catalog } = this.props;

    if (activeImage) {
      return (
        <Modal visible={true} transparent={true}>
          <ImageViewer
            imageUrls={[{ url: activeImage },]}
            enableSwipeDown
            onSwipeDown={() => this.setState({ activeImage: null })}
            renderHeader={() => <FocusImageClose handler={() => this.setState({ activeImage: null })} />}
            renderInd
            />
        </Modal>
      )
    }
    console.log(activePdf)

    if (activePdf) {
      return (
        <PdfFullContainer>
          <Pdf
            style={{ flex: 1 }}
            source={{ uri: activePdf }}
            />
          <PdfExitContainer onPress={() => this._setActivePdf(null)}>
            <Entypo name="cross" size={24} color="black" />
          </PdfExitContainer>
        </PdfFullContainer>
      )
    }

    return (
      <Container>
        { catalog.map(item =>
          item.isPdf ?
          <GalleryPdf
            key={item._id}
            item={item}
            handler={() => this._setActivePdf(item.image)}
            />
          :
          <GalleryImage
            key={item._id}
            item={item}
            handler={() => this._setActiveImage(item.image)}
            />
        )}
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 54,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 10,
    backgroundColor: '#F7F7F7',
  },
  largeWideImage: {
    height: 240
  },
  tile: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 40,
    backgroundColor: 'rgba(0,0,0,.5)',
    ...lCenterCenter
  },
  title: {
    ...white.text,
    fontSize: 17
  }
});

const mapStateToProps = (state, props) => {
  const roomId = props.navigation.state.params.roomId
  // const isAttendant = props.navigation.getParam('isAttendant', false);
  // const isRunner = props.navigation.getParam('isRunner', false);
  // console.log(isAttendant, isRunner);

  return {
    room: getRoomById(roomId)(state),
    catalog: getCatalogByRoomId(roomId)(state)
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(GalleryLayout);
