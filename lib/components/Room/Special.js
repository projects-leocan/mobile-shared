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

export default Special = ({ tasks = 0, scheduledTs = null, scheduledOrder = null, isFinished = false, showCleaningOrderValue = false, orderCleaningsByRoomName = false, calculated_scheduled_order = null  }) => {
  let label, color;

  if (orderCleaningsByRoomName) {
    if(showCleaningOrderValue) {
      label = calculated_scheduled_order;
      color = orange.color;
    } else {
      label = moment.unix(scheduledTs).format('LT');
      color = orange.color;
    }
  } else if (!orderCleaningsByRoomName) {
    if(!showCleaningOrderValue) {
      label = calculated_scheduled_order;
      color = orange.color;
    } else {
      label = moment.unix(scheduledTs).format('LT');
      color = orange.color;
    }
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