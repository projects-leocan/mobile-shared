import React from 'react';
import IcoMoonIcon from 'rc-mobile-base/lib/components/IcoMoonIcon';

import {
  StatusContainer
} from './styles';

import {
  green,
  red,
  orange,
  blueLt,
  slate
} from 'rc-mobile-base/lib/styles'

const iconStatus = (status, isPaused) => {
  if (!status) return null;

  if (isPaused) {
    return <IcoMoonIcon name={'pause'} size={26} color='#4a4a4a' />
  }

  let icon;
  switch(status) {
    case "restocked":
      icon = <IcoMoonIcon name={'check'} size={22} color='#3CC86B' />; break;
    case "cleaning":
      icon = <IcoMoonIcon name={'bed'} size={24} color='#1A8CFF' />; break;
    case "delay":
      icon = <IcoMoonIcon name={'delay'} size={22} color='#F5A623' />; break;
    case "dnd":
      icon = <IcoMoonIcon name={'dnd'} size={24} color='#4a4a4a' />; break;
    case "confirm-dnd":
      icon = <IcoMoonIcon name={'dnd'} size={24} color='#4a4a4a' />; break;
    case "refuse":
      icon = <IcoMoonIcon name={'refuse'} size={22} color='#C93C46' />; break;
    case "voucher":
      icon = <IcoMoonIcon name={'voucher'} size={26} color={blueLt.color} />; break;
    case "finish":
      icon = <IcoMoonIcon name={'check'} size={22} color='#3CC86B' />; break;
    case "no-check":
      icon = <IcoMoonIcon name={'check'} size={22} color='#F5A623' />; break;
  }

  return icon;
}

export default Status = ({ status = null, isPaused = false }) => (
  <StatusContainer status={status}>
    { iconStatus(status, isPaused) }
  </StatusContainer>
)