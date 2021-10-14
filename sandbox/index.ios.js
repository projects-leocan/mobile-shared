/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';

import App from './src/app';
import store from './src/store';

class sandbox extends Component {
  render() {
    return <App store={store()} />
  }
}

AppRegistry.registerComponent('sandbox', () => sandbox);
