import styled, { css } from 'styled-components/native';

export const Actions = styled.View`
  flex: 0.7;
  flex-direction: row;
  justify-content: center;
  margin-right: 5px;

  ${props => props.card && css`
    flex: 0;
    flex-direction: column;
    margin-right: 0px;
    margin-top: 16;
    width: 100%;
  `}
`

export const ActionWrapper = styled.TouchableOpacity`
  background-color: transparent;
  align-items: center;
  
  ${props => props.card && css`
    justify-content: center;
    margin-bottom: 8;
    width: 100%;
  `}
`

export const ActionText = styled.Text`
  color: ${props => props.active ? '#222222' : '#B4B4B4'};
  font-size: 12;
  margin-top: 2;
`

export const ModalBackdrop = styled.View`
  background: rgba(0, 0, 0, 0.6);
  flex: 1;
  justify-content: center;
  align-items: center;
`

export const ModalWrapper = styled.View`
  background: #FFF;
  width: 400;
  height: 260;
  border-radius: 5;
`

export const ModalHeader = styled.Text`
  padding: 15px;
  background: #2185D0;
  margin: 0;
  width: 100%;
  font-size: 19;
  color: #FFF;
  text-align: center;
  border-top-left-radius: 5;
  border-top-right-radius: 5;
`

export const ModalContent = styled.View`
  padding: 18px;
  flex: 1;
`

export const ModalInput = styled.TextInput`
  padding: 10px;
  margin: 0;
  width: 100%;
  font-size: 16;
  color: #222222;
  border-width: 1;
  height: 120;
  border-radius: 5;
  border-color: #B4B4B4;
`

export const ModalActions = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: 15px;
  flex-direction: row-reverse;
`

export const ModalButton = styled.TouchableOpacity`
  padding: 12px 16px;
  background-color: #2185d0;
  border-radius: 5;
  justify-content: center;
`

export const ModalLink = styled(ModalButton)`
  background-color: transparent;
`

export const ModalSubmit = styled.Text`
  color: #FFF;
  font-weight: bold;
  font-size: 16;
`

export const ModalCancel = styled(ModalSubmit)`
  color: rgba(0, 0, 0, 0.8);
`

export const ModalPhoto = styled(ModalWrapper)`
  height: 60%;
`

// export const ModalCamera = styled(Camera)`
//   flex: 1;
//   justify-content: flex-end;
//   align-items: center;
// `

export const ModalCapture = styled.TouchableOpacity`
  padding: 8px 16px;
  background-color: #FFF;
  height: 45;
  position: absolute;
  bottom: 15;
  justify-content: center;
  align-items: center;
  border-radius: 27;
`

export const ModalPreview = styled.Image`
  flex: 1;
`

export const Thumb = styled.Image`
  width: 24;
  height: 24;
  border-radius: 4;
`