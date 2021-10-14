import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import I18n from 'react-native-i18n'

import Icon from 'react-native-vector-icons/FontAwesome';
import DropDownMenu from 'rc-mobile-base/lib/components/DropDownMenu';
import Button from 'rc-mobile-base/lib/components/Button';

import {
  white,
  padding,
  orange,
  margin,
  flxRow,
  grey400,
  flx1,
  aic,
  grey,
  greyDk,
  blue
} from 'rc-mobile-base/lib/styles';

const Subheader = ({ rooms, priorityRooms, isFilterOpen, toggleFilter, isFilterActive, roomCategories, activeCategories, activeRoomCategory, updateCategory }) => {

  return (
    <View style={[styles.container]}>
      <View style={[flxRow]}>
        <View style={[styles.sideArea, flxRow, aic]}>
          { priorityRooms.length ?
            <Text style={[styles.priorityCountText, orange.text]}>{ priorityRooms.length }</Text>
            : null
          }
          { priorityRooms.length ?
            <Icon name="star" color={orange.color} size={16} style={{ marginLeft: 2 }} />
            : null
          }
        </View>
        <View style={[flx1, styles.roomsCountContainer]}>
          <Text style={styles.roomsCountText}>{ `${rooms.length} ${I18n.t('base.ubiquitous.bedrooms').toUpperCase()}`}</Text>
        </View>
        <View style={styles.sideArea}>
          <TouchableOpacity style={styles.filterBtn} onPress={toggleFilter}>
            <Icon name="filter" size={20} color={isFilterActive ? blue.color : grey.color} />
          </TouchableOpacity>
        </View>
      </View>

      { isFilterOpen ?
        <View style={styles.openHeader}>
          { activeCategories.map(category =>
            <Button key={category.value} style={[margin.b5, category.isEnabled ? null : grey.bg ]} onPress={() => updateCategory(category.value)}>
              <Text style={[white.text]}>{ category.label }</Text>
            </Button>
          )}
        </View>
        : null
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // height: 50,
    ...white.bg,
    ...padding.x10,
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 1
  },
  sideArea: {
    height: 50,
    width: 50,
  },
  roomsCountContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  priorityCountText: {
    ...greyDk.text,
    fontWeight: '500',
    fontSize: 17
  },
  roomsCountText: {
    ...greyDk.text,
    fontWeight: '500',
    fontSize: 13
  },
  filterBtn: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  openHeader: {
    // height: 50,
    borderTopWidth: 1,
    borderTopColor: grey.color
  }
});

export default Subheader;
