import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import I18n from 'react-native-i18n';

const ReservationNights = ({step, total}) => {
  if (step > total) {
    return (
      <View style={styles.container}>
        <View style={styles.departureIndicator}>
          <Text style={[styles.text, styles.whiteText]}>{ I18n.t('base.ubiquitous.departure').toUpperCase() }</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.currentIndicator}>
        <Text style={[styles.text, styles.whiteText]}>{ step }</Text>
      </View>
      <Text style={[styles.text, { marginRight: 2, marginLeft: 2 }]}>{ I18n.t('attendant.components.reservation-nights.of').toLowerCase() }</Text>
      <View style={styles.totalIndicator}>
        <Text style={[styles.text, styles.whiteText]}>{ total }</Text>
      </View>
      <Text style={[styles.text, { marginLeft: 2}]}>{ I18n.t('attendant.components.reservation-nights.nights').toLowerCase() }</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  currentIndicator: {
    height: 16,
    width: 16,
    backgroundColor: '#1A8CFF',
    borderRadius: 2,
    alignItems: 'center'
  },
  totalIndicator: {
    height: 16,
    width: 16,
    backgroundColor: '#D8D8D8',
    borderRadius: 2,
    alignItems: 'center'
  },
  departureIndicator: {
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 4,
    paddingRight: 4,
    backgroundColor: '#3CC86B',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    maxWidth: 100
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4A4A4A'
  },
  whiteText: {
    color: 'white'
  }
});

export default ReservationNights;
