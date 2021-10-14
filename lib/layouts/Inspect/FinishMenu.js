import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

const ConfirmDnd = ({ confirmDnd }) => (
  <TouchableOpacity style={styles.confirmDnd} onPress={confirmDnd}>
    <Icon name="check" size={30} color='white' />
    <Text style={{ color: 'white', fontSize: 17, marginLeft: 10 }}>Confirm DND</Text>
  </TouchableOpacity>
)

const FinishMenu = ({ attendantStatus, cancel, confirmDnd, isEnableClear, isReset, reset }) => {

  let message, isDND = false;
  switch(attendantStatus) {
    case "finish":
      message = 'Cancel Finish'; break;
    case "no-check":
      message = 'Cancel No Check'; break;
    case "dnd":
      message = 'Cancel DND'; isDND = true; break;
    case "confirm-dnd":
      message = 'Cancel DND'; isDND = true; break;
    case "refuse":
      message = 'Cancel Refuse'; break;
  }

  return (
    <View style={styles.cancelContainer}>
      <TouchableOpacity style={styles.cancelBtn} onPress={() => isReset ? reset() : cancel()}>
        <Icon name="ban" size={48} color='white' />
        <Text style={{ color: 'white', fontSize: 20, marginTop: 10 }}>{ message }</Text>
      </TouchableOpacity>
      { isDND ?
        <ConfirmDnd confirmDnd={confirmDnd} />
        : null
      }
    </View>
  )
}

const styles = StyleSheet.create({
  cancelContainer: {
    flexDirection: 'column',
    height: 200,
    padding: 4,
    marginTop: 10,
    marginBottom: 10
  },
  cancelBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#C93C46',
    borderRadius: 5
  },
  confirmDnd: {
    backgroundColor: '#416486',
    flexDirection: 'row',
    height: 50,
    marginTop: 4,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default FinishMenu;
