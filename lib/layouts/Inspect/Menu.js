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
import {
  blueLt
} from 'rc-mobile-base/lib/styles';

const Menu = ({ clean, inspect, nocheck, later, dnd, refuse, style }) => {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity style={[styles.menuBtn, blueLt.bg]} onPress={inspect}>
        <Text><IcoMoonIcon name={'bed'} size={54} color='white' /></Text>
        <Text style={[styles.btnText, { marginTop: 0, paddingTop: 2 }]}>{ I18n.t('attendant.inspect.menu.inspect').toUpperCase() }</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.menuBtn, { backgroundColor: '#F5A623'}]} onPress={nocheck}>
        <Text><IcoMoonIcon name={'check'} size={44} color='white' /></Text>
        <Text style={[styles.btnText, { marginTop: 6, paddingTop: 2 }]}>{ I18n.t('attendant.inspect.menu.no-check').toUpperCase() }</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.menuBtn, { backgroundColor: '#4a4a4a'}]} onPress={dnd}>
        <Text><IcoMoonIcon name={'dnd'} size={48} color='white' /></Text>
        <Text style={[styles.btnText, { marginTop: 6}]}>{ I18n.t('attendant.inspect.menu.dnd').toUpperCase() }</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.menuBtn, { backgroundColor: '#C93C46'}]} onPress={refuse}>
        <Text><IcoMoonIcon name={'refuse'} size={48} color='white' /></Text>
        <Text style={[styles.btnText, { marginTop: 6}]}>{ I18n.t('attendant.inspect.menu.refuse').toUpperCase() }</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 2,
    marginTop: 20
  },
  menuBtn: {
    width: Dimensions.get('window').width / 2 - 6,
    height: 130,
    margin: 2,
    backgroundColor: 'white',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 3,
    paddingBottom: 25
  },
  btnText: {
    fontWeight: '600',
    color: 'white'
  },
});

export default Menu;
