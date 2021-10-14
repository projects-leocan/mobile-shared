import React from 'react';

import {
  SelectionButtonContainer,
  SelectionButtonText
} from './styles'

export default SelectionButton = ({ label, isActive, handler }) => (
  <SelectionButtonContainer isActive={isActive} onPress={handler}>
    <SelectionButtonText isActive={isActive}>{ label.toUpperCase() }</SelectionButtonText>
  </SelectionButtonContainer>
)