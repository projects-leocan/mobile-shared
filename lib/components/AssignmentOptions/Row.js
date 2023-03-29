import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { get } from 'lodash/object';

import { CheckBoxContainer, Name } from 'rc-mobile-base/lib/layouts/CreateTask/AssignmentSelect/styles';

import {
  flxRow,
  eitherGrey_100_200,
  grey400,
  padding,
  blueLt,
  flx1,
  margin,
  aic,
  jcc,
  lCenterCenter,
  slate,
  splashBg
} from 'rc-mobile-base/lib/styles';

const Row = ({ user, index, handleSelect }) => (
  <TouchableOpacity style={[flxRow, aic, padding.x20, { height: 50 }, eitherGrey_100_200(index % 2 - 1).bg]} onPress={() => handleSelect(user.value , user)}>
    <CheckBoxContainer>
      <Ionicons
        name={user.isSelected ? 'ios-checkbox' : 'ios-square-outline'}
        size={30}
        color={splashBg.color}
      />
    </CheckBoxContainer>
    <Name>{user.name}</Name>
  </TouchableOpacity>
);

export default Row;