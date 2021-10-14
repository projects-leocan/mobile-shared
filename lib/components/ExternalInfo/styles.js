import styled, { css } from 'styled-components/native';

export const Container = styled.View`
  margin-top: 15;
`

export const InfoHeader = styled.Text`
  margin-left: 15;
  margin-bottom: 2;
  color: #373737;
  font-weight: 500;
  opacity: .8;
`

export const InfoContainer = styled.View`
  background-color: white;
  margin-horizontal: 4;
`

export const InfoRow = styled.View`
  padding-horizontal: 12;
  padding-vertical: 6;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  border-bottom-width: 1;
  border-bottom-color: #f0f0f0;
`

export const IconContainer = styled.View`
  width: 54;
`

export const InfoText = styled.Text`
  color: #4a4a4a;
  font-weight: 300;
  font-size: 14;
  flex: 1;
  flex-direction: column;
`

export const BoldText = styled.Text`
  font-size: 10;
  font-weight: 600;
  color: #4a4a4a;
`