import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Dimensions
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import IcoMoonIcon from 'rc-mobile-base/lib/components/IcoMoonIcon';

import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation'
import { get } from 'lodash/object';
import moment from 'moment';

import RoomsActions from 'rc-mobile-base/lib/actions/rooms';
import UpdatesActions from 'rc-mobile-base/lib/actions/updates';

import { getRoomById } from 'rc-mobile-base/lib/selectors/rooms';
import { getRoomUpdateById } from 'rc-mobile-base/lib/selectors/updates';

import CleaningInfo from 'rc-mobile-base/lib/components/CleaningInfo';
import TaskRowRoom from 'rc-mobile-base/lib/components/TaskRowRoom';

import ReservationComponent from 'rc-mobile-base/lib/components/Reservation';
import GuestSubheader from './GuestSubheader';
import RoomTimer from './RoomTimer';
import RoomOptions from './RoomOptions';
import RoomTasks from './RoomTasks';
import TasksSubheader from './TasksSubheader';
import Menu from './Menu';
import FinishMenu from './FinishMenu';
import Housekeeping from './Housekeeping';

import pickActiveReservation from 'rc-mobile-base/lib/utils/pick-active-reservation';

import {
  lCenterCenter,
  red,
  green,
  white,
  margin,
  flxRow
} from 'rc-mobile-base/lib/styles';

import {
  Margin,
} from './styles';

