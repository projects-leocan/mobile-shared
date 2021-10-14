import styled, { css } from 'styled-components/native';
import {
  green,
  orange,
  greyDk,
  grey,
} from 'rc-mobile-base/lib/styles';

export const Container = styled.View`
  flex: 1;
  padding-horizontal: 40;
  background-color: #F2F2F2;

  ${props => props.narrow && css`
    padding-horizontal: 15;
  `}
`

export const Content = styled.ScrollView`
`

export const Label = styled.Text`
  font-weight: 600;
  margin-top: 10px;
  margin-bottom: 5px;
  font-size: 18;
  color: ${greyDk.color};
`

export const Bottom = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-vertical: 10px;
  background-color: white;
`

export const Start = styled.TouchableOpacity`
  background: ${green.color};
  height: 45;
  border-radius: 4;
  justify-content: center;

  ${props => props.disabled && css`
    background-color: #B4B4B4;
  `}

  ${props => props.narrow && css`
      padding: 12px;
  `}

  ${props => !props.narrow && css`
    align-items: center;
  `}
`

export const Assign = styled.TouchableOpacity`
  background: ${orange.color};
  height: 45;
  margin: 0 5px;
  border-radius: 4;
  justify-content: center;

  ${props => props.disabled && css`
    background-color: #B4B4B4;
  `}

  ${props => props.narrow && css`
      padding: 12px;
  `}

  ${props => !props.narrow && css`
    align-items: center;
  `}
`

export const BtnText = styled.Text`
  font-weight: 600;
  font-size: 18;
  color: #FFF;

  ${props => props.narrow && css`
    font-size: 13;
  `}
`
export const SetLocationContainer = styled.View`
  background-color: white;
  height: 50;
  justify-content: center;
  padding-horizontal: 10;
`

export const SetLocationText = styled.Text`
  color: ${greyDk.color};
  font-weight: bold;
  font-size: 17;
`