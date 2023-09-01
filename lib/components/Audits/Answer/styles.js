import React from 'react';
import styled, { css } from 'styled-components/native';
// import Option from './Option';

export const Container = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: flex-start;

  ${props => props.card && css`
    flex: 0;
    justify-content: flex-start;
    flex-wrap: wrap;
  `}
`

export const OptionWrapper = styled.TouchableOpacity`
  margin: 0;
  padding: 11px 21px;
  overflow: hidden;
  background: #e0e1e2;
  min-height: 14px;
  margin-right: 2px;
  margin-bottom: 2px;
  position: relative;

  ${
    props => props.active && css`
      background: #66A2EA;
    `
  }

  ${props => props.card && css`
    justify-content: center;
    align-items: center;
  `}
`

export const OptionText = styled.Text`
  font-weight: 700;
  color: rgba(0, 0, 0, 0.8);
  font-size: 12px;
  text-align: center;

  ${
    props => props.active && css`
      color: #fff;
    `
  }

  ${props => props.card && css`
    font-size: 16px;
  `}
`

export class Option extends React.Component {
  render() {
    const { children, ...props } = this.props
    return (
      <OptionWrapper {...props}>
        <OptionText active={props.active} card={props.card}>
          {children}
        </OptionText>
      </OptionWrapper>
    )
  }
}

export const MultipleOption = styled(Option)`
  ${props => props.card && css`
    width: 100%;
  `}
`

export const YesOption = styled(Option)`
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  ${
    props => props.active && css`
      background: #5DB649;
    `
  }
  
  ${
    props => props.card && css`
      width: 49%;
    `
  }
`

export const NoOption = styled(Option)`
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  ${
    props => props.active && css`
      background: #D6393A;
    `
  }
  ${
    props => props.card && css`
      width: 49%;
    `
  }
`

export const MultipleContainer = styled(Container)`
  ${props => props.card && css`
    flex-wrap: wrap;
    flex-direction: row;
  `}
`

export const TFContainer = styled.View`
  width: 90px;
  margin-right: 5px;
`

export const TFLabel = styled.Text`
  margin-bottom: 0px;
  width: 100%;
  font-size: 12px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.87);
  textAlign: center;

  ${props => props.card && css`
    margin-bottom: 10px;
  `}
`

export const TFValue = styled.View`
  height: 36px;
  background-color: rgb(240, 240, 240);
  position: relative;
  border-radius: 18px;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(34, 36, 38, 0.15);
`

export const TFItem = styled.TouchableOpacity`
  position: absolute;
  width: 32px;
  height: 32px;
  background-color: rgb(158, 158, 158);
  margin: 1px;
  border-radius: 16px;
  justify-content: center;
  align-items: center;
`

export const TFTrue = styled(TFItem)`
  left: 0;
  ${props => props.active && css`
    background: #5DB649;
  `}
`

export const TFFalse = styled(TFItem)`
  right: 0;
  ${props => props.active && css`
    background: #D6393A;
  `}
`

export const TFIcon = styled.View`
`

export const MultiTFContainer = styled(Container)`

`

export const Input = styled.TextInput`
  width: 100%;
  border-width: 1px;
  border-color: #E0E1E2;
  color: rgba(0, 0, 0, 0.87);
  padding: 10px;
  height: 40px;
  font-size: 14px;
  border-radius: 4px;
`

export const InputArea = styled.TextInput`
  width: 100%;
  border-width: 1px;
  border-color: #E0E1E2;
  color: rgba(0, 0, 0, 0.87);
  padding: 10px;
  min-height: 80px;
  font-size: 14px;
  border-radius: 4px;
`

export const RangeContainer = styled(Container)`
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;

  ${props => props.card && css`
    width: 100%;
    flex-direction: column;
  `}
`

export const RangeTextContainer = styled.View`
${props => props.card && css`
  width: 100%;
  height: 30px;
  justify-content: center;
  align-items: center;
  `}
`

export const CheckBoxRootContainer = styled.View`
  flex-grow: 1;
  min-height: 50px;
`

export const CheckBoxContentContainer = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
  align-items: center;
`

export const CheckBoxText = styled.Text`
  font-weight: 700;
  color: rgba(0, 0, 0, 0.8);
  font-size: 12px;
  text-align: center;
`