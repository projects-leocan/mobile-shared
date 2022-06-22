import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import I18n from 'react-native-i18n';

import {
  flxRow,
  flex1,
  margin,
  padding,
  text,
  white,
  grey,
  greyDk,
  grey400,
  blue300,
  blue100,
  jcc,
  aic,
  border,
  splashBg
} from 'rc-mobile-base/lib/styles';

const Tab = ({ onPress, text, value, active }) => (
  <TouchableOpacity
    style={[flex1, padding.y10, padding.x5, jcc, aic, active ? blue100.bg : white.bg, { height: 50 }]}
    onPress={() => onPress(value)}
  >
    <Text style={[active ? white.text : greyDk.text]}>
      {text}
    </Text>
  </TouchableOpacity>
)

export const TabsContent = ({ onPress, activeTab, isSendDisabled, userType }) => (
  <View style={[flex1, flxRow, white.bg, grey400.bc, border.a0, border.l0, { height: 50 }]}>
    <Tab
      value={0}
      text={I18n.t('base.tasks.tabs.today')}
      active={activeTab === 0}
      onPress={onPress}
    />
    {String(userType).toLowerCase() !== 'attendant'
      &&
      <Tab
        value={1}
        text={I18n.t('base.tasks.tabs.backlog')}
        active={activeTab === 1}
        onPress={onPress}
      />
    }
    {(isSendDisabled || String(userType).toLowerCase() === 'attendant') ?
      null :
      <Tab
        value={2}
        text={I18n.t('base.tasks.tabs.sent')}
        active={activeTab === 2}
        onPress={onPress}
      />
    }
  </View>
)

export default TabsContent
