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

export const LeftContainer = styled.View`
  flex: 1;
  flex-wrap: wrap;
`;

export const RightContainer = styled.View`
  min-width: ${wp('30%')};
  align-items: flex-end;
  justify-content: flex-end;
`;

export const LocationLabelContainer = styled.View`
  padding-bottom: 8px;
`;

export const LocationText = styled.Text`
  text-align: left;
  font-size: 15;
`;

export const RoomInfoContainer = styled.View`
  min-height: 50;
  flex-direction: row;
  align-items: center;
`;

export const NameContainer = styled.View`
  min-height: 25;
  max-width: 65%;
  padding-right: 8px;
  justify-content: flex-start;
`

export const NameText = styled.Text`
  font-size: ${30};
  font-weight: ${'bold'};
  color: ${props => props.color || slate.color};
`

export const SpecialInfoContainer = styled.View`
  margin-left: 6px;
  align-items: center;
  justify-content: center;
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

export const RoomStatusOuterContainer = styled.View`
  padding-top: 8px;
  flex-wrap: wrap;
`;

export const RoomStatusContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

export const RoomStatusText = styled.Text`
  text-align: center;
  font-size: 22;
  font-weight: ${'600'};
`;

export const ETAContainer = styled.View`
  min-height: 25;
  border-radius: 5px;
  width: auto;
  background-color: ${props => props.isPriority ? yellowLT : yellowELT};
  padding-vertical: 5px;
  padding-horizontal: 8px;
  margin-horizontal: 5px;
`;

export const ETAText = styled.Text`
  text-align: center;
  font-size: 16;
`;

export const RoomCategoryContainer = styled.View`
  height: auto;
  width: 100%;
  padding-top: 12px;
`;

export const CategoryLabel = styled.Text`
  text-align: left;
  font-size: 15;
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

export const GuestExactStatusLabel = styled.Text`
  text-align: center;
  font-size: 18;
`;

export const StatusContainer = styled.View`
  justify-content: center;
  align-items: center;
  align-self: flex-start;
  background-color: ${props => props.status ? 'white' : 'transparent'};
  margin-horizontal: 5px;
`

export const LocatorProceedImage = styled.Image`
  height: 40;
  width: 40;
  resize-mode: contain;
  margin-right: 20px;
`;

export const ExtraContainer = styled.View`
  width: 70;
  flex: 1;
  margin-top: 12px;
  align-items: flex-end;
  justify-content: flex-end;
  flex-direction: row;
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

export const CleaningStatusContainer = styled.View`
  margin-right: 8px;
`;

export const PlaceHolderView = styled.View`
  flex: 0.3;
`;