import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux'
import { isEmpty, get, find } from 'lodash';
import { createStructuredSelector } from 'reselect';
import { change } from 'redux-form';

import Screen from '../../components/Screen';
import { userSelector } from '../../selectors/auth';
import UpdatesActions from '../../actions/updates';

import Form from './Form';
import { usersSelector, defaultUserSelector, defaultAttendantSelector, locationsSelector } from './selectors';
import { buildNotifications } from './utils';

class CreateNotificationLayout extends Component {
  
  state = {
    setLocation: null
  }
  
  handleSubmit = (values) => {
    const { users, createNotification, navigation } = this.props
    const notifications = buildNotifications(values, users)
    notifications.map(createNotification)
    navigation.goBack();
  }

  componentDidMount() {
    const roomId = get(this.props, 'navigation.state.params.roomId', null);
    if (!roomId) return;

    const { locations } = this.props;
    const room = find(locations, { _id: roomId });
    if (!room) return;

    this.setState({ setLocation: room })
  }

  render() {
    const { users, defaultUser, locations } = this.props
    const { setLocation } = this.state;

    return (
      <Screen>
        <Form
          initialValues={{user: defaultUser}}
          users={users}
          locations={locations}
          setLocation={setLocation}
          onSubmit={this.handleSubmit}
        />
      </Screen>
    )
  }
}

const mapStateToProps = (state, props) => {
  const isAttendantApp = get(props, 'screenProps.isAttendantApp') || false;
  
  return {
    users: usersSelector(state),
    defaultUser: isAttendantApp ? defaultAttendantSelector(state) : defaultUserSelector(state),
    locations: locationsSelector(state),
  }
}

const mapDispatchToProps = (dispatch) => ({
  createNotification: (props) => dispatch(UpdatesActions.notificationCreate(props)),
  dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateNotificationLayout);
