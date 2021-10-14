import React from 'react';
import { TextInput } from 'react-native';

export const TextField = ({ input, onFocus, ...others }) => (
  <TextInput
    onChangeText={text => input.onChange(text)}
    onBlur={text => input.onBlur(text)}
    onFocus={text => input.onFocus(text)}
    value={input.value}
    selectTextOnFocus
    underlineColorAndroid="transparent"
    {...others}
  />
)

export class TextFieldWithRef extends React.Component {
  render() {
    const { input, onFocus, refName, ...others } = this.props;
    return (
      <TextInput
        ref={refName}
        onChangeText={text => input.onChange(text)}
        onBlur={text => input.onBlur(text)}
        onFocus={text => input.onFocus(text)}
        value={input.value}
        selectTextOnFocus
        underlineColorAndroid="transparent"
        {...others}
      />
    )
  }
}

export default TextField
