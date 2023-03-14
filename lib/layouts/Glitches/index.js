import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  ListView,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';

import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import { filter, find } from 'lodash/collection';
import moment from 'moment';

import GlitchesActions from 'rc-mobile-base/lib/actions/glitches';
import RoomsActions from 'rc-mobile-base/lib/actions/rooms';
import * as Colors from 'rc-mobile-base/lib/styles';

import { computedAvailableGlitches } from '../../selectors/glitches';

import GlitchesList from './glitches-list';
import Icon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { groupedHotelExperiencesSelector } from './selectors';


class GlitchesLayout extends Component {
  render() {
    const { availableGlitches, userId ,groupedExperiences} = this.props;

    const today = moment().format('YYYY-MM-DD');
    const todayGlitches = filter(availableGlitches, { date: today });
    const openGlitches = filter(availableGlitches, { is_completed: 0 });
    const closedGlitches = filter(availableGlitches, { is_completed: 1 });
    const assignedGlitches = filter(openGlitches, { responsible_id: userId });
    const otherGlitches = filter(openGlitches, glitch => glitch.responsible_id !== userId );

    return (
      <View style={styles.container}>
        <ScrollView>
          {this._renderAllGlitches(availableGlitches) }
          {/* { this._renderAssignedGlitches(assignedGlitches) }
          { this._renderOtherGlitches(otherGlitches) }
          { this._renderClosedGlitches(closedGlitches) } */}
          <View style={styles.empty}></View>
        </ScrollView>
        <TouchableOpacity onPress={this._handleCreateGlitchNavigation} style={styles.circle}>
          <EntypoIcon name="plus" size={32} color="white" style={{backgroundColor: 'transparent'}}/>
        </TouchableOpacity>
      </View>
    );
  }

  _handleGlitchNavigation = (uuid, roomId) => {
    this.props.activateGlitch(uuid);

    if (roomId) {
      this.props.activateRoom(roomId);
    }

    this.props.navigation.navigate('Glitch');
  }

  _handleCreateGlitchNavigation = () => {
    this.props.deactivateGlitch();
    this.props.navigation.navigate('Glitch');
  }

  _renderAllGlitches = (glitches) => {
    if (!glitches || !glitches.length) {
      return null;
    }

    let style = {
      title: { color: Colors.red.color }
    };

    return <GlitchesList title={I18n.t('runner.glitches.index.assigned-glitches')} glitches={glitches} onGlitchPress={this._handleGlitchNavigation} style={style} />;
  }


  _renderAssignedGlitches = (glitches) => {
    if (!glitches || !glitches.length) {
      return null;
    }

    let style = {
      title: { color: Colors.red.color }
    };

    return <GlitchesList title={I18n.t('runner.glitches.index.assigned-glitches')} glitches={glitches} onGlitchPress={this._handleGlitchNavigation} style={style} />;
  }

  _renderOtherGlitches(glitches) {
    if (!glitches || !glitches.length) {
      return null;
    }

    let style = {
      title: { color: Colors.greyDk.color }
    };

    return <GlitchesList title={I18n.t('runner.glitches.index.other-glitches')} glitches={glitches} onGlitchPress={this._handleGlitchNavigation} style={style} />;
  }

  _renderClosedGlitches(glitches) {
    if (!glitches || !glitches.length) {
      return null;
    }

    let style = {
      title: { color: Colors.green.color },
      container: {
        marginBottom: 0,
      }
    };

    return <GlitchesList title={I18n.t('runner.glitches.index.recently-closed')} glitches={glitches} onGlitchPress={this._handleGlitchNavigation} style={style} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    paddingLeft: 4,
    paddingRight: 4,
    paddingBottom: 0,
    backgroundColor: '#F7F7F7',
  },
  circle: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: Colors.blueLt.color,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  button: {
    flex: 1,
  },
  empty: {
    height: 60
  }
});

const mapStateToProps = (state) => {
  return {
    hotelGlitches: state.glitches.hotelGlitches,
    availableGlitches: computedAvailableGlitches(state),
    userId: state.auth.userId,
    groupedExperiences: groupedHotelExperiencesSelector(state)
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    activateRoom: (roomId) => dispatch(RoomsActions.activateRoom(roomId)),
    fetchGlitches: () => dispatch(GlitchesActions.glitchesFetch()),
    activateGlitch: (glitchId) => dispatch(GlitchesActions.glitchActivate(glitchId)),
    deactivateGlitch: () => dispatch(GlitchesActions.glitchDeactivate()),
    dispatch
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(GlitchesLayout);
