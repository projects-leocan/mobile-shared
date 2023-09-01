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
  border-width: 1px;
  border-color: rgba(151,151,151,.2);
  padding: 12px;
  margin-horizontal: 6px;
  background-color: white;
  margin-bottom: 2px;
`
export const Container = styled.View`
  min-height: 50px;
  flex-direction: row;
  align-items: center;
`

export const LeftContainer = styled.View`
  flex: 1;
  flex-wrap: wrap;
`;

export const RightContainer = styled.View`
  min-width: ${wp('30%')}px;
  align-items: flex-end;
  justify-content: flex-end;
`;

export const LocationLabelContainer = styled.View`
height: 100%;
justifyContent:center
`;

export const LocationText = styled.Text`
  text-align: left;
  font-size: 15px;
`;

export const RoomInfoContainer = styled.View`
  min-height: 50px;
  flex-direction: row;
  align-items: center;
`;

export const NameContainer = styled.View`
  min-height: 25px;
  width: 100%;
  padding-right: 8px;
  justify-content: flex-start;
  alignItem: center;
`

export const NameText = styled.Text`
  font-size: ${27}px;
  font-weight: ${'bold'};
  color: ${props => props.color || slate.color};
`

export const SpecialInfoContainer = styled.View`
  margin-left: 6px;
  align-items: center;
  justify-content: center;
`;

export const VipContainer = styled.View`
  height: 20px;
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
  font-size: 11px;
  font-weight: 600;
  color: ${white};
`;

export const MemberShipText = styled.Text`
font-size: 14px;
font-weight: 600;
color:black;
`

export const BedSheetContainer = styled.View`
  padding: 5px;
  align-items: center;
  align-self: center;
`;

export const RoomStatusOuterContainer = styled.View`
  padding-top: 8px;
`;

export const RoomStatusContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

export const RoomStatusText = styled.Text`
  text-align: center;
  font-size: 22px;
  font-weight: ${'600'};
`;

export const ETAContainer = styled.View`
  min-height: 25px;
  border-radius: 5px;
  width: auto;
  background-color: ${props => props.isPriority ? yellowLT : yellowELT};
  padding-vertical: 5px;
  padding-horizontal: 8px;
  margin-horizontal: 5px;
`;

export const ETAText = styled.Text`
  text-align: center;
  font-size: 16px;
`;

export const RoomCategoryContainer = styled.View`
  height: auto;
  width: 100%;
  padding-top: 12px;
`;

export const CategoryLabel = styled.Text`
  text-align: left;
  font-size: 15px;
`;

export const CleaningNameContainer = styled.View`
  flex: 1;
`;

export const GuestExactStatus = styled.View`
  min-height: 25px;
  border-radius: 5px;
  width: auto;
  background-color: ${props => props.isPriority ? yellowLT : yellowELT};
  padding-vertical: 5px;
  padding-horizontal: 8px;
`;

export const GuestExactStatusLabel = styled.Text`
  text-align: center;
  font-size: 18px;
`;

export const StatusContainer = styled.View`
  justify-content: center;
  align-items: center;
  align-self: flex-start;
  background-color: ${props => props.status ? 'white' : 'transparent'};
  margin-horizontal: 5px;
`

export const LocatorProceedImage = styled.Image`
  height: 40px;
  width: 40px;
  resize-mode: contain;
  margin-right: 20px;
`;

export const ExtraContainer = styled.View`
  width: 70px;
  align-items: flex-end;
  justify-content: flex-end;
  flex-direction: row;
`

export const SpecialText = styled.Text`
  font-size: 11px;
  font-weight: bold;
  background-color: ${props => props.color || slate.color};
  color: white;
  padding-horizontal: 8px;
  padding-vertical: 4px;
  border-radius: 2px;
`

export const CleaningStatusContainer = styled.View`
  margin-right: 8px;
`;

export const PlaceHolderView = styled.View`
  flex: 0.3;
`;

export const CleaningNameContainerInner = styled.View`
padding:4px
borderRadius:20px
`

export const TopView = styled.View`
flex: 1;
flex-direction: row;
`

export const CenterView = styled.View`
flex: 1;
flex-direction: row;
paddingTop:6px;
`

export const BottomView = styled.View`
flex: 1;
flex-direction: row;
`

export const InnerView = styled.View`
flex: 1;
`

export const BabyImage = styled.Image`
height:30px;
width:30px;
marginRight:20px;
`