class InspectLayout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAllowDone: false,
      isTasksShown: false,
      isInspect: false,
      isNoCheck: false,
      isShowAdditional: false
    }
  }

  componentWillMount() {
    const { room: { name, roomCalendar, guests }} = this.props;
    this.props.navigation.setParams({ roomName: name });

    if (!roomCalendar || !roomCalendar.length) {
      return;
    }

    // const activeReservationId = get(last(guests), 'pmsId', null);
    const activeReservationId = pickActiveReservation(guests, true);
    this.setState({ activeReservationId });
  }

  componentWillUpdate(nextProps, nextState) {
    const { isTasksShown } = this.state;
    const { room } = nextProps;
    const roomTasks = get(room, 'roomTasks') || [];

    if (isTasksShown && !roomTasks.length) {
      this.setState({ isTasksShown: false });
      LayoutAnimation.easeInEaseOut();
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  _handleNavigation = (layout) => {
    const roomId = this.props.navigation.state.params.roomId
    this.props.navigation.navigate(layout, { roomId });
  }

  _handleInspect = () => this.setState({ isInspect: true })
  _handleNoCheck = () => this.setState({ isNoCheck: true })
  _handleCancelInspect = () => this.setState({ isInspect: false, isNoCheck: false })

  _handleConfirmInspect = () => {
    const { room: { _id: roomId } } = this.props;
    this.props.inspect(roomId);

    this.props.navigation.goBack();
  }

  // _handleNoCheck = () => {
  //   const { room: { _id: roomId } } = this.props;
  //   this.props.noCheck(roomId);

  //   this.props.navigation.goBack();
  // }

  _handleDelay = () => {
    const { room: { _id: roomId } } = this.props;
    this.props.delay(roomId);

    this.props.navigation.goBack();
  }

  _handleDND = () => {
    const { room: { _id: roomId } } = this.props;
    this.props.dnd(roomId);

    this.props.navigation.goBack();
  }

  _handleRefuse = () => {
    const { room: { _id: roomId } } = this.props;
    this.props.refuse(roomId);

    this.props.navigation.goBack();
  }

  // _handleNoCheck = () => {
  //   const { room: { _id: roomId } } = this.props;
  //   this.props.noCheck(roomId);

  //   this.props.navigation.goBack();
  // }

  _handleConfirmDnd = () => {
    const { room: { _id: roomId } } = this.props;
    this.props.confirmDND(roomId);

    this.props.navigation.goBack();
  }

  _handleCancel = () => {
    const { room: { _id: roomId, attendantStatus } } = this.props;
    this.props.cancel(roomId);

    if (attendantStatus === "cleaning") {
      this.props.navigation.goBack();
    }
  }

  _handleReset = () => {
    const { room: { _id: roomId, attendantStatus } } = this.props;
    this.props.reset(roomId);

    this.props.navigation.goBack();
  }

  _handleToggleTasks = () => {
    this.setState({ isTasksShown: !this.state.isTasksShown });
    LayoutAnimation.easeInEaseOut();
  }

  _handleUpdateTask(uuid, status) {
    this.props.updateTask(uuid, status);
  }

  _handleHousekeeping = (_id) => {
    const { _id: roomId } = this.props.room;
    this.props.updateHousekeeping(roomId, _id);
    this.props.navigation.goBack();
  }

  _handleToggleAdditional = () => this.setState({ isShowAdditional: !this.state.isShowAdditional })

  _handleMobileInspect = (_id) => {
    const { isInspect, isNoCheck } = this.state;
    const { _id: roomId } = this.props.room;
    const attendantStatus = isInspect ? 'finish' : 'no-check';
    this.props.mobileInspect(roomId, _id, attendantStatus);
    this.props.navigation.goBack();
  }

  _isRenderMenu() {
    const { isInspect, isNoCheck } = this.state;
    const { room: { attendantStatus }} = this.props;

    return !attendantStatus && !isInspect && !isNoCheck;
  }

  _isRenderOptions() {
    if (this.state.isTasksShown) return false;
    const { room: { attendantStatus }} = this.props;

    return attendantStatus && attendantStatus !== "delay";
  }

  _isRenderStartHeader() {
    const { roomUpdate } = this.props;

    return roomUpdate && roomUpdate.startTime;
  }

  _isRenderFinish() {
    if (this.state.isTasksShown) return false;
    const { room: { attendantStatus } } = this.props;

    return attendantStatus
        && attendantStatus !== 'delay'
        && attendantStatus !== 'cleaning'
        && attendantStatus !== 'paused';
  }

  _isRenderInspect() {
    const { isInspect, isNoCheck } = this.state;

    return isInspect || isNoCheck;
  }

  render() {
    const { room, roomUpdate, hotel: { disableAttendantTimer }, config } = this.props;
    const attendantStatus = get(room, 'attendantStatus');
    const guestName = get(room, ['roomCalendar', 0, 'guest_name'], '');
    const guestOccupants = get(room, ['roomCalendar', 0, 'occupants'], 1);
    const checkinDate = get(room, ['roomCalendar', 0, 'check_in_date'], '').slice(0, 10);
    const checkoutDate = get(room, ['roomCalendar', 0, 'check_out_date'], '').slice(0, 10);
    const roomTasks = get(room, 'roomTasks', []);

    return (
      <View style={styles.container}>
        <ScrollView>
          {/* { roomTasks && roomTasks.length ?
            <TasksSubheader
              tasks={roomTasks}
              isShown={this.state.isTasksShown}
              onPress={this._handleToggleTasks}
              />
            : null
          } */}

          {/* { this.state.isTasksShown ?
            <View style={[ { marginLeft: 3, marginRight: 3, marginBottom: 15 } ]}>
              { roomTasks.map(task =>
                <TaskRowRoom key={task.uuid} task={task} updateTask={this.props.updateTask} />
              )}
            </View>
            : null
          } */}

          <ReservationComponent
            room={room}
            style={{ marginRight: 4, marginLeft: 4 }}
            activeId={this.state.activeReservationId}
            onChangeActive={(activeReservationId) => this.setState({ activeReservationId })}
            isExpanded={true}
            />

          <CleaningInfo
            room={room}
            activeId={this.state.activeReservationId}
            config={this.props.config}
            />

          { this._isRenderMenu() ?
            <Menu
              inspect={this._handleInspect}
              nocheck={this._handleNoCheck}
              dnd={this._handleDND}
              refuse={this._handleRefuse}
              />
            : null
          }

          { this._isRenderFinish() ?
            <FinishMenu
              attendantStatus={attendantStatus}
              cancel={this._handleCancel}
              confirmDnd={this._handleConfirmDnd}
              isEnableClear={true}
              isReset={true}
              reset={this._handleReset}
              />
            : null
          }

          {/*
            { this._isRenderInspect() ?
              <View style={[margin.t15]}>
                <TouchableOpacity style={[styles.inspectBtn]} onPress={this._handleConfirmInspect}>
                  <IcoMoonIcon name="check" color="white" size={54} />
                  <Text style={styles.inspectText}>{ `Confirm Inspect`.toUpperCase() }</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelInspectBtn} onPress={this._handleCancelInspect}>
                  <Icon name="ban" color="white" size={32} />
                  <Text style={styles.cancelInspectText}>{ `Cancel Inspect`.toUpperCase() }</Text>
                </TouchableOpacity>
              </View>
              : null
            }
          */}

          { this._isRenderInspect() ?
            <Housekeeping
              roomStatus={this.props.room.roomStatus}
              roomHousekeeping={this.props.room.roomHousekeeping}
              roomHousekeepings={this.props.roomHousekeepings}
              updateHousekeeping={this._handleMobileInspect}
              toggleAdditional={this._handleToggleAdditional}
              isShowAdditional={this.state.isShowAdditional}
              />
            : null
          }

          {/* { this._isRenderInspect() || this._isRenderFinish()  ?
            <RoomOptions
              onNavigate={this._handleNavigation}
              isShowClean={false}
              isShowNotes={true}
              isShowGallery={true}
              isShowLostFound={true}
              isShowInventory={true}
              isShowMaintenance={true}
              isShowTask={false}
              isShowGlitch={false}
              onPressGlitch={null}
              style={{ marginTop: 15 }}
              />
            : null
          } */}

        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingTop: 10,
    backgroundColor: '#F7F7F7'
  },
  infoHeader: {
    marginLeft: 15,
    marginBottom: 2,
    color: '#373737',
    fontWeight: '500',
    opacity: .8
  },
  infoContainer: {
    backgroundColor: 'white',
    marginLeft: 4,
    marginRight: 4,
  },
  infoRow: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 6,
    paddingBottom: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconContainer: {
    width: 40
  },
  infoText: {
    color: '#4a4a4a',
    fontWeight: '300',
    fontSize: 14,
    flex: 1,
    flexDirection: 'column'
  },
  pms: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4a4a4a'
  },
  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 2,
    marginTop: 20
  },
  menuBtn: {
    width: Dimensions.get('window').width / 2 - 6,
    height: 100,
    margin: 2,
    backgroundColor: 'white',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 3,
    paddingBottom: 15
  },
  btnText: {
    fontWeight: '600',
    color: 'white'
  },
  inspectBtn: {
    height: 120,
    ...lCenterCenter,
    ...green.bg,
    marginLeft: 4,
    marginRight: 4,
    borderRadius: 4,
    ...margin.b5
  },
  inspectText: {
    ...white.text,
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 6
  },
  cancelInspectBtn: {
    ...flxRow,
    height: 60,
    ...lCenterCenter,
    ...red.bg,
    marginLeft: 4,
    marginRight: 4,
    borderRadius: 4
  },
  cancelInspectText: {
    ...white.text,
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 6
  }
});

