import styled, { css } from 'styled-components/native';
import UserTouchable from '../UserTouchable';

import {
  slate,
  grey400
} from 'rc-mobile-base/lib/styles';

export const Base = styled.TouchableOpacity`
  border-width: 1;
  border-color: rgba(151,151,151,.2);
  padding-horizontal: 10;
  margin-horizontal: 6;
  background-color: white;
  margin-bottom: 2;
`

export const Container = styled.View`
  height: 50;
  flex-direction: row;
  align-items: center;
`

export const NameContainer = styled.View`
  width: 60;
  height: 40;
  justify-content: center;
`

export const NameText = styled.Text`
  font-size: ${props => props.isSmall ? 12 : 15};
  font-weight: ${props => props.isSmall ? 400 : 'bold'};
  color: ${props => props.color || slate.color};
`

export const GuestContainer = styled.View`
  height: 36;
  width: 48;
  border-width: ${props => props.isDisabled ? 0 : 1};
  border-color: rgba(151,151,151,.2);
  justify-content: center;
  align-items: center;
  margin-right: 5;
`

export const GuestText = styled.Text`
  font-weight: bold;
  font-size: 13;
  color: ${slate.color};
  opacity: .7;
`

export const StatusContainer = styled.View`
  height: 40;
  width: 32;
  justify-content: center;
  align-items: center;
`

export const ExtraContainer = styled.View`
  height: 40;
  width: 70;
  align-items: center;
  justify-content: flex-end;
  flex-direction: row;
`

export const ExtraItemContainer = styled.View`
  height: 40;
  padding-horizontal: 5;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.color};
`

export const ExtraItemText = styled.View`
  font-size: 11;
  font-weight: bold;
  color: white;
`

export const Spacer = styled.View`
  flex: 1;
`

export const IconsContainer = styled.View`
  flex-direction: row;  
  height: 40;
  max-width: 90;
  align-items: center;
  justify-content: flex-end;
`

export const MiceText = styled.Text`
  font-size: 11;
  color: ${props => props.color || slate.color};
  font-weight: bold;
  letter-spacing: .05;
`

export const SpecialText = styled.Text`
  font-size: 11;
  font-weight: bold;
  background-color: ${props => props.color || slate.color};
  color: white;
  padding-horizontal: 8;
  padding-vertical: 4;
  border-radius: 2;
`

export const FinishedOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${grey400.color};
  opacity: .5;
`

export const ExtraRow = styled.View`
  flex-direction: row;
  padding-bottom: 4;
  align-items: center;
`

export const ExtraRowContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 10;
`

export const ExtraRowValue = styled.Text`
  font-size: 13;
  font-weight: bold;
  color: #4a4a4a;
  opacity: .9;
`

export const ExtraRowLabel = styled.Text`
  font-size: 13;
  font-weight: 400;
  color: #4a4a4a;
  opacity: .7;
  margin-right: 4;
`