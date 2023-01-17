import styled, { css } from 'styled-components/native';

export const Container = styled.View`
  margin-bottom: 10px;
  flex-direction: column;
`

export const QuestionWrapper = styled.View`
  flex-direction: row;
  overflow: hidden;
  background-color: #fff;
  padding: 15px;
  align-items: center;

  shadow-color: #000000;
  shadow-radius: 2;
  shadow-opacity: 1.0;
  shadow-offset: 3px;

  ${props => props.card && css`
    flex-direction: column;
    height: 200;
  `}
`

export const Question = styled.Text`
  flex: 2;
  font-size: 16;
  color: #222222;
  font-weight: bold;

  ${props => props.card && css`
    flex: 1;
    font-size: 16;
    font-weight: normal;
  `}
`

export const Comment = styled.Text`
  font-size: 14;
  color: #ADADAD;
  margin: 0px 10px;
  
  flex: 1;

  ${props => props.card && css`
    margin: 0px;
  `}

  ${props => !props.card && css`
    flex: 2;
  `}
`

export const AnswerWrapper = styled.View`
  flex-direction: row;
  flex: 4;
  margin-left: 10px;
  margin-right: 20px;

  ${props => props.card && css`
    flex-direction: row;
    margin-left: 0px;
    margin-right: 0px;
    margin-bottom: 20px;
    margin-top: 10px;
  `}
`

export const HotAnswerWrapper = styled.View`
  flex-direction: row;
  overflow: hidden;
  background-color: #fff;
  padding: 15px;
  height: 70px;
  align-items: center;

  shadow-color: #000000;
  shadow-radius: 2;
  shadow-opacity: 1.0;
  shadow-offset: 3px;

  border-top-width: 1px;
  border-top-color: #CDCDCD;

  ${props => props.card && css`
    flex-direction: column;
    flex: 1;
    height: 110px;
  `}
`

export const HotAnswerText = styled.Text`
  font-size: 15;
  color: #222222;

  ${props => props.card && css`
    flex: 1;
    flex-direction: row;
    margin-bottom: 15px;
  `}
`

export const Buttons = styled.View`
  margin-left: 30px;
  flex-direction: row;

  ${props => props.card && css`
    margin-left: 0px;
  `}
`

export const Button = styled.TouchableOpacity`
  margin: 0;
  padding: 11px 21px;

  overflow: hidden;

  background: #e0e1e2;
  min-height: 30px;
  margin-right: 1px;
  position: relative;

  ${
    props => props.active && css`
    `
  }
`

export const YesButton = styled(Button)`
  border-top-left-radius: 4;
  border-bottom-left-radius: 4;
  ${
    props => props.active && css`
      background: #5DB649;
    `
  }
`

export const NoButton = styled(Button)`
  border-top-right-radius: 4;
  border-bottom-right-radius: 4;
  ${
    props => props.active && css`
      background: #D6393A;
    `
  }
`

export const ButtonText = styled.Text`
  font-weight: 700;
  color: rgba(0, 0, 0, 0.8);
  font-size: 12;
  text-align: center;

  ${
    props => props.active && css`
      color: #fff;
    `
  }
`

export const Content = styled.View`
  flex: 4;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: 10px;

  ${props => props.card && css`
    flex-direction: column;
    margin-bottom: 15px;
  `}
`