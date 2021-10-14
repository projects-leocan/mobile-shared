import React from 'react';
import I18n from 'react-native-i18n';
import moment from 'moment';

import {
  SpecialText
} from './styles';

import {
  orange,
  red,
  greyDk
} from 'rc-mobile-base/lib/styles';

export default Special = ({ tasks = 0, scheduledTs = null, scheduledOrder = null, isFinished = false }) => {
  let label, color;

  if (scheduledOrder) {
    label = scheduledOrder;
    color = orange.color;
  } else if (scheduledTs) {
    label = moment.unix(scheduledTs).format('LT');
    color = orange.color;
  } else if (tasks && tasks.length) {
    label = `${tasks.length} ${I18n.t(tasks > 1 ? 'base.ubiquitous.tasks' : 'base.ubiquitous.task')}`
    color = red.color;
  }

  if (!label) {
    return null;
  }

  return (
    <SpecialText color={color}>{ String(label).toUpperCase() }</SpecialText>
  )
}