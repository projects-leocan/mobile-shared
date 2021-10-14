import React, { Component } from 'react';
import { View } from 'react-native';

export class Toggler extends Component {
  state = {
    isVisible: false
  }

  toggle = () => this.setState({ isVisible: !this.state.isVisible })

  render() {
    const { renderOpener, renderContent, style, hideOpener } = this.props;
    const isVisible = this.state.isVisible;

    return (
      <View>
        {
          hideOpener && isVisible ? null : renderOpener(this.toggle)
        }
        {
          isVisible && 
            <View style={style}>
              {renderContent(this.toggle)}
            </View>
        }
      </View>
    )
  }
}

export default Toggler
