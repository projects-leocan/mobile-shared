import styled, { css } from 'styled-components/native';

import {
  slate,
  grey100
} from 'rc-mobile-base/lib/styles';


export const Container = styled.TouchableOpacity`
height: 60;
width: 100%;
flex-direction: row;
align-items: center;
padding-horizontal: 14;
background-color: white;
border-bottom-width: 1;
border-bottom-color: ${grey100.color};
border-top-width: ${props => Number(props.index) === 0 ? 1 : 0};
border-top-color: ${grey100.color};
`

export const OptionText = styled.Text`
font-size: 17;
color: ${slate.color};
opacity: 0.8;
margin-left: 10;
`

export const OptionOverlay = styled.View`
position: absolute;
top: 0;
left: 0;
right: 0;
bottom: 0;
background-color: white;
opacity: .5;
`

export const HeaderText = styled.Text`
margin-left: 15;
margin-bottom: 2;
color: #373737;
font-weight: 500;
opacity: .8;
margin-top: 20;
`

export const SimpleContainer = styled.TouchableOpacity`
height: 40;
width: 100%;
flex-direction: row;
align-items: center;
padding-horizontal: 14;
background-color: white;
border-bottom-width: 1;
border-bottom-color: ${grey100.color};
border-top-width: ${props => Number(props.index) === 0 ? 1 : 0};
border-top-color: ${grey100.color};
`

export const OptionSimpleText = styled.Text`
font-size: 14;
color: ${slate.color};
opacity: 0.8;
margin-left: 10;
`