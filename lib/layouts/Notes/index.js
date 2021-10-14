import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal
} from 'react-native';

import I18n from 'react-native-i18n'
import Icon from 'react-native-vector-icons/FontAwesome';
import ImageViewer from 'react-native-image-zoom-viewer';

import { connect } from 'react-redux';
import Button from 'rc-mobile-base/lib/components/Button';
import LongButton from 'rc-mobile-base/lib/components/LongButton';
import FullscreenPhoto from 'rc-mobile-base/lib/components/FullscreenPhoto';

import { get } from 'lodash/object';

import UpdatesActions from 'rc-mobile-base/lib/actions/updates';

import { getRoomById } from 'rc-mobile-base/lib/selectors/rooms';
import { computedIndexedUsers } from 'rc-mobile-base/lib/selectors/users';

import RoomNoteRow from './RoomNoteRow';

import {
  flxRow,
  margin,
  slate,
  grey400
} from 'rc-mobile-base/lib/styles';

import {
  NewNoteContainer,
  NewNoteInput,
  NewNotePhotoButton,
  NewPhotoPlaceholderContainer,
  NewPhotoPlaceholder,
  NewPhotoXContainer,
  FocusImageClose
} from './styles';

const PhotoPlacerholder = ({ source, handler = () => null }) => (
  <NewPhotoPlaceholderContainer onPress={handler}>
    <NewPhotoPlaceholder
      source={{ uri: source }}
      />
    
    <NewPhotoXContainer>
      <Icon name="times" color="red" size={12} />
    </NewPhotoXContainer>
  </NewPhotoPlaceholderContainer>
)

class NotesLayout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newNote: null,
      newPhoto: null,
      isTakePhoto: false,
      activePhoto: null
    }
  }

  static navigationOptions = {
    title: 'Notes',
  };

  componentWillMount() {
    const { room: { name }} = this.props;
  }

  _handleAddNote = () => {
    const { room: { _id: roomId } } = this.props;
    const { newNote, newPhoto } = this.state;

    this.props.addNote(roomId, newNote, newPhoto);

    this.setState({ newNote: '' });
  }

  _handleRemoveNote = (noteId) => {
    const { room: { _id: roomId } } = this.props;

    this.props.removeNote(roomId, noteId);
  }

  disableSubmit = () => {
    const { newNote } = this.state;

    if (!newNote) {
      return true;
    }

    return false;
  }

  _togglePhoto = () => this.setState({ isTakePhoto: !this.state.isTakePhoto })
  _resetPhoto = () => this.setState({ newPhoto: null, isTakePhoto: false })

  _handleTakePhoto = async (camera) => {    
    if ((camera.status || camera.getStatus()) !== 'READY') {
      console.log('Camera not valid');
      return;
    }

    const data = await camera.takePictureAsync({ quality: .7 });
    this.setState({ isTakePhoto: false, newPhoto: data.uri });
  }

  _setActivePhoto = (photo) => this.setState({ activePhoto: photo })

  render() {
    const { indexedUsers, room: { roomNotes } } = this.props;
    const { isTakePhoto, newPhoto, activePhoto } = this.state;
    const noteRows = roomNotes.map(note => <RoomNoteRow
      key={note.id}
      note={note}
      user={get(indexedUsers, note.user_id, {})}
      setPhoto={this._setActivePhoto}
      removeNote={this._handleRemoveNote} />
    );
    const disableSubmit = this.disableSubmit();

    if (activePhoto) {
      console.log(activePhoto)
      return (
        <Modal visible={true} transparent={true}>
          <ImageViewer
            imageUrls={[{ url: activePhoto },]}
            enableSwipeDown
            onSwipeDown={() => this.setState({ activePhoto: null })}
            renderHeader={() => <FocusImageClose handler={() => this.setState({ activePhoto: null })} />}
            renderIndicator={() => null}
            />
        </Modal>
      )
    }
    
    if (isTakePhoto) {
      return (
        <FullscreenPhoto
          takePhoto={this._handleTakePhoto}
          noPhoto={this._resetPhoto}
          />
      )
    }

    return (
      <ScrollView style={styles.container}>
        { this.props.screenProps.isAttendantApp && this.props.config.isDisableAttendantCreateNotes ?
          null :
          <View>
            <Text style={[styles.fieldLabel, margin.t5]}>{ I18n.t('attendant.notes.index.new-room-note') }</Text>
            
            <NewNoteContainer>
              <NewNoteInput
                onChangeText={(t) => this.setState({ newNote: t })}
                value={this.state.newNote}
                multiline={true}
                maxLength={200}
                placeholderTextColor="#ccc"
                placeholder={I18n.t('attendant.notes.index.new-note-placeholder')} />

              { newPhoto ?
                <PhotoPlacerholder
                  source={newPhoto}
                  handler={this._resetPhoto}
                  />
                :
                <NewNotePhotoButton onPress={this._togglePhoto}>
                  <Icon name="camera" size={24} color={slate.color} />
                </NewNotePhotoButton>
              }
            </NewNoteContainer>
              
            <Button
              disabled={disableSubmit}
              style={[{ backgroundColor: '#44A454', height: 44, borderRadius: 4, marginBottom: 3, marginTop: 5 }, disableSubmit && grey400.bg]}
              onPress={this._handleAddNote}>
              <Text style={{ color: 'white', fontWeight: '600' }}>{ I18n.t('attendant.notes.index.add-note').toUpperCase() }</Text>
            </Button>
          </View>
        }

        { roomNotes && roomNotes.length ?
          <Text style={[styles.fieldLabel, { marginTop: 15, marginBottom: 5 }]}>{ I18n.t('attendant.notes.index.previous-notes').toUpperCase() }</Text>
          : null
        }
        { noteRows }
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    backgroundColor: '#F0F0F0'
  },
  fieldLabel: {
    fontWeight: '600',
    color: '#4A4A4A',
    fontSize: 14,
    marginTop: 5
  },
  textArea: {
    height: 80,
    borderColor: '#DDDDDD',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 5,
    fontSize: 14
  },
  messageContainer: {
    marginTop: 10,
    marginBottom: 10
  },
  messageInput: {
    height: 80,
    borderColor: '#C2C2C2',
    borderWidth: 1,
    borderRadius: 3
  },
  messageSubmit: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'royalblue',
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 3
  },
  messageSubmitText: {
    color: 'white',
    fontSize: 17
  }
});

const mapStateToProps = (state, props) => {
  const roomId = props.navigation.state.params.roomId
  return {
    config: get(state, 'auth.config') || {},
    room: getRoomById(roomId)(state),
    indexedUsers: computedIndexedUsers(state)
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    addNote: (roomId, note, photo) => dispatch(UpdatesActions.roomNoteAdd({ roomId, note, photo })),
    removeNote: (roomId, noteId) => dispatch(UpdatesActions.roomNoteRemove({ roomId, noteId })),
    dispatch
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(NotesLayout);
