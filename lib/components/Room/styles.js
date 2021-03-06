import styled, { css } from 'styled-components/native';
import UserTouchable from '../UserTouchable';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import {
  slate,
  grey400
} from 'rc-mobile-base/lib/styles';

const yellowLT = '#ffdd86';
const yellowDK = '#f3bb2b';
const yellow = '#faca59';

const white = '#ffffff';
const yellowELT = '#fff6de';
const blueLT = '#e1f1ff';

export const Base = styled.TouchableOpacity`
  border-width: 1;
  border-color: rgba(151,151,151,.2);
  padding: 12px;
  margin-horizontal: 6;
  background-color: white;
  margin-bottom: 2;
`

export const Container = styled.View`
  min-height: 50;
  flex-direction: row;
  align-items: center;
`

export const NameContainer = styled.View`
  min-height: 25;
  max-width: 65%;
  padding-horizontal: 8px;
  justify-content: flex-start;
`

export const NameText = styled.Text`
  font-size: ${20};
  font-weight: ${'bold'};
  color: ${props => props.color || slate.color};
`

export const GuestContainer = styled.View`
  border-color: white;
  justify-content: center;
  align-items: center;
  align-self: flex-start;
  margin-right: 5;
  background-color: white;
  padding-left: ${props => props.isPriority ? 8 : 0};
  padding-right: 8px;
  height: 25;
`

export const GuestText = styled.Text`
  font-weight: bold;
  font-size: 15;
  color: ${slate.color};
  text-align: center;
`

export const StatusContainer = styled.View`
  height: 25;
  width: 35;
  justify-content: center;
  align-items: center;
  align-self: flex-start;
  background-color: ${props => props.status ? 'white' : 'transparent'};
  margin-horizontal: 5px;
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
//

export const LeftContainer = styled.View`
  flex: 1;
`;

export const RightContainer = styled.View`
  max-width: ${wp('30%')};
`;

export const LeftTopSection = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
`;

export const LeftCenterContainer = styled.View`
  padding-vertical: 8px;
  padding-top: 16px;
`;

export const LeftBottomContainer = styled.View`
  padding-top: 8px;
  flex-wrap: wrap;
`;

export const LocationText = styled.Text`
  text-align: left;
  font-size: 15;
`;

export const ETAContainer = styled.View`
  min-height: 25;
  border-radius: 5px;
  width: auto;
  background-color: ${props => props.isPriority ? yellowLT : yellowELT};
  padding-vertical: 5px;
  padding-horizontal: 8px;
  margin-right: 5px;
`;

export const ETAText = styled.Text`
  text-align: center;
  font-size: 16;
`;

export const EmptyETA = styled.View`
  height: 25;
  background-color: transparent;
`;

export const CleaningNameContainer = styled.View`
  flex: 1;
`;

export const GuestExactStatus = styled.View`
  min-height: 25;
  border-radius: 5px;
  width: auto;
  background-color: ${props => props.isPriority ? yellowLT : yellowELT};
  padding-vertical: 5px;
  padding-horizontal: 8px;
`;

export const RightCenterContainer = styled.View`
  flex: 1;
  width: 100%;
  flex-direction: row;
  align-items: flex-start; 
  justify-content: flex-start;
  margin-vertical: 8px;
`;

export const VipContainer = styled.View`
  height: 20;
  width: auto;
  background-color: ${props => props.bgColor || 'transparent'}; 
  border-radius: 5px;
  align-items: center;
  align-self: center;
  justify-content: center;
  padding-horizontal: 5px;
`;

export const VipText = styled.Text`
  text-align: center;
  align-self: center;
  justify-content: center;
  font-size: 11;
  font-weight: 600;
  color: ${white};
`;

export const BedSheetContainer = styled.View`
  padding: 5px;
  align-items: center;
  align-self: center;
`;

export const LocatorProceedImage = styled.Image`
  height: 34;
  width: 34;
  resize-mode: contain;
  margin-right: 20px;
`;