import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import I18n from 'react-native-i18n';

import { blueDk, blue, white, blueLt, slate, grey, greyLt, greyDk, red, green } from 'rc-mobile-base/lib/styles/colors';
import { lStartCenter, lCenterCenter } from 'rc-mobile-base/lib/styles/layout';
import { padding, margin } from 'rc-mobile-base/lib/styles/positioning';

import { find } from 'lodash/collection';
import { get } from 'lodash/object';

import SectionHeading from 'rc-mobile-base/lib/components/section-heading';

import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../images/icomoon/selection.json';
const CustomIcon = createIconSetFromIcoMoon(icoMoonConfig);

class FilterGrid extends Component {

  _renderGrid() {
    const { rooms, filterRooms } = this.props;

    const grids = [
      "OCC.I", "VAC.I", "OTH.I",
      "OCC.C", "VAC.C", "OTH.C",
      "OCC.D", "VAC.D", "OTH.D",
      "OCC.O", "VAC.O", "OTH.O",
    ].reduce((pv, i) => {pv[i] = { rooms: [], color: greyLt.color }; return pv}, {});

    const generateGrids = rooms.forEach(room => {
      let status = "OTH";
      let hk = "O";

      if (["OCC", "VAC"].includes(get(room, 'roomStatus.code'))) {
        status = get(room, 'roomStatus.code');
      }
      if (get(room, 'roomHousekeeping.code', '').indexOf("HCI") !== -1) {
        hk = "I";
      } else if (get(room, 'roomHousekeeping.code', '').indexOf("HC") !== -1) {
        hk = "C";
      } else if (get(room, 'roomHousekeeping.code', '').indexOf("HD") !== -1) {
        hk = "D";
      }

      const combo = `${status}.${hk}`;
      grids[combo].rooms.push(room);
      if (grids[combo].color === greyLt.color && get(room, 'roomHousekeeping.color')) {
        grids[combo].color = `#${get(room, 'roomHousekeeping.color')}`;
      }
    });

    return (
      <View style={styles.gridContainer}>
        <View style={styles.gridLabelRow}>
          <Text style={styles.rowLabel}>

          </Text>
          <Text style={styles.columnLabel}>
            { I18n.t('attendant.main.filter-grid.occupied').toUpperCase() }
          </Text>
          <Text style={styles.columnLabel}>
            { I18n.t('attendant.main.filter-grid.vacant').toUpperCase() }
          </Text>
          <Text style={styles.columnLabel}>
            { I18n.t('attendant.main.filter-grid.other').toUpperCase() }
          </Text>
        </View>
        <View style={styles.gridBtnRow}>
          <Text style={styles.rowLabel}>
            { I18n.t('attendant.main.filter-grid.inspt').toUpperCase() }
          </Text>
          <TouchableOpacity style={[styles.gridBtn, { backgroundColor: grids['OCC.I'].color }]} onPress={() => filterRooms(grids['OCC.I'].rooms.length && grids['OCC.I'].rooms || [{},])}>
            <Text style={styles.gridText}>{ grids['OCC.I'].rooms.length }</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.gridBtn, { backgroundColor: grids['VAC.I'].color }]} onPress={() => filterRooms(grids['VAC.I'].rooms.length && grids['VAC.I'].rooms || [{},])}>
            <Text style={styles.gridText}>{ grids['VAC.I'].rooms.length }</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.gridBtn, { backgroundColor: grids['OTH.I'].color }]} onPress={() => filterRooms(grids['OTH.I'].rooms.length && grids['OTH.I'].rooms || [{},])}>
            <Text style={styles.gridText}>{ grids['OTH.I'].rooms.length }</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.gridBtnRow}>
          <Text style={styles.rowLabel}>
            { I18n.t('attendant.main.filter-grid.clean').toUpperCase() }
          </Text>
          <TouchableOpacity style={[styles.gridBtn, { backgroundColor: grids['OCC.C'].color }]} onPress={() => filterRooms(grids['OCC.C'].rooms.length && grids['OCC.C'].rooms || [{},])}>
            <Text style={styles.gridText}>{ grids['OCC.C'].rooms.length }</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.gridBtn, { backgroundColor: grids['VAC.C'].color }]} onPress={() => filterRooms(grids['VAC.C'].rooms.length && grids['VAC.C'].rooms || [{},])}>
            <Text style={styles.gridText}>{ grids['VAC.C'].rooms.length }</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.gridBtn, { backgroundColor: grids['OTH.C'].color }]} onPress={() => filterRooms(grids['OTH.C'].rooms.length && grids['OTH.C'].rooms || [{},])}>
            <Text style={styles.gridText}>{ grids['OTH.C'].rooms.length }</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.gridBtnRow}>
          <Text style={styles.rowLabel}>
            { I18n.t('attendant.main.filter-grid.dirty').toUpperCase() }
          </Text>
          <TouchableOpacity style={[styles.gridBtn, { backgroundColor: grids['OCC.D'].color }]} onPress={() => filterRooms(grids['OCC.D'].rooms.length && grids['OCC.D'].rooms || [{},])}>
            <Text style={styles.gridText}>{ grids['OCC.D'].rooms.length }</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.gridBtn, { backgroundColor: grids['VAC.D'].color }]} onPress={() => filterRooms(grids['VAC.D'].rooms.length && grids['VAC.D'].rooms || [{},])}>
            <Text style={styles.gridText}>{ grids['VAC.D'].rooms.length }</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.gridBtn, { backgroundColor: grids['OTH.D'].color }]} onPress={() => filterRooms(grids['OTH.D'].rooms.length && grids['OTH.D'].rooms || [{},])}>
            <Text style={styles.gridText}>{ grids['OTH.D'].rooms.length }</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.gridBtnRow}>
          <Text style={styles.rowLabel}>
            { I18n.t('attendant.main.filter-grid.other').toUpperCase() }
          </Text>
          <TouchableOpacity style={[styles.gridBtn, { backgroundColor: grids['OCC.O'].color }]} onPress={() => filterRooms(grids['OCC.O'].rooms.length && grids['OCC.O'].rooms || [{},])}>
            <Text style={styles.gridText}>{ grids['OCC.O'].rooms.length }</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.gridBtn, { backgroundColor: grids['VAC.O'].color }]} onPress={() => filterRooms(grids['VAC.O'].rooms.length && grids['VAC.O'].rooms || [{},])}>
            <Text style={styles.gridText}>{ grids['VAC.O'].rooms.length }</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.gridBtn, { backgroundColor: grids['OTH.O'].color }]} onPress={() => filterRooms(grids['OTH.O'].rooms.length && grids['OTH.O'].rooms || [{},])}>
            <Text style={styles.gridText}>{ grids['OTH.O'].rooms.length }</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    const { resetRooms, searchQuery, searchRooms, closeFilters } = this.props;

    return (
      <View style={styles.container}>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={ I18n.t('attendant.main.filter-grid.search') }
            value={searchQuery}
            onChangeText={searchRooms}
            />
        </View>

        {/* { this._renderGrid() } */}

        {/* <View style={styles.optionsContainer}>
          <TouchableOpacity style={[styles.optionsBtn, styles.resetBtn]} onPress={resetRooms}>
            <Text style={styles.optionsText}>{ I18n.t('attendant.main.filter-grid.reset').toUpperCase() }</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.optionsBtn, styles.closeBtn]} onPress={closeFilters}>
            <Text style={styles.optionsText}>{ I18n.t('attendant.main.filter-grid.close').toUpperCase() }</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    // paddingTop: 84,
    // ...padding.x30,
    // ...padding.b20
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 1,
    borderTopColor: grey.color,
    borderTopWidth: 1
  },
  gridContainer: {
    ...margin.y10
  },
  gridLabelRow: {
    flexDirection: 'row',
    ...margin.b5
  },
  gridBtnRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rowLabel: {
    width: 60,
    fontSize: 13,
    fontWeight: '600',
    ...greyDk.text
  },
  columnLabel: {
    width: 80,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    ...greyDk.text
  },
  gridBtn: {
    width: 80,
    height: 50,
    ...greyLt.bg,
    borderColor: white.color,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  gridText: {
    fontSize: 17,
    fontWeight: 'bold',
    ...white.text
  },
  roomsCount: {
    fontSize: 32,
    ...blue.text,
    fontWeight: 'bold'
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...margin.b10
  },
  optionsBtn: {
    width: 80,
    height: 50,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  resetBtn: {
    ...red.bg,
    margin: 2
  },
  closeBtn: {
    ...greyDk.bg,
    margin: 2
  },
  optionsText: {
    fontSize: 15,
    fontWeight: '500',
    ...white.text
  },
  searchContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    ...margin.t5
  },
  searchInput: {
    height: 40,
    width: 280,
    borderRadius: 20,
    ...greyLt.bg,
    textAlign: 'center'
  }
});

export default FilterGrid;
