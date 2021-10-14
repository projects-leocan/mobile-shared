import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';
import I18n from 'react-native-i18n';

import {
  margin,
  padding,
  green,
  greyDk,
  orange,
  slate,
  red,
  white
} from 'rc-mobile-base/lib/styles';
import H1 from 'rc-mobile-base/lib/components/H1';

const headerOptions = {
  closedHk: {
    text: 'recently-closed-tasks',
    color: green.text
  },
  openHk: {
    text: 'open-housekeepings',
    color: red.text
  },
  open: {
    text: 'open',
    color: red.text
  },
  closed: {
    text: 'recently-closed-tasks',
    color: green.text
  },
  closedMaintenance: {
    text: 'recently-closed-tasks',
    color: green.text
  },
  openMaintenance: {
    text: 'open-maintenances',
    color: red.text
  },
  assigned: {
    text: 'my-assigned-tasks',
    color: red.text
  },
  attendant: {
    text: 'attendant-runner',
    color: greyDk.text
  },
  other: {
    text: 'attendant-runner',
    color: greyDk.text
  },
  "paused-audits": {
    text: 'paused-audits',
    color: orange.text
  },
  "open-audits": {
    text: 'open-audits',
    color: red.text
  },
  "completed-audits": {
    text: 'recently-closed-audits',
    color: green.text
  },
  "start-new-audit": {
    text: 'start-new-audit',
    color: slate.text
  }
}

const getHeaderOptions = (sectionId) => {
  return headerOptions[sectionId] || { text: 'Tasks', color: greyDk.text }
}

const TableHeader = ({ value, ...props }) => {
  const options = getHeaderOptions(value)
  return (
    <View style={[padding.t20, white.bg]} {...props}>
      <H1 style={[options.color, margin.l10]}>        
        { I18n.t(`inspector.tableheader.index.${options.text}`) }
      </H1>
    </View>
  )
}

export default TableHeader
