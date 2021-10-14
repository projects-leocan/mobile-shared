import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import IcoMoonIcon from 'rc-mobile-base/lib/components/IcoMoonIcon';

const Status = ({ status }) => {
  if (!status || !status.length) {
    return null;
  }

  let icon;
  switch(status) {
    case "cleaning":
      icon = <IcoMoonIcon name={'bed'} size={26} color='#1A8CFF' />; break;
    case "delay":
      icon = <IcoMoonIcon name={'delay'} size={24} color='#F5A623' />; break;
    case "dnd":
      icon = <IcoMoonIcon name={'dnd'} size={26} color='#4a4a4a' />; break;
    case "confirm-dnd":
      icon = <IcoMoonIcon name={'dnd'} size={26} color='#4a4a4a' />; break;
    case "refuse":
      icon = <IcoMoonIcon name={'refuse'} size={24} color='#C93C46' />; break;
    case "finish":
      icon = <IcoMoonIcon name={'check'} size={24} color='#3CC86B' />; break;
    case "no-check":
      icon = <IcoMoonIcon name={'check'} size={24} color='#F5A623' />; break;
  }

  return icon;
}

const styles = StyleSheet.create({
  container: {

  },
});

export default Status;
