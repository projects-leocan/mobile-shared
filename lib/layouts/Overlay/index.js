import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import Spinner from 'react-native-spinkit';

import { connect } from 'react-redux';
import OverlayActions from 'rc-mobile-base/lib/actions/overlay';

class OverlayLayout extends Component {

  componentWillUpdate(nextProps) {
    if (!this.props.overlay.isVisible && nextProps.overlay.isVisible) {
      this.timer = setTimeout(() => {
        this.props.turnOff()
      }, 5000);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    const { isVisible, icon, message, color } = this.props.overlay;

    if (!isVisible) {
      return null;
    }

    return (
      <TouchableOpacity style={styles.container} onPress={() => this.props.turnOff()}>
        <View style={[styles.underlay, color ? { backgroundColor: color } : null]}></View>
        <View style={styles.topLayer}>
          <Spinner style={styles.spinner} isVisible={true} size={100} type={icon || 'Bounce'} color={"#FFFFFF"}/>
          <Text style={styles.message}>{ message.toUpperCase() }</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  underlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    backgroundColor: '#1A8CFF',
    opacity: .8
  },
  topLayer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 60
  },
  spinner: {
    marginBottom: 50
  },
  message: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center'
  }
});

const mapStateToProps = (state) => {
  return {
    overlay: state.overlay
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    turnOff: () => dispatch(OverlayActions.overlayHide()),
    dispatch
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(OverlayLayout);
