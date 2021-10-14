import React, { Component } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ActionButton from 'react-native-action-button';
import { connect } from 'react-redux';
import { get } from 'lodash';

import Subheader from './Subheader';

import {
  blue
} from 'rc-mobile-base/lib/styles';

import {
  Container,
} from './styles';

class MaintenancesLayout extends Component {

  state = {
    activeTab: 'today'
  }

  _handleTab = (option) => this.setState({ activeTab: option })

  render() {
    return (
      <Container>
        <Subheader
          options={['today', 'backlog']}
          activeTab={this.state.activeTab}
          handle={this._handleTab}
          />
      </Container>
    )
  }
}

const mapStateToProps = (state, props) => {
  // const roomId = props.navigation.state.params.roomId
  const roomId = get(props, 'navigation.stsate.params.roomId', null);

  return {

  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(MaintenancesLayout);
