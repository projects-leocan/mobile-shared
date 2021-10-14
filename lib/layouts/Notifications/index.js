import React, {Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import I18n from 'react-native-i18n'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash/lang';
import { find } from 'lodash/collection';
import { get } from 'lodash/object';

import { createStructuredSelector } from 'reselect';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ActionButton from 'react-native-action-button';
import Modal from 'react-native-modalbox';

import {
  blue500,
  padding,
  transparent,
  margin
} from '../../styles';
import Screen from '../../components/Screen';

import Tabs from './Tabs';
import NotificationList from './NotificationList';
import QuickNotificationForm from './QuickNotificationForm';

import UpdatesActions from '../../actions/updates';
import { assignedNotifications, sentNotifications } from './selectors';
import {
  computedDefaultNotifications,
  computedAttendantNotifications,
  computedRunnerNotifications
} from '../Popup/selectors';
import { computedHotelRooms } from 'rc-mobile-base/lib/selectors/rooms';

class NotificationsLayout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedNotification: null
    }
  }

  _handleNotification = (notification) => this.setState({ selectedNotification: notification })
  _handleDismissNotification = () => this.setState({ selectedNotification: null })
  _handleSubmitNotification = (v) => {
    const { rooms } = this.props;
    const { selectedNotification } = this.state;
    const room = get(selectedNotification, 'meta.room_id')
              && find(rooms, { _id: get(selectedNotification, 'meta.room_id') });

    this._handleDismissNotification();

    const notification = {
      message: v.message,
      user: selectedNotification.creator,
      room
    }

    this.props.createNotification(notification);
  }

  _handleConvert = (notification) => {
    this.props.navigation.navigate('ConvertTask', { task: notification });
  }

  render() {
    const { assigned, sent, navigation } = this.props;
    const { selectedNotification } = this.state;

    return (
      <Screen>
        <ScrollableTabView renderTabBar={() => <Tabs />}>
          <View tabLabel={ I18n.t('base.notifications.index.assigned') }>
            <NotificationList notifications={assigned} reply={this._handleNotification} convert={this._handleConvert} />
          </View>
          <View tabLabel={ I18n.t('base.notifications.index.sent') }>
            <NotificationList notifications={sent} sent={true} reply={this._handleNotification} convert={this._handleConvert} />
          </View>
        </ScrollableTabView>

        <ActionButton
          hideShadow
          buttonColor={blue500.color}
          onPress={() => navigation.navigate('CreateNotification')}
        />

        <Modal
          style={[{ height: 270, ...transparent.bg }]}
          position={"top"}
          isOpen={!!selectedNotification}
          onClosed={this._handleDismissRoom}
          >
          { !!selectedNotification ?
            <QuickNotificationForm
              notification={selectedNotification}
              onSubmit={this._handleSubmitNotification}
              />
            : null
          }
        </Modal>
      </Screen>
    )
  }
}

// const mapStateToProps = createStructuredSelector({
//   assigned: assignedNotifications,
//   sent: sentNotifications,
//   rooms: computedHotelRooms
// });

const mapStateToProps = (state, props) => {
  const isAttendantApp = get(props, 'screenProps.isAttendantApp') || false;
  const isRunnerApp = get(props, 'screenProps.isRunnerApp') || false;

  const assigned = isAttendantApp ?
    computedAttendantNotifications(state) :
    isRunnerApp ?
    computedRunnerNotifications(state) :
    computedDefaultNotifications(state);

  // console.log(isRunnerApp, assigned, sentNotifications(state));
  
  return {
    assigned,
    sent: sentNotifications(state),
    rooms: computedHotelRooms(state),
  }

  // return createStructuredSelector({
  //   assigned: assignedNotifications,
  //   sent: sentNotifications,
  //   rooms: computedHotelRooms
  // });
}

const mapDispatchToProps = (dispatch) => ({
  createNotification: (props) => dispatch(UpdatesActions.notificationCreate(props)),
  dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsLayout);
