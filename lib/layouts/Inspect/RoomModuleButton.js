import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import IcoMoonIcon from 'rc-mobile-base/lib/components/IcoMoonIcon';

class RoomModuleButton extends Component {

  render() {
    const { baseColor, label, icon, isCustom } = this.props;

    let buttonIcon;
    switch(icon) {
      case "pencil":
        buttonIcon = require('../../images/icons/pencil.png'); break;
      case "gallery":
        buttonIcon = require('../../images/icons/gallery.png'); break;
      case "book":
        buttonIcon = require('../../images/icons/book.png'); break;
      case "plus-minus":
        buttonIcon = require('../../images/icons/plus-minus.png'); break;
      case "alert":
        buttonIcon = require('../../images/icons/alert.png'); break;
      case "send":
        buttonIcon = require('../../images/icons/send.png'); break;
      case "complaint":
        buttonIcon = require('../../images/icons/complaint.png'); break;
      default:
        buttonIcon = null;
    }

    return (
      <TouchableOpacity style={[styles.container, { backgroundColor: baseColor }]} onPress={this.props.onPress}>
        <View style={[styles.iconContainer, { backgroundColor: baseColor }]}>
          { isCustom ?
            <IcoMoonIcon name={icon} size={40} color='white' /> :
            <Icon name={icon} size={28} color='white' />
          }

        </View>
        <View style={[styles.textContainer,]}>
          <Text style={styles.labelText}>{ label.toUpperCase() }</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    borderRadius: 3,
    borderColor: 'rgba(0,0,0,.03)',
    borderWidth: 1,
    alignItems: 'center'
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textContainer: {
    marginBottom: 5
  },
  labelText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center'
  }
});

export default RoomModuleButton;
