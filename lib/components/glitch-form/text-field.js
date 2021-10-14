import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
} from 'react-native';

const TextField = (props) => {
  const {
    style,
    input: { value, onChange, onBlur },
    meta: { error, touched },
    ...otherProps,
  } = props;

  return (
    <TextInput
      style={style}
      underlineColorAndroid="transparent"
      onChangeText={text => onChange(text)}
      onBlur={ text => onBlur(text)}
      value={value}
      selectTextOnFocus
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  input: {

  },
});

export default TextField;
