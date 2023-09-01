import styled from 'styled-components/native';

import {
  slate,
  green,
  red
} from 'rc-mobile-base/lib/styles';

export const ModalContainer = styled.View`
  width: 300px;
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
  height: 80px;
  align-items: center;
`

export const ModalRowImage = styled.Image`
  height: 80px;
  width: 80px;
`

export const ModalRowTextContainer = styled.View`
  align-items: center;
  flex: 1;
  padding-vertical: 8px;
  padding-horizontal: 8px;
`

export const ModalRowText = styled.Text`
  color: ${slate.color};
  opacity: .7;
`

export const ModalRowChangeContainer = styled.View`
  height: 80px;
  width: 80px;
  justify-content: center;
  align-items: center;
`

export const ModalRowChange = styled.Text`
  color: ${props => props.isWithdrawal ? green.color : red.color };
  font-size: 21px;
  font-weight: bold;
`

export const OptionsRow = styled.View`
  background-color: #F7F7F7;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-vertical: 10px;
`

export const OptionsButton = styled.TouchableOpacity`
  width: 100px;
  height: 50px;
  margin-horizontal: 4px;
  border-radius: 4px;
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
  width:15%
  justifyContent:flex-end
`