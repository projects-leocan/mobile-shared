import styled, { css } from 'styled-components';

export const Container = styled.View`
  flex: 1;
  background-color: #F0F0F0;
`

export const ChecklistsSectionContainer = styled.View`
  background-color: #F0F0F0;
  padding-left: 22px;
  padding-top: 30px;
  padding-bottom: 10px;
`

export const ChecklistsSectionText = styled.Text`
  
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