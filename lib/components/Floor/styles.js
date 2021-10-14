import styled, { css } from 'styled-components/native';

import {
  slate,
  grey400,
  greyDk,
  orange
} from 'rc-mobile-base/lib/styles';

export const Container = styled.TouchableOpacity`
padding-horizontal: 12;
padding-vertical: 12;
background-color: white;
border-color: ${grey400.color};
border-width: 1;
border-radius: 2;
margin-horizontal: 4;
margin-bottom: 4;
`

export const PrimaryRow = styled.View`
flex-direction: row;
justify-content: space-between;
`

export const FloorText = styled.Text`
font-size: 16;
font-weight: 500;
color: ${props => props.isSpecial ? orange.color : slate.color};
`

export const TasksText = styled.Text`
font-size: 13;
font-weight: 600;
color: ${slate.color};
opacity: .8;
`

export const SecondaryRow = styled.View`
flex-direction: row;
justify-content: space-between;
margin-top: 1;
`

export const RoomsText = styled.Text`
font-size: 13;
font-weight: 400;
color: ${greyDk.color};
`

export const ThirdRow = styled.View`
flex-direction: row;
justify-content: space-between;
margin-top: 15;
`

export const StatsText = styled.Text`
font-size: 12;
font-weight: 300;
color: ${greyDk.color};
`
