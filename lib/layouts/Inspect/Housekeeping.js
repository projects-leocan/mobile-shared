import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
import I18n from 'react-native-i18n'

import IcoMoonIcon from 'rc-mobile-base/lib/components/IcoMoonIcon';
import Entypo from 'react-native-vector-icons/Entypo';

import { keyBy } from 'lodash/collection';
import { get, has } from 'lodash/object';

import {
  blueLt,
  white,
  grey400,
  grey,
  greyDk,
  slate,
  flxRow,
  aic,
  jcc
} from 'rc-mobile-base/lib/styles';

const availableOptions = (roomStatus, roomHousekeeping, hkIndex) => {
    const { code: rsCode } = roomStatus;
    const { code: hkCode } = roomHousekeeping;

    if (['HD', 'HP', 'HC', 'HCI'].includes(hkCode)) {
      return [get(hkIndex, 'HD'), get(hkIndex, 'HC'), get(hkIndex, 'HCI')].filter(x => !!x);
    }
    if (rsCode === 'OCC') {
      return [get(hkIndex, 'OHD'), get(hkIndex, 'OHC'), get(hkIndex, 'OHCI')].filter(x => !!x);
    }
    return [get(hkIndex, 'VHD'), get(hkIndex, 'VHC'), get(hkIndex, 'VHCI')].filter(x => !!x);
}

const optionLabel = (code) => {
  if (['HD', 'VHD', 'OHD'].includes(code)) {
    return 'dirty';
  }
  if (['HC', 'VHC', 'OHC'].includes(code)) {
    return 'clean';
  }
  if (['HCI', 'VHCI', 'OHCI'].includes(code)) {
    return 'inspt';
  }
  
  return '';
}

const HkOption = ({ label, _id, code, color, isActive, onPress }) => (
  <TouchableOpacity style={[styles.btn, isActive ? { backgroundColor: `#${color || '4a4a4a'}` } : null]} onPress={onPress}>
    <Text style={[styles.btnText, isActive ? null : slate.text]}>{ optionLabel(code).toUpperCase() }</Text>
  </TouchableOpacity>
)

const Housekeeping = ({ roomStatus, roomHousekeeping, roomHousekeepings, updateHousekeeping, toggleAdditional, isShowAdditional, style }) => {
  const hkIndex = keyBy(roomHousekeepings, 'code');
  const options = availableOptions(roomStatus, roomHousekeeping, hkIndex);
  const { code: hkCode } = roomHousekeeping;
  
  return (
    <View style={[styles.container, style]}>
      <View style={styles.inner}>
        <View style={styles.main}>
            {options.map(option =>
              <HkOption key={option.code} {...option} isActive={option._id === roomHousekeeping._id} onPress={() => updateHousekeeping(option._id)} />  
            )}
        </View>
        <TouchableOpacity style={styles.additional} onPress={toggleAdditional}>
            <Text style={styles.additionalText}>
                { 'Additional Options'.toUpperCase() }
                <Entypo name="chevron-small-down" size={16} color={greyDk.color} />
            </Text>
        </TouchableOpacity>
        { isShowAdditional && has(hkIndex, 'PU') ?
          <TouchableOpacity style={styles.secondary} onPress={() => updateHousekeeping(get(hkIndex, 'PU._id'))}>
              <Text style={styles.btnText}>
                  { 'Pickup'.toUpperCase() }
              </Text>
          </TouchableOpacity>
          : null
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    paddingLeft: 4,
    paddingRight: 4,
  },
  inner: {
    //   height: 160,
      ...white.bg,
      ...aic,
  },
  main: {
    ...flxRow,
    marginTop: 20,
    marginBottom: 20,
  },
  btn: {
      height: 64,
      width: 64,
      borderRadius: 32,
      ...grey400.bg,
      marginLeft: 8,
      marginRight: 8,
      ...aic,
      ...jcc
  },
  btnText: {
    ...white.text,
    fontWeight: '500',
    fontSize: 15,
    textAlign: 'center'
  },
  additional: {
    height: 50,
    ...jcc
  },
  additionalText: {
    ...greyDk.text
  },
  secondary: {
    ...grey400.bg,
    width: 180,
    marginBottom: 10,
    padding: 6
  }
});

export default Housekeeping;
