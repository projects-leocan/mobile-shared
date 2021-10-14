import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import I18n from 'react-native-i18n'

import {
  flxRow,
  flxCol,
  flx3,
  flx2,
  flx1,
  margin,
  padding
} from 'rc-mobile-base/lib/styles';

import H2 from '../H2';

export const Header = ({ tasks }) => (
  <View style={[flxRow, margin.y5]}>
    <View style={[flxCol, flx2]}>
      <H2>{ I18n.t('base.tasktable.header.task') }</H2>
    </View>
    <View style={{ width: 5 }}></View>
    <View style={[flxCol, flx1]}>
      <H2>{ I18n.t('base.tasktable.header.location') }</H2>
    </View>
    <View style={{ width: 5 }}></View>
    <View style={[flxCol, flx1]}>
      <H2>{ I18n.t('base.tasktable.header.created-by') }</H2>
    </View>
    <View style={{ width: 5 }}></View>
    <View style={[flxCol, flx1]}>
      <H2>{ I18n.t('base.tasktable.header.time-created') }</H2>
    </View>
    <View style={{ width: 5 }}></View>
    <View style={[flxCol, flx1]}>
      <H2>{ I18n.t('base.tasktable.header.assigned') }</H2>
    </View>
    <View style={{ width: 5 }}></View>
    <View style={[flxCol, flx1]}>
      <H2>{ I18n.t('base.tasktable.header.status') }</H2>
    </View>
  </View>
)

export default Header
