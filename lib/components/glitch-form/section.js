import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import * as Colors from 'rc-mobile-base/lib/styles';

class Section extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.props.title.toUpperCase()}</Text>
        <View style={styles.content}>
          {this.props.children}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  title: {
    color: Colors.greyDk.color,
    marginLeft: 12,
    marginBottom: 5,
  },
  content: {
    backgroundColor: Colors.white.color,
    padding: 12,
  },
});

export default Section;
