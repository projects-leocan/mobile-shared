import React, { Component } from 'react';
import { View } from 'react-native';

import Toggler from '../Toggler';
import TaskCard from '../TaskCard';

import TaskRow from './index';

export const Expandable = (props) => (
  <Toggler
    hideOpener
    renderOpener={(toggle) => (
      <TaskRow {...props} onPress={toggle}/>
    )}
    renderContent={(toggle) => (
      <TaskCard {...props} onClose={toggle} onPress={props.onSwipeoutPress} />
    )}
  />
)

export default Expandable
