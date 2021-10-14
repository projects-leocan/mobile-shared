import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet
} from 'react-native';

import { connect } from 'react-redux';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { getFormValues } from 'redux-form';

import { get, extend } from 'lodash/object';
import { pull } from 'lodash/array';
import { includes, find } from 'lodash/collection';
import moment from 'moment';

import CustomTabbar from '../../components/CustomTabbar';
import AssetActionDescription from '../../components/AssetActionDescription';
import AssignmentSelect from '../../components/AssignmentSelect';
import TaskSettings from '../../components/TaskSettings';

import { getRoomById } from 'rc-mobile-base/lib/selectors/rooms';
import { computedAssets } from 'rc-mobile-base/lib/selectors/assets';
import { locationsSelector } from '../Task/selectors';

import UpdatesActions from 'rc-mobile-base/lib/actions/updates';

class ConvertTaskLayout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      photoUrl: null,
      desc: '',
      selectedAsset: null,
      selectedAction: null,
      createdAsset: '',
      isPriority: false,
      selectedAssignments: []
    }
  }

  componentWillMount() {
    const task = get(this.props, 'navigation.state.params.task', null)
    const { user: { _id: userId } } = this.props;
    this.setState({
      selectedAssignments: [userId,],
      desc: get(task, 'task')
    })
  }

  _handleContinue() {
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

  _handleSelectAssignment(assignment) {
    let { selectedAssignments } = this.state;

    if (selectedAssignments.includes(assignment)) {
      selectedAssignments = selectedAssignments.filter(aId => aId !== assignment);
    } else {
      selectedAssignments.push(assignment)
    }

    this.setState({
      selectedAssignments
    });
  }

  _handleToFinal() {
    this.tabView.goToPage(2);
  }

  _handleSubmit() {
    const task = get(this.props, 'navigation.state.params.task', null);
    const data = {
      asset: this.state.selectedAsset,
      action: this.state.selectedAction,
      assignments: this.state.selectedAssignments,
      room: this.props.room,
      photoUrl: this.state.photoUrl,
      desc: this.state.desc,
      isPriority: this.state.isPriority,
      isMandatory: this.state.isMandatory,
      isBlocking: this.state.isBlocking
    };

    this.props.convertTask(task, data);
    this.props.navigation.goBack();
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
        <View tabLabel="lightbulb-o" style={styles.tabView}>
          <View style={styles.tabScreen}>
            <AssetActionDescription
              assets={assets}
              room={this.props.room}
              customActions={customActions}
              selectedAsset={this.state.selectedAsset}
              createdAsset={this.state.createdAsset}
              selectedAction={this.state.selectedAction}
              desc={this.state.desc}
              isShowPriority={false}
              isDisableCreate={true}
              handleSelectAsset={this._handleSelectAsset.bind(this)}
              handleSelectAction={this._handleSelectAction.bind(this)}
              handleUpdateDesc={this._handleUpdateDesc.bind(this)}
              handleContinue={this._handleContinue.bind(this)}
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
  const roomId = get(props, 'navigation.state.params.task.meta.room_id', null);
  return {
    room: roomId ? getRoomById(roomId)(state) : null,
    assets: computedAssets(state),
    locations: locationsSelector(state),
    customActions: state.assets.hotelCustomActions,
    user: state.auth.user,
    users: state.users.users,
    groups: state.users.hotelGroups,
    selectedLocations: getFormValues('taskLocations')(state)
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    convertTask: (task, update) => dispatch(UpdatesActions.taskConvert({ task, update })),
    dispatch
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ConvertTaskLayout);
