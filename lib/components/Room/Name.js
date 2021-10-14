import React from 'react';

import {
  NameContainer,
  NameText,
} from './styles';

export default Name = ({ name, housekeeping = {} }) => (
  <NameContainer>
    <NameText color={housekeeping.color && `#${housekeeping.color}`} numberOfLines={3} isSmall={name && name.length > 6}>
      { name }
    </NameText>
  </NameContainer>
)