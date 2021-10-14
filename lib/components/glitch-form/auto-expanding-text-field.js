import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
} from 'react-native';

class AutoExpandingTextField extends React.Component {
  static defaultProps = {
    minHeight: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      height: this.props.minHeight,
    };
  }

  render() {
    const {
      style,
      input: { value, onChange, onBlur },
      meta: { error, touched },
      minHeight,
      ...otherProps,
    } = this.props;

    return (
      <TextInput
        multiline={true}
        underlineColorAndroid="transparent"
        onChangeText={ text => onChange(text)}
        onBlur={ event => onBlur(event)}
        value={value}
        onContentSizeChange={this._handleContentSizeChange}
        style={[styles.input, style, { height: this.state.height }]}
        {...otherProps}
      />
    );
  }

  _handleContentSizeChange = (event) => {
    const { minHeight } = this.props;
    let height = event.nativeEvent.contentSize.height;

    if(minHeight && height <  minHeight) {
      height = minHeight;
    }
    this.setState({height: height});
  }
}

const styles = StyleSheet.create({
  input: {
    textAlignVertical: 'top',
  },
});

export default AutoExpandingTextField;
