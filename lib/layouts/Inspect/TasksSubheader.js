import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import {
  red,
  white,
  margin,
  lCenterCenter
} from 'rc-mobile-base/lib/styles';

const TasksSubheader = ({ tasks, isShown, onPress }) => {
  return (
    <TouchableOpacity style={[styles.container, isShown ? { marginBottom: 2 } : null ]} onPress={onPress}>
      { isShown ?
        <Text style={styles.displayTest}>{ `${'Hide Tasks'.toUpperCase()}` }</Text>
        :
        <Text style={styles.displayTest}>{ `${'Show Tasks'.toUpperCase()} (${tasks.length})` }</Text>
      }
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    // marginLeft: 4,
    // marginRight: 4,
    ...red.bg,
    ...margin.b15,
    ...lCenterCenter
  },
  displayTest: {
    ...white.text,
    fontSize: 14,
    fontWeight: 'bold'
  }
});

export default TasksSubheader;