const mapStateToProps = (state, props) => {
  const roomId = props.navigation.state.params.roomId
  return {
    config: state.auth.config,
    hotel: state.auth.hotel,
    roomHousekeepings: state.rooms.hotelRoomHousekeepings,
    room: getRoomById(roomId)(state),
    roomUpdate: getRoomUpdateById(roomId)(state)
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    cleanStart: (roomId) => dispatch(UpdatesActions.roomCleanStart(roomId)),
    cleanRestart: (roomId) => dispatch(UpdatesActions.roomCleanRestart(roomId)),
    cleanPause: (roomId) => dispatch(UpdatesActions.roomCleanPause(roomId)),
    cleanUnpause: (roomId) => dispatch(UpdatesActions.roomCleanUnpause(roomId)),
    cleanFinish: (roomId) => dispatch(UpdatesActions.roomCleanFinish(roomId)),
    delay: (roomId) => dispatch(UpdatesActions.roomDelay(roomId)),
    dnd: (roomId) => dispatch(UpdatesActions.roomDND(roomId)),
    refuse: (roomId) => dispatch(UpdatesActions.roomRefuse(roomId)),
    inspect: (roomId) => dispatch(UpdatesActions.roomInspect(roomId)),
    noCheck: (roomId) => dispatch(UpdatesActions.roomNoCheck(roomId)),
    reset: (roomId) => dispatch(UpdatesActions.roomReset(roomId)),
    confirmDND: (roomId) => dispatch(UpdatesActions.roomConfirmDND(roomId)),
    cancel: (roomId) => dispatch(UpdatesActions.roomCancel(roomId)),
    updateTask: (uuid, status) => dispatch(UpdatesActions.taskUpdate({ uuid, status})),
    updateHousekeeping: (roomId, value) => dispatch(UpdatesActions.roomHousekeeping({roomId, value})),
    mobileInspect: (roomId, roomHousekeeping, attendantStatus) => dispatch(UpdatesActions.roomMobileInspect({ roomId, roomHousekeeping, attendantStatus })),
    dispatch
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(InspectLayout);
