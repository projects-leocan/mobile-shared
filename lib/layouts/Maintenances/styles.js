import styled, { css } from 'styled-components/native';

import {
  grey400,
  white,
  blueLt
} from 'rc-mobile-base/lib/styles';

export const Container = styled.View`
  flex: 1;
  background-color: #F0F0F0; 
`

export const SubheaderContainer = styled.View`
  flex-direction: row;
  background-color: ${grey400.color};
  height: 50;
`

export const SubheaderOptionContainer = styled.TouchableOpacity`
  height: 50;
  flex: 1;
  justify-content: center;
  align-items: center;
  border-bottom-width: 2;
  border-bottom-color: ${props => props.isActive ? blueLt.color : grey400.color};
`

export const SubheaderOptionText = styled.Text`
  color: ${props => props.isActive ? blueLt.color : white.color };
  font-weight: bold;
`

export const CardContainer = styled.View`
  height: 240;
`