import styled, { css } from 'styled-components/native';

export const Container = styled.View`
  margin-top: 15px;
`

export const InfoHeader = styled.Text`
  margin-left: 15px;
  margin-bottom: 2px;
  color: #373737;
  font-weight: 500;
  opacity: .8;
`

export const InfoContainer = styled.View`
  background-color: white;
  margin-horizontal: 4px;
`

export const InfoRow = styled.View`
  padding-horizontal: 12px;
  padding-vertical: 6px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
`

export const InfoButton = styled.TouchableOpacity`
  padding-horizontal: 12px;
  padding-vertical: 6px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
`

export const IconContainer = styled.View`
  width: 54px;
`

export const InfoText = styled.Text`
  color: #4a4a4a;
  font-weight: 300;
  font-size: 14px;
  flex: 1;
  flex-direction: column;
`

export const BoldText = styled.Text`
  font-size: 10px;
  font-weight: 600;
  color: #4a4a4a;
`