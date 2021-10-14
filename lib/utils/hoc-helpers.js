import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

export function injectStyles(WrappedComponent, defaultStyles = {}) {
  return class WrappedWithStyles extends Component {
    static displayName = `injectStyles(${_getDisplayName(WrappedComponent)})`;

    render() {
      const {
        style,
        ...otherProps
      } = this.props;

      let mergedStyles = {};
      const overrides = style || {};
      Object.keys(defaultStyles).forEach( key => {
        if(overrides[key]) {
          mergedStyles[key] = StyleSheet.flatten([defaultStyles[key], overrides[key]]);
        } else {
          mergedStyles[key] = defaultStyles[key];
        }
      });

      return (
        <WrappedComponent {...otherProps} style={mergedStyles} />
      );
    }
  }
}

function _getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName ||
         WrappedComponent.name ||
         'Component'
}
