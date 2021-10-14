import React from 'react';
import styled, { css } from 'styled-components';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  grey400,
  slate
} from 'rc-mobile-base/lib/styles';

export const SectionHeader = styled.Text`
  margin-left: 15px;
  color: #373737;
  font-weight: 500;
  opacity: .8;

  ${props => props.marginTop && css`
    margin-top: ${props.marginTop}
  `}
  ${props => props.marginBottom && css`
    margin-bottom: ${props.marginBottom}
  `}
`

export const OptionsContainer = styled.View`
  padding-horizontal: 10px;
  margin-bottom: 10px;
`

export const OptionContainer = styled.TouchableOpacity`
  flexDirection: row;
  border-width: 1px;
  border-color: ${grey400.color};
  border-radius: 2px;
  margin-bottom: 10;
  height: 60px;
  align-items: center;
`

export const OptionIconContainer = styled.View`
  height: 60px;
  width: 60px;
  align-items: center;
  justify-content: center;

  background-color: ${props => props.iconColor || slate.color};
`

export const OptionText = styled.Text`
  color: ${slate.color};
  font-size: 15px;
  padding-left: 10px;
  font-weight: bold;
  opacity: .8;
`

export const Option = ({ label, icon, iconColor, handler = () => null }) => (
  <OptionContainer onPress={handler}>
    <OptionIconContainer iconColor={iconColor}>
      <Icon name={icon} size={24} color={'white'} />
    </OptionIconContainer>
    <OptionText>{ label }</OptionText>
  </OptionContainer> 
)