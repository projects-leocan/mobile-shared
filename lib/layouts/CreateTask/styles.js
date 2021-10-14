import styled, { css } from 'styled-components/native';
import { Dimensions } from 'react-native';
import Modal from 'react-native-modalbox';

import {
  slate,
  red,
  greyDk,
  grey,
  blueLt
} from 'rc-mobile-base/lib/styles';

const window = Dimensions.get('window')
const modalWidth = window.width > window.height ? window.width * 0.45 : window.width * 0.75;

export const WarningModal = styled(Modal)`
  justify-content: flex-start;
  align-items: center;
  background-color: white;
  padding-bottom: 5;
  border-radius: 5;
  height: 260;
  width: ${modalWidth};
`

export const WarningModalContainer = styled.View`
  height: 260;
  width: ${modalWidth};
  background-color: white;
`

export const WarningModalLabel = styled.Text`
  color: ${slate.color};
`

export const WarningContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-horizontal: 20;
  padding-vertical: 20;
`

export const WarningMessage = styled.Text`
  color: ${red.color};
  font-weight: bold;
  text-align: center;
`

export const Container = styled.View`
  flex: 1;
`

export const RecentlyTaskedHeaderContainer = styled.View`
  margin-top: 40;
  margin-left: 15;
  margin-bottom: 10;
`

export const RecentlyTaskedHeader = styled.Text`
  color: ${greyDk.color};
  font-weight: bold;
`

export const RecentlyTaskedContainer = styled.TouchableOpacity`
  background-color: white;
  height: 50;
  padding-horizontal: 15;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 1;
  border-bottom-color: ${grey.color};

  ${props => props.isTop && css`
    border-top-width: 1;
    border-top-color: ${grey.color};
  `}
`

export const RecentlyTaskedLabel = styled.Text`
  color: ${slate.color};
`

export const RecentlyTaskedSkipButton = styled.TouchableOpacity`
  background-color: ${blueLt.color};
  height: 50;
  align-items: center;
  justify-content: center;
`

export const RecentlyTaskedSkipText = styled.Text`
  color: white;
  font-weight: bold;
`

export const RecentlyTaskedSpacer = styled.View`
  flex: 1;
`