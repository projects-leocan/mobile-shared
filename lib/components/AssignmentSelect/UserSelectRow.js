import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { get } from 'lodash/object';

import {
  grey,
  greyDk,
  grey400,
  slate,
  white
} from 'rc-mobile-base/lib/styles';

const UserSelectRow = ({ onPress, user, isSelected, index, style }) => {
  const extraStyle = index === 0 ? { borderTopWidth: 1 } : null;
  const displayImage = user && user.image ?
    <Image style={styles.userImage} source={{ uri: user.image || '' }} resizeMethod='resize' /> :
    <View style={styles.userImage}>
      <Text style={styles.userImageText}>{ get(user, ['first_name', 0], '').toUpperCase() }</Text>
    </View>

  return (
    <TouchableOpacity style={[styles.container, extraStyle, style]} onPress={() => onPress(user._id)}>
      { displayImage }
      <View style={styles.userInfoContainer}>
        <Text style={styles.userName}>{ `${user.first_name} ${user.last_name}` }</Text>
        {/* <Text style={styles.userPosition}>Text</Text> */}
      </View>
      <View style={styles.selectedContainer}>
        { isSelected ?
          <Icon name="check-square-o" size={24} color="royalblue" />
          : null
        }
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 5,
    paddingBottom: 5,
    // borderTopWidth: 1,
    borderBottomWidth: 1,
    backgroundColor: '#F7F7F7',
    borderColor: 'lightgray'
  },
  userImage: {
    height: 48,
    width: 48,
    borderRadius: 24,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    ...grey400.bg
  },
  userImageText: {
    fontSize: 24,
    // fontWeight: '500',
    ...slate.text
  },
  userInfoContainer: {
    paddingLeft: 10
  },
  userName: {
    color: '#4a4a4a'
  },
  userPosition: {

  },
  selectedContainer: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 10
  }
});

export default UserSelectRow;
