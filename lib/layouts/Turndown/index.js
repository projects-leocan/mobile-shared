import React, { Component } from 'react';
import { connect } from 'react-redux';
import UpdatesActions from 'rc-mobile-base/lib/actions/updates';
import { get } from 'lodash';

import Turndown from '../../components/Turndown';

import { computedUserNightRoomsByFloor } from './selectors';

class TurndownLayout extends Component {
  render() {
    const { rooms, roomCategories, turndown, config } = this.props;

    return (
      <Turndown
        roomCategories={roomCategories}
        rooms={rooms}
        turndown={turndown}
        config={config}
        navigation={this.props.navigation}
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    rooms: computedUserNightRoomsByFloor(state),
    roomCategories: state.rooms.hotelRoomCategories,
    config: get(state, 'auth.config') || { attendantCancelMinutes: 2 },
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    turndown: (roomId, value) => dispatch(UpdatesActions.roomTurndown({ roomId, value })),
    dispatch
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(TurndownLayout);
