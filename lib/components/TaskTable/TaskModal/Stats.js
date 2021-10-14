import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import I18n from 'react-native-i18n';

import { get } from 'lodash/object';
import moment from 'moment';

import {
  margin,
  padding,
  text,
  slate,
  grey200
} from 'rc-mobile-base/lib/styles';

const QuickStat = ({ label, value }) => (
  <View style={styles.quickStatContainer}>
    <Text style={styles.labelStyle}>{ label.toUpperCase() }</Text>
    <Text style={styles.valueStyle}>{ value }</Text>
  </View>
)

const Stats = ({ task }) => {
  const [asset, action] = get(task, 'task', ':').split(':');
  const location = get(task, 'meta.location', '');
  const creator = get(task, 'creator') && `${task.creator.first_name} ${task.creator.last_name}` || null;
  const time = moment.unix(task.date_ts).fromNow();

  return (
    <View style={styles.container}>
      <Text style={styles.assetName}>{ (asset || '').trim() }</Text>
      <Text style={styles.actionName}>{ (action || '').trim() }</Text>
      <QuickStat label={I18n.t('base.ubiquitous.location')} value={location} />
      <QuickStat label={I18n.t('base.tasktable.modal.created-by')} value={creator} />
      <QuickStat label={I18n.t('base.tasktable.modal.submitted-time')} value={time} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...grey200.bg,
    width: 196,
    flex: 1,
    ...padding.a10
  },
  assetName: {
    ...slate.text,
    fontSize: 19,
    fontWeight: '500',
  },
  actionName: {
    ...slate.text,
    fontSize: 17,
    opacity: .8,
    fontWeight: '500',
  },
  quickStatContainer: {
    ...margin.t15
  },
  labelStyle: {
    fontSize: 14,
    ...slate.text,
    opacity: .7,
    marginBottom: 2
  },
  valueStyle: {
    fontSize: 17,
    ...slate.text,
    fontWeight: '500',
    opacity: .9
  }
});

export default Stats;
