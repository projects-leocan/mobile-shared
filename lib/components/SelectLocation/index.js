import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  Modal,
  TouchableOpacity,
  SectionList,
  StyleSheet
} from 'react-native';
import { get, keys } from 'lodash/object';
import { groupBy, map } from 'lodash/collection';
import ListView from 'rc-mobile-base/lib/components/ListView';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  margin,
  padding,
  eitherGrey_100_200,
  eitherGreyRed,
  greyDk,
  blueLt,
  slate,
  lCenterCenter,
  white,
  flex1,
  flexGrow1,
} from 'rc-mobile-base/lib/styles';

import ModalHeader from '../ModalHeader';
import ExitButton from './ExitButton';

const SelectableLocation = ({ data, index, onPress }) => {
  const { name, isSelected } = data;

  return (
    <TouchableOpacity style={[styles.selectionRow, eitherGrey_100_200(index % 2 - 1).bg]} onPress={() => onPress(data)}>
      <Text style={styles.selectionText}>
        {name}
      </Text>
      <View style={{ flex: 1 }}></View>
      { isSelected &&
        <Icon name="check-square-o" size={28} color={blueLt.color} />
      }
    </TouchableOpacity>
  )
}

const SelectionHeader = ({ label }) => {
  return (
    <View style={[styles.headerRow, blueLt.bg]}>
      <Text style={[styles.headerText, white.text]}>{ label }</Text>
    </View>
  )
}

const SelectLocation = ({ options, toggle, onPress }) => {
  const grouped = groupBy(options, option => get(option, 'floor.number'));
  const list = keys(grouped).map(k => ({ data: get(grouped, k), title: k, key: k }));

  return (
    <SectionList
      renderItem={({ item, index }) => <SelectableLocation data={item} index={index} onPress={onPress} />}
      renderSectionHeader={({ section }) => <SelectionHeader label={section.title} key={section.title} />}
      sections={list}
      keyExtractor={(item, index) => `key-${index}`}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1
  },
  headerRow: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerText: {
    marginLeft: 12,
    fontSize: 20,
    fontWeight: '500'
  },
  selectionRow: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12
  },
  selectionText: {
    fontSize: 17,
    ...slate.text
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    // marginLeft: 12,
    marginRight: 12,
    ...greyDk.bg
  },
  thumbnailText: {
    ...white.text,
    fontSize: 24,
    fontWeight: 'bold'
  }
});

export default SelectLocation
