import styled, { css } from 'styled-components/native';
// import Camera from 'react-native-camera';

export const Actions = styled.View`
  flex: 0.7;
  flex-direction: row;
  justify-content: center;
  margin-right: 5px;

  ${props => props.card && css`
    flex: 0;
    flex-direction: column;
    margin-right: 0px;
    margin-top: 16px;
    width: 100%;
  `}
`

export const ActionWrapper = styled.TouchableOpacity`
  background-color: transparent;
  align-items: center;
  
  ${props => props.card && css`
    justify-content: center;
    margin-bottom: 8px;
    width: 100%;
  `}
`

export const ActionText = styled.Text`
  color: ${props => props.active ? '#222222' : '#B4B4B4'};
  font-size: 12px;
  margin-top: 2px;
`

export const ModalBackdrop = styled.View`
  background: rgba(0, 0, 0, 0.6);
  flex: 1;
  justify-content: center;
  align-items: center;
`

export const ModalWrapper = styled.View`
  background: #FFF;
  width: 400px;
  height: 260px;
  border-radius: 5px;
`

export const ModalHeader = styled.Text`
  padding: 15px;
  background: #2185D0;
  margin: 0;
  width: 100%;
  font-size: 19px;
  color: #FFF;
  text-align: center;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`

export const ModalHeaderSignature = styled.View`
padding: 15px;
background: #2185D0;
margin: 0;
width: 100%;
border-top-left-radius: 5px;
border-top-right-radius: 5px;
`

export const SignatureText = styled.Text`
font-size: 19px;
color: #FFF;
text-align: center;

`

export const ModalContent = styled.View`
  padding: ${props => props.isTablet ? '0px' : '18px'};
  flex: 1;
`

export const ModalInput = styled.TextInput`
  padding: 10px;
  margin: 0;
  width: 100%;
  font-size: 16px;
  color: #222222;
  border-width: 1px;
  height: 120px;
  border-radius: 5px;
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
  border-radius: 5px;
  justify-content: center;
  opacity: ${props => props.disabled ? 0.5 : 1}
`

export const ModalLink = styled(ModalButton)`
  background-color: transparent;
`

export const ModalSubmit = styled.Text`
  color: #FFF;
  font-weight: bold;
  font-size: 16px;
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
  height: 45px;
  position: absolute;
  bottom: 15;
  justify-content: center;
  align-items: center;
  border-radius: 27px;
`

export const ModalPreview = styled.Image`
  flex: 1;
`

export const Thumb = styled.Image`
  width: 24px;
  height: 24px;
  border-radius: 4px;
`

export const SignatureContent = styled.View`
  flex: 1;
  height: 200px;
`

export const SignatureModalWrapper = styled.View`
  background: #FFF;
  height: 450px;
  width: 400px;
  border-radius: 5px;
`

export const SignatureIconContainer = styled.View`
  height: 40px;
  width: 40px;
  align-items: center;
  justify-content: center;
`;

export const SignatureIcon = styled.Image`
  height: 30px;
  width: 30px;
  align-items: center;
  justify-content: center;
`