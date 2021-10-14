import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
// import Swipeout from 'react-native-swipeout'

import moment from 'moment';

import {
  NoteContainer,
  NoteUserImage,
  NoteContentContainer,
  NoteUserTimeText,
  NoteNoteText,
  NoteNoteImageContainer,
  NoteNoteImage
} from './styles';

class RoomNoteRow extends Component {

  render() {
    const { id, image, user_first_name, user_last_name, note, date_ts } = this.props.note;
    const { user, removeNote, setPhoto } = this.props;

    return (
      <NoteContainer>
        <NoteUserImage
          source={{ uri: user.image }}
          />

        <NoteContentContainer>
          <NoteNoteText>{ note }</NoteNoteText>
          <NoteUserTimeText>{ `${user_first_name} ${user_last_name} · ${moment.unix(date_ts).format('lll')}` }</NoteUserTimeText>
        </NoteContentContainer>

        { image ?
          <NoteNoteImageContainer onPress={() => setPhoto(image)}>
            <NoteNoteImage
              source={{ uri: image }}
              />
          </NoteNoteImageContainer>
          : null
        }
      </NoteContainer>
    )
  }
}

export default RoomNoteRow;
