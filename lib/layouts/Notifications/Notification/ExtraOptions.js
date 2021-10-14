import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import I18n from 'react-native-i18n'

import {
  flxRow,
  flxCol,
  white,
  red,
  grey,
  grey400,
  margin,
  padding,
  jcsb,
  flex1,
  aife,
  text,
  slate
} from 'rc-mobile-base/lib/styles';

import Button from 'rc-mobile-base/lib/components/Button';

const ExtraOptions = ({ task, sent, reply, convert, toggle }) => {
  return (
    <View style={styles.container}>
      <Button style={[margin.b5]} onPress={() => { toggle(), reply(task) }}>
        { sent ?
          <Text style={styles.btnText}>{ I18n.t('base.notification.extraoptions.follow-up').toUpperCase() }</Text>
          :
          <Text style={styles.btnText}>{ I18n.t('base.notification.extraoptions.reply').toUpperCase() }</Text>
        }

      </Button>
      <Button style={[red.bg]} onPress={() => { toggle(), convert(task) }}>
        <Text style={styles.btnText}>{ I18n.t('base.notification.extraoptions.convert-to-task').toUpperCase() }</Text>
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...grey400.bg,
    ...padding.a10
  },
  btnText: {
    ...white.text,
    fontSize: 15,
    fontWeight: 'bold'
  },
});

export default ExtraOptions;
