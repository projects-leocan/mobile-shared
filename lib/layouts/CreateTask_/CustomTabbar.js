import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

class FacebookTabBar extends Component {
  tabIcons = []


  componentDidMount() {
    this._listener = this.props.scrollValue.addListener(this.setAnimationValue);
  }

  setAnimationValue = ({ value }) => {
    this.tabIcons.forEach((icon, i) => {
      const progress = (value - i >= 0 && value - i <= 1) ? value - i : 1;
      try {
        icon.setNativeProps({
          style: {
            color: this.iconColor(progress),
          },
        });
      } catch (error) {
        console.log(error)
      }
    });
  }

  //color between rgb(59,89,152) and rgb(204,204,204)
  // rgb(46,75,141)
  iconColor = (progress) => {
    const red = 46 + (204 - 46) * progress;
    const green = 75 + (204 - 75) * progress;
    const blue = 141 + (204 - 141) * progress;
    return `rgb(${red}, ${green}, ${blue})`;
  }

  render() {
    return <View style={[styles.tabs, this.props.style, ]}>
      {this.props.tabs.map((tab, i) => {
        return <TouchableOpacity key={tab} onPress={() => this.props.goToPage(i)} style={styles.tab}>
          <Icon
            name={tab}
            size={22}
            color={this.props.activeTab === i ? 'rgb(46,75,141)' : 'rgb(204,204,204)'}
            ref={(icon) => { this.tabIcons[i] = icon; }}
          />
        </TouchableOpacity>;
      })}
    </View>;
  }
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  tabs: {
    height: 45,
    flexDirection: 'row',
    paddingTop: 10,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    backgroundColor: 'white'
  },
});

export default FacebookTabBar;
