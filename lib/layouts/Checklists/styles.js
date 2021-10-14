import styled, { css } from 'styled-components';

export const Container = styled.View`
  flex: 1;
  background-color: #F0F0F0;
`

export const ChecklistsSectionContainer = styled.View`
  background-color: #F0F0F0;
  padding-left: 22;
  padding-top: 30;
  padding-bottom: 10;
`

export const ChecklistsSectionText = styled.Text`
  
`

export const ChecklistItemContainer = styled.TouchableOpacity`
  height: 60;
  background-color: white;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-horizontal: 10;
  margin-bottom: 4;
  padding-horizontal: 12;
`

export const ChecklistItemName = styled.Text`

`