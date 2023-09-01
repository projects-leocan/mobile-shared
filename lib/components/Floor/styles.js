import styled, { css } from 'styled-components/native';

import {
  slate,
  grey400,
  greyDk,
  orange
} from 'rc-mobile-base/lib/styles';

export const Container = styled.TouchableOpacity`
padding-horizontal: 12px;
padding-vertical: 12px;
background-color: white;
border-color: ${grey400.color};
border-width: 1px;
border-radius: 2px;
margin-horizontal: 4px;
margin-bottom: 4px;
`

export const PrimaryRow = styled.View`
flex-direction: row;
justify-content: space-between;
`

export const FloorText = styled.Text`
font-size: 16px;
font-weight: 500;
color: ${props => props.isSpecial ? orange.color : slate.color};
`

export const TasksText = styled.Text`
font-size: 13px;
font-weight: 600;
color: ${slate.color};
opacity: .8;
`

export const SecondaryRow = styled.View`
flex-direction: row;
justify-content: space-between;
margin-top: 1px;
`

export const RoomsText = styled.Text`
font-size: 13px;
font-weight: 400;
color: ${greyDk.color};
`

export const ThirdRow = styled.View`
flex-direction: row;
justify-content: space-between;
margin-top: 15px;
`

export const StatsText = styled.Text`
font-size: 12px;
font-weight: 300;
color: ${greyDk.color};
`
