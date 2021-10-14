import React, { Component } from 'react';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Animated
} from 'react-native';

const ANIMATION_TIMED = 1000;

class AnimatedTouchable extends Component {
  state = {
    pressAction: new Animated.Value(0),
    isActive: false,
    buttonWidth: 0,
    buttonHeight: 0 
  }

  componentWillMount() {
    this._value = 0;
    this.state.pressAction.addListener((v) => this._value = v.value);
  }

  _handlePressIn = () => {
    Animated.timing(this.state.pressAction, {
      duration: ANIMATION_TIMED,
      toValue: 1
    }).start(this.animationActionCompleted);
  }
  _handlePressOut = () => {
    Animated.timing(this.state.pressAction, {
      duration: this._value * ANIMATION_TIMED,
      toValue: 0
    }).start(() => this.setState({ isActive: false }));
  }

  animationActionCompleted = () => {
    const { onPress } = this.props.defaultProps
    if (this._value === 1) {
      onPress && onPress()
    }
  }

  _getButtonWidthLayout = (e) => {
    this.setState({
        buttonWidth: e.nativeEvent.layout.width,
        buttonHeight: e.nativeEvent.layout.height
    });
  }

  _getProgressStyles = () => {
    const width = this.state.pressAction.interpolate({
        inputRange: [0, 1],
        outputRange: [0, this.state.buttonWidth]
    });
    const backgroundColor = this.state.pressAction.interpolate({
        inputRange: [0, 1],
        outputRange: ['transparent', 'white']
    })
    return {
        width,
        backgroundColor,
        height: this.state.buttonHeight,
        opacity: .7
    }
  }

  render() {
    const { children, defaultProps } = this.props;
    
    return (
      <TouchableWithoutFeedback
        onLayout={this._getButtonWidthLayout}
        onPressIn={this._handlePressIn}
        onPressOut={this._handlePressOut}>
        <View style={[defaultProps.style]}>
          { children }
          <Animated.View
            style={[{ position: 'absolute', top: 0, left: 0, bottom: 0 }, this._getProgressStyles()]}
            />
        </View>
      
      </TouchableWithoutFeedback>
    )
  }
}

export default UserTouchable = ({ isLong, children, ...props }) => {  
  if (!isLong) {
    return (
      <TouchableOpacity {...props}>
        { children }
      </TouchableOpacity>
    )
  }

  return (
    <AnimatedTouchable defaultProps={props}>
      { children }
    </AnimatedTouchable>
  )

}