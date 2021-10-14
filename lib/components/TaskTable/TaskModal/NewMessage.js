import React, { Component } from 'react';
import {
  Text,
  TextInput,
  Image,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import I18n from 'react-native-i18n';
import { get } from 'lodash/object';

import {
  padding,
  margin,
  slate,
  grey100,
  grey200,
  grey400,
  lCenterCenter,
  blueLt
} from 'rc-mobile-base/lib/styles';

const NewMessage = ({ user, value, updateInput, onPress }) => {
  return (
    <View style={styles.container}>
      { user.image ?
        <Image
          source={{ uri: get(user, 'thumbnail') || get(user, 'image', '') }}
          style={{ height: 40, width: 40, borderRadius: 20, ...margin.r10 }}
          />
        :
        <View style={[{ height: 40, width: 40, borderRadius: 20, ...lCenterCenter }, margin.r10, grey400.bg]}>
          <Text style={[slate.text, { fontSize: 20 }]}>{ get(user, ['first_name', 0], '').toUpperCase() }</Text>
        </View>
      }
      <TextInput
        placeholder={I18n.t('base.ubiquitous.enter-a-message')}
        style={styles.inputStyle}
        value={value}
        onChangeText={updateInput}
        />
      <TouchableOpacity style={styles.submitContainer} onPress={onPress}>
        <Icon name="paper-plane" color={blueLt.color} size={24} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // borderColor: grey200.color,
    // borderWidth: 1,
    flexDirection: 'row',
    height: 60,
    // ...padding.x10,
    // paddingTop: 8
  },
  inputStyle: {
    flex: 1,
    borderColor: grey100.color,
    borderWidth: 1,
    height: 44,
    ...padding.x5,
    borderRadius: 2,
    fontSize: 15
  },
  submitContainer: {
    width: 60,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default NewMessage;
