import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';
import CustomTabbar from 'rc-mobile-base/lib/components/CustomTabbar';
import { getFormValues } from 'redux-form';

import { get, extend } from 'lodash/object';
import { pull } from 'lodash/array';
import { includes, find } from 'lodash/collection';
import moment from 'moment';

import FullscreenPhoto from 'rc-mobile-base/lib/components/FullscreenPhoto';
import AssetActionDescription from 'rc-mobile-base/lib/components/AssetActionDescription';
import AssignmentSelect from 'rc-mobile-base/lib/components/AssignmentSelect';
import TaskSettings from 'rc-mobile-base/lib/components/TaskSettings';

import { connect } from 'react-redux';


import { getRoomById } from '../../selectors/rooms';

import { locationsSelector } from './selectors';
import { computedAssets } from 'rc-mobile-base/lib/selectors/assets';

import UpdatesActions from 'rc-mobile-base/lib/actions/updates';

class TaskLayout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      photoId: null,
      desc: '',
      selectedAsset: null,
      selectedAction: null,
      createdAsset: '',
      isPriority: false,
      selectedAssignments: [],
      selectedLocations: []
    }
  }

  _handleTakePicture(camera) {
    camera.capture()
      .then((data) => {
        const photoId = moment().format('X');
        this.setState({ photoId });
        this.props.uploadPhoto(data.path, photoId);
      })
      .catch(err => console.error(err));
    this.tabView.goToPage(1);
  }

  _handlePhotoContinue() {
    this.tabView.goToPage(1);
  }

  _handleSelectAsset(asset) {
    if (get(asset, 'isCreate')) {
      return this.setState({
        selectedAsset: null,
        createdAsset: get(asset, 'searchQuery')
      });
    }

    const existingId = get(this, 'state.selectedAsset._id');
    const newId = get(asset, '_id');

    if (existingId && existingId === newId) {
      return this.setState({ selectedAsset: null });
    }

    this.setState({ selectedAsset: asset, createdAsset: '' });
  }

  _handleSelectAction(action) {
    const { selectedAction } = this.state;

    if (selectedAction && get(selectedAction, 'id', null) === get(action, 'id', null)) {
      this.setState({ selectedAction: null });
    } else {
      this.setState({ selectedAction: action });
    }
  }

  _handleUpdateDesc(t) {
    this.setState({ desc: t })
  }

  _handleUpdatePriority(v) {
    this.setState({ isPriority: v });
  }

  _handleUpdateMandatory(v) {
    this.setState({ isMandatory: v });
  }

  _handleUpdateBlocking(v) {
    this.setState({ isBlocking: v });
  }

  _handleSelectLocation = (room) => {
    const { selectedLocations } = this.state;
    const found = find(selectedLocations, { _id: room._id });
    if (found) {
      this.setState({ selectedLocations: selectedLocations.filter(r => r._id !== room._id) })
    } else {
      this.setState({ selectedLocations: [...selectedLocations, room]})
    }
  }

  _handleSelectAssignment(assignment) {
    let { selectedAssignments } = this.state;

    // if (selectedAssignments.has(assignment)) {
    //   selectedAssignments.delete(assignment);
    // } else {
    //   selectedAssignments.add(assignment);
    // }

    if (selectedAssignments.includes(assignment)) {
      selectedAssignments = selectedAssignments.filter(aId => aId !== assignment);
    } else {
      selectedAssignments.push(assignment)
    }

    this.setState({
      selectedAssignments
    });
  }

  _handleToAssignment() {
    this.tabView.goToPage(2);
  }

  _handleToFinal() {
    this.tabView.goToPage(3);
  }

  _handleSubmit() {
    if (this.props.room) {
      const data = {
        asset: this.state.selectedAsset,
        action: this.state.selectedAction,
        assignments: this.state.selectedAssignments,
        room: this.props.room,
        photoId: this.state.photoId,
        desc: this.state.desc || 'Issue',
        isPriority: this.state.isPriority,
        isMandatory: this.state.isMandatory,
        isBlocking: this.state.isBlocking,
        createdAsset: this.state.createdAsset
      };

      if (this.props.activeGlitch) {
        data.activeGlitch = this.props.activeGlitch;
      }

      this.props.createTask(data);
    } else {
      const data = {
        asset: this.state.selectedAsset,
        action: this.state.selectedAction,
        assignments: this.state.selectedAssignments,
        photoId: this.state.photoId,
        desc: this.state.desc,
        isPriority: this.state.isPriority,
        isMandatory: this.state.isMandatory,
        isBlocking: this.state.isBlocking,
        createdAsset: this.state.createdAsset,
        locations: get(this, 'props.selectedLocations.locations', []),
      }

      this.props.createTasks(data);
    }
    // this.setState(extend({}, INITIAL_STATE));
    this.props.navigation.goBack()
  }

  render() {
    const { assets, customActions, users, groups, locations } = this.props;
    const { selectedAssignments } = this.state;

    return (
      <ScrollableTabView
        style={styles.container}
        renderTabBar={() => <CustomTabbar />}
        ref={(tabView) => {
          if (tabView != null) {
            this.tabView = tabView;
          }
        }}
        >
        <View tabLabel="camera" style={styles.tabView}>
          <View style={styles.tabScreen}>
            <FullscreenPhoto
              takePhoto={this._handleTakePicture.bind(this)}
              noPhoto={this._handlePhotoContinue.bind(this)}
              />
          </View>
        </View>
        <View tabLabel="lightbulb-o" style={styles.tabView}>
          <View style={styles.tabScreen}>
            <AssetActionDescription
              assets={assets}
              room={this.props.room}
              locations={locations}
              customActions={customActions}
              selectedAsset={this.state.selectedAsset}
              createdAsset={this.state.createdAsset}
              selectedAction={this.state.selectedAction}
              desc={this.state.desc}
              isShowPriority={false}
              handleSelectAsset={this._handleSelectAsset.bind(this)}
              handleSelectAction={this._handleSelectAction.bind(this)}
              handleUpdateDesc={this._handleUpdateDesc.bind(this)}
              handleContinue={this._handleToAssignment.bind(this)}
              />
          </View>
        </View>
        <View tabLabel="users" style={styles.tabView}>
          <View style={styles.tabScreen}>
            <AssignmentSelect
              selectedAssignments={this.state.selectedAssignments}
              users={users}
              groups={groups}
              handleSelectAssignment={this._handleSelectAssignment.bind(this)}
              handleContinue={this._handleToFinal.bind(this)}
              />
          </View>
        </View>
        <View tabLabel="paper-plane" style={styles.tabView}>
          <View style={styles.tabScreen}>
            <TaskSettings
              isShowPriority={true}
              isPriority={this.state.isPriority}
              isMandatory={this.state.isMandatory}
              isBlocking={this.state.isBlocking}
              handleUpdatePriority={this._handleUpdatePriority.bind(this)}
              handleUpdateMandatory={this._handleUpdateMandatory.bind(this)}
              handleUpdateBlocking={this._handleUpdateBlocking.bind(this)}
              handleSubmit={this._handleSubmit.bind(this)}
              />
          </View>
        </View>
      </ScrollableTabView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
    backgroundColor: '#F7F7F7'
  },
  tabView: {
    flex: 1,
  },
  tabScreen: {
    flex: 1,
  }
});

const mapStateToProps = (state, props) => {
  const roomId = get(props, 'navigation.state.params.roomId') || null;
  return {
    room: roomId && getRoomById(roomId)(state) || null,
    locations: locationsSelector(state),
    assets: computedAssets(state),
    customActions: state.assets.hotelCustomActions,
    users: state.users.users,
    groups: state.users.hotelGroups,
    selectedLocations: getFormValues('taskLocations')(state)
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    uploadPhoto: (path, id) => dispatch(UpdatesActions.photoUpload({ path, id})),
    createTask: (data) => dispatch(UpdatesActions.taskCreate(data)),
    createTasks: (data) => dispatch(UpdatesActions.taskCreateBatch(data)),
    dispatch
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskLayout);
