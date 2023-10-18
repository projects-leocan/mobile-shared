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

export default Special = ({ tasks = 0, scheduledTs = null, scheduledOrder = null, isFinished = false, showCleaningOrderValue = false, orderCleaningsByRoomName = false, calculated_scheduled_order = null, startTs = null , endTs = null }) => {
  let label, color;
  const startTsDate = new Date(startTs)
  const startTsHours = startTsDate.getHours();
  const startTsMinutes = startTsDate.getMinutes() < 10 ? '0' +  startTsDate.getMinutes() : startTsDate.getMinutes();

  const endTsDate = new Date(endTs)
  const endTsHours = endTsDate.getHours();
  const endTsMinutes = endTsDate.getMinutes() < 10 ? '0' +  endTsDate.getMinutes() : endTsDate.getMinutes();
 
  if (!orderCleaningsByRoomName && !showCleaningOrderValue) {
    label = null
    color = orange.color;
  } else if (!orderCleaningsByRoomName && showCleaningOrderValue) {
    // label = moment.unix(scheduledTs).format('LT');
    // label = startTsHours + ":" + startTsMinutes + ' - ' + endTsHours + ":" + endTsMinutes;
    label= moment(startTs).format('hh:mm') + " - " + moment(endTs).format('hh:mm')
    color = orange.color;
  } else if (orderCleaningsByRoomName && !showCleaningOrderValue) {
    label = null
    color = orange.color;
  } else if (orderCleaningsByRoomName && showCleaningOrderValue) {
    label = calculated_scheduled_order;
    color = orange.color;
  } else if (tasks && tasks.length) {
    label = `${tasks.length} ${I18n.t(tasks > 1 ? 'base.ubiquitous.tasks' : 'base.ubiquitous.task')}`
    color = red.color;
  }

  if (!label) {
    return null;
  }

  return (
    <SpecialText color={color}>{String(label).toUpperCase()}</SpecialText>
  )
}