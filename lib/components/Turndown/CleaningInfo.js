import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import I18n from 'react-native-i18n'

import Icon from 'react-native-vector-icons/FontAwesome';
import { get, has } from 'lodash/object';
import {
  grey400
} from 'rc-mobile-base/lib/styles';

const Vip = ({ vip }) => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>
      <Icon name="star" size={18} color='#F5A623' />
    </View>
    <Text style={styles.infoText}>{ vip || 'VIP' }</Text>
  </View>
)

const PmsNote = ({ note }) => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>
      <Text style={styles.pms}>{ I18n.t('attendant.clean.cleaninginfo.pms') }</Text>
    </View>
    <Text style={styles.infoText} numberOfLines={4}>{ note }</Text>
  </View>
)

const Message = ({ message }) => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>
      <Icon name="envelope" size={18} color='#4a4a4a' />
    </View>
    <Text style={styles.infoText}>{ message || '' }</Text>
  </View>
)

const CleaningInfo = ({ room, style }) => {
  if (!room) {
    return null;
  }
  
  const vip = get(room, ['roomCalendar', 0, 'vip'], null);
  const pmsNote = get(room, ['roomCalendar', 0, 'pms_note'], null);
  const message = get(room, 'comment');

  if (!vip && !pmsNote && !message) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={{ marginTop: 15 }}>
        <Text style={styles.infoHeader}>{ I18n.t('attendant.clean.cleaninginfo.cleaning-info').toUpperCase() }</Text>
        <View style={styles.infoContainer}>

          { vip ?
            <Vip vip={vip} />
            : null
          }

          { pmsNote ?
            <PmsNote note={pmsNote} />
            : null
          }

          { message ?
            <Message message={message} />
            : null
          }
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {

  },
  infoHeader: {
    marginLeft: 15,
    marginBottom: 2,
    color: '#373737',
    fontWeight: '500',
    opacity: .8
  },
  infoContainer: {
    backgroundColor: 'white',
    marginLeft: 4,
    marginRight: 4,
  },
  infoRow: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 6,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconContainer: {
    width: 54
  },
  infoText: {
    color: '#4a4a4a',
    fontWeight: '300',
    fontSize: 14,
    flex: 1,
    flexDirection: 'column'
  },
  pms: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4a4a4a'
  },
});

export default CleaningInfo;
