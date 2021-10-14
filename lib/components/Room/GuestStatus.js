import React from 'react';
import I18n from 'react-native-i18n';

import {
  GuestContainer,
  GuestText,
} from './styles'

export default GuestStatus = ({ guestStatus }) => (
  <GuestContainer isDisabled={!guestStatus}>
    { guestStatus &&
      <GuestText>{ `${guestStatus && I18n.t('base.ubiquitous.' + guestStatus) || ''}`.toUpperCase() }</GuestText>
    }
  </GuestContainer>
)