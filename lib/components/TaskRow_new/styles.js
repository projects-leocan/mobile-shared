import styled from 'styled-components/native';
import { blue500, white, grey600, black } from 'rc-mobile-base/lib/styles';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const Container = styled.View`
  display: flex;
  flex: 1;
  background-color: #F0F0F0;
`

export const Title = styled.Text`
  height: 44px;
  line-height: 44px;
  background-color: #1A8CFF;
  text-align: center;
  color: #fff;
  font-size: 15px;
`

export const Row = styled.TouchableOpacity`
  position: relative;
  min-Height: ${hp('18%')};
  background-color: ${white.color};
  margin-vertical: 8px;
  border-radius: 8px;
  padding-horizontal: 3px;
  overflow: hidden;
`

export const RowInner = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  background-color: ${white.color};
  border-radius: 8px;
  overflow: hidden;
`

export const ItemImageContainer = styled.View`
  flex: 0.33;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  background-color: ${grey600.color};
  overflow: hidden;
`;

export const ItemImage = styled.Image`
  flex: 1;
  height: ${hp('18%')};
  width: 100%;
  resize-mode: contain;
  align-self: center;
`;

export const PlaceHolderItemImage = styled.Image`
  flex: 1;
  height: ${hp('18%')};
  width: 100%;
  resize-mode: cover;
  align-self: center;
`;

export const ItemBodyContainer = styled.View`
  flex: 0.67;
  padding: 14px;
`;

export const TaskNameLabel = styled.Text`
  font-size: 20px;
  color: ${black.color};
  font-weight: 500;
  line-height: 35px;
`;

export const FromNowText = styled.Text`
  font-size: 16px;
  color: #4A4A4A;
  line-height: 25px;
`

export const StatusContainer = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

export const StatusLeftContainer = styled.View`
  flex: 0.6;
  flex-direction: row;
`;

export const StatusPending = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: #C93C46;
`;

export const StatusText = styled.Text`
  font-size: 20px;
  margin-left: 8px;
  font-weight: 500;
  color: ${black.color}
`;

export const StatusRightContainer = styled.View`
  flex: 0.4;
  flex-direction: row;
  justify-content: space-evenly;
`;

export const HorizontalContainer = styled.View`
  flex-direction: row;
`;

export const ChatIcon = styled.Image`
  height: 25;
  width: 25;
  resize-mode: contain;
`;