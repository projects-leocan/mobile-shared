import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { get } from 'lodash/object';
import moment from 'moment';
import { unixPrettyDate } from 'rc-mobile-base/lib/utils/dates';

const GlitchesListItem = ({ glitch, onPress }) => {
  const guestName = get(glitch, 'guestName', null);
  const roomName = get(glitch, 'roomName', '');
  const roomId = get(glitch, 'roomId', null);
  const uuid = get(glitch, 'uuid', null);
  const dateTs = get(glitch, 'createdAt', null);
const glitchId  = get(glitch , 'id' ,null)
  let _handlePress = () => {
    onPress(glitchId, roomId);
  }

  return (
    <TouchableOpacity onPress={_handlePress}>
      <View style={styles.container}>
          <View>
            { roomName ?
              <Text style={styles.roomName}>{roomName}</Text>
              : null
            }
            { guestName ?
              <Text style={styles.guestName}>{guestName}</Text>
              : null
            }
          </View>
          <View>
            <Text>{ moment(dateTs).format("D MMM YYYY") }</Text>
          </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 4,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomName: {
    fontSize: 18,
    marginBottom: 3,
  },
  guestName: {
    color: 'gray',
  }
});

export default GlitchesListItem;
