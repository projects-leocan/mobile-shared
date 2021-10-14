import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  Image,
  StyleSheet
} from 'react-native';
import I18n from 'react-native-i18n';
import ListView from 'rc-mobile-base/lib/components/ListView';
import { concat } from 'lodash/array';
import { get, extend } from 'lodash/object';

import {
  flx1,
  flxRow,
  blue,
  blueLt,
  padding,
  greyLt,
  slate,
  eitherGrey_100_200,
  white
} from 'rc-mobile-base/lib/styles';

import Avatar from '../../components/Avatar';

const UsersHeader = (type) => (
  <View style={[blueLt.bg]}>
    <Text style={[{ fontSize: 20, fontWeight: 'bold' }, padding.l20, padding.y5, white.text]}>
      {type.toUpperCase()}
    </Text>
  </View>
)

const UserRow = ({ index, data, onPress }) => {
  const { image, name, translation, type, value, isSelected } = data;

  return (
    <TouchableOpacity style={[styles.userRow, eitherGrey_100_200(index % 2 - 1).bg]} onPress={() => onPress(data)}>
      <Avatar
        size={48}
        value={image}
        name={name}
      />
      <View style={styles.userContainer}>
        <Text style={styles.userName}>{ translation ? I18n.t(`base.ubiquitous.${translation}`) : name }</Text>
        { type && false &&
          <Text style={styles.userType}>{ I18n.t(`base.ubiquitous.${type}`) }</Text>
        }
      </View>
      <View style={[flx1]}></View>
    </TouchableOpacity>
  )
}

const UserSelect = ({ options, onPress }) => {
  return (
    <ListView
      data={options}
      renderRow={(data, _, rowId) => <UserRow index={rowId} data={data} onPress={onPress} />}
      renderSectionHeader={UsersHeader}
      getSectionId={(data) => I18n.t(`base.ubiquitous.${get(data, 'type')}`)}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    ...flx1
  },
  userRow: {
    height: 60,
    ...flxRow,
    ...padding.x15,
    alignItems: 'center',
  },
  userContainer: {
    ...padding.l10
  }
});

export default UserSelect;
