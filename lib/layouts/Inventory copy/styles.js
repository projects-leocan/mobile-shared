import styled from 'styled-components/native';

import {
  slate,
  green,
  red
} from 'rc-mobile-base/lib/styles';

export const ModalContainer = styled.View`
  width: 300;
  height: 100%;
  background-color: white;
`

export const ModalSpacer = styled.View`
  flex: 1;
`

export const ModalContent = styled.ScrollView`
  flex: 1;
`

export const ModalRow = styled.View`
  flex-direction: row;
  height: 80;
  align-items: center;
`

export const ModalRowImage = styled.Image`
  height: 80;
  width: 80;
`

export const ModalRowTextContainer = styled.View`
  align-items: center;
  flex: 1;
  padding-vertical: 8;
  padding-horizontal: 8;
`

export const ModalRowText = styled.Text`
  color: ${slate.color};
  opacity: .7;
`

export const ModalRowChangeContainer = styled.View`
  height: 80;
  width: 80;
  justify-content: center;
  align-items: center;
`

export const ModalRowChange = styled.Text`
  color: ${props => props.isWithdrawal ? green.color : red.color };
  font-size: 21;
  font-weight: bold;
`

export const OptionsRow = styled.View`
  background-color: #F7F7F7;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-vertical: 10;
`

export const OptionsButton = styled.TouchableOpacity`
  width: 100;
  height: 50;
  margin-horizontal: 4;
  border-radius: 4;
  background-color: ${props => props.isConfirm ? green.color : red.color };
  justify-content: center;
  align-items: center;
`

export const OptionsButtonText = styled.Text`
  color: white;
  font-weight: bold;
`

export const RowCountsContainner = styled.View`
  flex-direction: row;
  align-items: center;
`