import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

import {
  flxRow,
  flex1,
  margin,
  padding,
  text,
  flexGrow1,
  aic,
  jcc,
  flxCol,
  greyDk,
  grey
} from 'rc-mobile-base/lib/styles';
import FormField from 'rc-mobile-base/lib/components/FormField';

import Picture from '../../components/Picture';

export const UserRow = ({ onPress, user }) => (
  <TouchableOpacity
    onPress={() => onPress(user)}
    style={[flxRow, flex1, aic, padding.a5, grey.bc]}
  >
    <View style={[flxCol, margin.x10]}>
      <Picture
        round
        icon="v-card"
        size={46}
        value={user.image}
      />
    </View>
    <View style={[flxCol]}>
      <Text style={[{fontSize: 15}]}>
        {user.fullName}
      </Text>
      <Text style={[greyDk.text]}>
        {user.username}
      </Text>
    </View>
  </TouchableOpacity>
)

export default UserRow
