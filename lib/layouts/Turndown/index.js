import React, { Component } from 'react';
import { connect } from 'react-redux';
import UpdatesActions from 'rc-mobile-base/lib/actions/updates';
import { get } from 'lodash';

import Turndown from '../../components/Turndown';

import { computedUserNightRoomsByFloor } from './selectors';

class TurndownLayout extends Component {
  render() {
    const { rooms, roomCategories, turndown, config, roomUpdate, cleanStart, activeRoomId } = this.props;

    return (
      <Turndown
        roomCategories={roomCategories}
        rooms={rooms}
        turndown={turndown}
        // cleanStart={cleanStart}
        config={config}
        navigation={this.props.navigation}
        // roomUpdate={roomUpdate}
      />
    )
  }
}

const mapStateToProps = (state,props) => {

  return {
    rooms: computedUserNightRoomsByFloor(state),
    roomCategories: state.rooms.hotelRoomCategories,
    config: get(state, 'auth.config') || { attendantCancelMinutes: 2 },
    roomUpdate: state.updates,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    // turndown: (roomId, value) => dispatch(UpdatesActions.roomTurndown({ roomId, value })),
    cleanStart: roomId => dispatch(UpdatesActions.nightRoomCleanStart(roomId)),
    turndown: (updateTurnDownStatus) => dispatch(UpdatesActions.roomTurndown({ updateTurnDownStatus })),
    dispatch
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(TurndownLayout);
