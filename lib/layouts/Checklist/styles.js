import styled, { css } from 'styled-components';

import {
  slate,
  red,
  green
} from 'rc-mobile-base/lib/styles';

export const Container = styled.View`
  flex: 1;
`
  
export const Content = styled.View`
  flex: 1;
  background-color: #F0F0F0;
  padding-bottom: 10px;
`

export const ChecklistsHeaderContainer = styled.View`
  background-color: #F0F0F0;
  padding-left: 22px;
  padding-top: 30px;
  padding-bottom: 10px;
`

export const ChecklistsHeaderText = styled.Text`
  
`

export const ChecklistItemContainer = styled.TouchableOpacity`
  height: 60px;
  background-color: white;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-horizontal: 10px;
  margin-bottom: 4px;
  padding-horizontal: 12px;
`

export const ChecklistItemName = styled.Text`

`

export const ChecklistItemItems = styled.Text`

`

export const ItemContainer = styled.TouchableOpacity`
  background-color: white;
  flex-direction: row;
  margin-horizontal: 10px;
  margin-bottom: 4px;
  padding-horizontal: 12px;
  padding-vertical: 8px;
`

export const ItemLabel = styled.Text`
  color: ${slate.color};
  margin-left: 12px;
  margin-top: 8px;
`

export const FinishButtonContainer = styled.TouchableOpacity`
  height: 50px;
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  background-color: ${props => props.isFinished ? green.color : red.color};
`

export const FinishButtonText = styled.Text`
  color: #FFF;
  font-weight: bold;
  font-size: 16px;
  text-align: center;
`

export const ScanExitContainer = styled.TouchableOpacity`
  position: absolute;  
  width: 50px;
  height: 50px;
  top: 0;
  right: 0;
  justify-content: center;
  align-items: center;
`