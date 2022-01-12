import React from 'react';
import I18n from 'react-native-i18n';

import {
  GuestContainer,
  GuestText,
} from './styles'

export default GuestStatus = ({ guestStatus, isPriority }) => (
  <GuestContainer isDisabled={!guestStatus} isPriority={isPriority}>
    {guestStatus ?
      <GuestText>{`${guestStatus && I18n.t('base.ubiquitous.' + guestStatus) || ''}`.toUpperCase()}</GuestText>
      :
      <GuestText>{`VAC`}</GuestText>
    }
  </GuestContainer>
)