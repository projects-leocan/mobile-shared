import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import DropDownMenu from 'rc-mobile-base/lib/components/DropDownMenu';
import Button from 'rc-mobile-base/lib/components/Button';

import {
  white,
  padding,
  margin,
  flxRow,
  grey400,
  flx1,
  grey,
  greyDk,
  blue
} from 'rc-mobile-base/lib/styles';

const Subheader = ({ rooms, isFilterOpen, toggleFilter, isFilterActive, roomCategories, activeCategories, activeRoomCategory, updateCategory }) => {

  return (
    <View style={[styles.container]}>
      <View style={[flxRow]}>
        <View style={styles.sideArea}>

        </View>
        <View style={[flx1, styles.roomsCountContainer]}>
          <Text style={styles.roomsCountText}>{ `${rooms.length} ROOMS`}</Text>
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
