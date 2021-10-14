import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import Modal from 'react-native-modalbox';

import {
  slate,
  red
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