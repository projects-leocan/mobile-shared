import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  ButtonContainer,
  ButtonText
} from './styles';

export default Button = ({ icon, color, onPress, isDisabled, children }) => (
  <ButtonContainer onPress={isDisabled ? () => null : onPress}>
    <Icon name={icon} size={20} color={color} />
    <ButtonText color={color}>{ children && children.toUpperCase() }</ButtonText>
  </ButtonContainer>
)