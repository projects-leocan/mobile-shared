import styled, { css } from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #F2F2F2;
  align-items: center;
`

export const Section = styled.Text`
  background-color: #F2F2F2;
  margin: 0;
  padding-top: 15px;
  padding-bottom: 10px;
  padding-left: 15px;
  font-size: 20;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.87);
`

export const MobileSection = styled.Text`
  background-color: #F2F2F2;
  margin: 0;
  padding-top: 15px;
  padding-bottom: 10px;
  padding-left: 0px;
  font-size: 14;
  font-weight: 500;
  color: #4A4A4A;
`

export const Header = styled.Text`
  padding: 20px 10px;
  background: #FFF;
  margin: 0;
  width: 100%;
  font-size: 18;
  color: rgba(0, 0, 0, 0.87);
  text-align: center;

  ${props => props.narrow && css`
    padding: 12px 6px;
  `}
`

export const Content = styled.View`
  flex: 1;
  width: 100%;
  padding: 0px 40px;
  margin-bottom: 60px;

  ${props => props.narrow && css`
      padding: 0px 15px;
      margin-bottom: 0px;
  `}
`

export const ContentFooter = styled.View`
  height: 32px;
`

export const Button = styled.TouchableOpacity`
  padding: 20px 50px;
  margin: 0 5px;
  background-color: #2FC320;
  border-radius: 5;
  justify-content: center;

  ${props => props.disabled && css`
    background-color: #B4B4B4;
  `}

  ${props => props.narrow && css`
      padding: 12px;
  `}
`

export const CancelButton = styled(Button)`
  background-color: #FEA300;
  ${props => props.disabled && css`
    background-color: #B4B4B4;
  `}
`

export const PauseButton = styled(Button)`
  background-color: #0099FF;
  ${props => props.disabled && css`
    background-color: #B4B4B4;
  `}
`

export const RemoveButton = styled(Button)`
  background-color: #D6393A;
  ${props => props.disabled && css`
    background-color: #B4B4B4;
  `}
`

export const ButtonText = styled.Text`
  color: #FFF;
  font-weight: bold;
  font-size: 18;

  ${props => props.narrow && css`
      font-size: 14;
  `}
`

export const Buttons = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  flex-direction: row;
  justify-content: center;
  padding: 10px 0px;
  background-color: white;
`

export const Overlay = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  background: #FFF;
  opacity: 0.5;
`

export const Loader = styled.ActivityIndicator`
  padding: 8px;
  height: 80px;
`