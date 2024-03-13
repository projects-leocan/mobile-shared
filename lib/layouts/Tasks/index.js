import React, { Component } from 'react';
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect';
import ActionButton from 'react-native-action-button';
import { get } from 'lodash/object';
import { filter } from 'lodash/collection';
import { StyleSheet, ActivityIndicator, TouchableOpacity, View, Text } from 'react-native';
import {
  blue500,
  flex1
} from '../../styles';

import { taskUpdate } from '../../actions/updates';

import TaskList from '../../components/TaskList';
import Screen from '../../components/Screen';
import TaskCard from '../../components/TaskCard';
import TaskRowExpandable from '../../components/TaskRow/Expandable';
import TaskRow from '../../components/TaskRow';

import { activeTabSelector, sentTasks, assignedTasks, backlogTasks, closedTasks } from './selectors';
import { userSelector } from '../../selectors/auth';

import { setActiveTab } from './actions';

import Header from './Header';
import Search from './Search';
import Tabs from './Tabs';
import Tab from './Tab';
import ListTasks from './ListTasks';
import TaskAttendant from './TaskAttendant';
import {blueLt} from 'rc-mobile-base/lib/styles';
import FIcon from 'react-native-vector-icons/Feather';
import Data from 'rc-mobile-base/lib/utils/data';
import RoomsActions from 'rc-mobile-base/lib/actions/rooms';
import _ from 'lodash';
class TasksLayout extends Component {

  handleSelectTask = (task) => this.props.navigation.navigate('Task', { title: task.task })
  handleSelectActivity = (task, activity) => this.props.updateTask(task.uuid, activity.status);

  handleSelectActivityAttendant = (uuid, status) => this.props.updateTask(uuid, status);
  handleRefresh() {
    this.props.socketFireLoader(true)
    const data = new Data(this.props.dispatch, {
      disablePlannings: false,
      disablePlanningsRunner: true,
      disablePlanningsNight: true,
      disableRoomNotes: true,
      disableCatalogs: true,
      disableHistory: true,
      disabledInventoryWithdrawal: true,
      disableGlitches: false,
      disableAudits: false,
      disableLF: false,
      disableAssets: false,
      disableInspectionClean: false
    });

    data.refreshData();
  }
  render() {
    const { assigned, backlog, sent, activeTab, tabToggle, user, closedTask,taskFailure, isLoading, allTasks} = this.props;
    const isSendDisabled = get(this, 'props.screenProps.isTaskSendDisabled') || false;
    const userType = get(user, 'roleName', '');

    return (
      <Screen>
        <Header>
          <Tabs
            activeTab={activeTab}
            onPress={tabToggle}
            isSendDisabled={isSendDisabled}
            userType={userType}
          />
        </Header>

        {
          !_.isEmpty(taskFailure) && taskFailure.status !== 200 && _.isEmpty(allTasks) ?
            <View style={styles.errorView}>
              <Text style={styles.errorText}>{taskFailure?.message}</Text>
              {isLoading === true ? <ActivityIndicator size="large" color={blueLt.color} /> :
                <TouchableOpacity style={{ backgroundColor: 'transparent', borderWidth: 0 }}  onPress={this.handleRefresh.bind(this)}>
                  <FIcon name='refresh-ccw' size={32} color={blueLt.color} />         
                </TouchableOpacity>}
            </View> :
            <>
              <Tab
                value={0}
                active={activeTab}
              >
                <>
                  <ListTasks
                    tasks={assigned}
                    isSectionList={true}
                    {...this.props}
                    activeTab={0}
                    onSwipeoutPress={this.handleSelectActivity}
                    taskFailure={taskFailure}
                  />
                </>
              </Tab>

              <Tab
                value={1}
                active={activeTab}
              >
                <ListTasks
                  tasks={backlog}
                  {...this.props}
                  activeTab={1}
                  onSwipeoutPress={this.handleSelectActivity}
                  taskFailure={taskFailure}
                />
              </Tab>

              <Tab
                value={2}
                active={activeTab}
              >
                <ListTasks {...this.props} tasks={sent} activeTab={2} taskFailure={taskFailure}/>
              </Tab>

              <Tab
                value={3}
                active={activeTab}
              >
                <ListTasks {...this.props} tasks={closedTask} activeTab={3} taskFailure={taskFailure} />
              </Tab>
            </>
        }
        {isSendDisabled ?
          null :
          <ActionButton
            hideShadow
            buttonColor={blue500.color}
            onPress={() => this.props.navigation.navigate('CreateTask')}
          />
        }
      </Screen>
    )
  }
}

const styles = StyleSheet.create({
  errorView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  errorText: {
    fontSize: 20,
    textAlign:"center",
    ...blueLt.text,
  }
});
const mapStateToProps = (state, props) => {
  const hotelId = get(props, "navigation.state.params.hotelId", null) || null;

  let validateAssignedTask = assignedTasks(state);
  if (hotelId) {
    validateAssignedTask = filter(validateAssignedTask, function (o) { return o.hotel_id === hotelId })
  }

  return {
    closedTask: closedTasks(state),
    sent: sentTasks(state),
    assigned: validateAssignedTask,
    backlog: backlogTasks(state),
    activeTab: activeTabSelector(state),
    user: userSelector(state),
    taskFailure: state.rooms.taskFailure,
    isLoading: state.rooms.isLoading,
    allTasks: state.rooms.hotelTasks
  }
}

const mapDispatchToProps = (dispatch) => ({
  updateTask: (uuid, status) => dispatch(taskUpdate({ uuid, status })),
  tabToggle: (tab) => dispatch(setActiveTab(tab)),
  socketFireLoader: (data) => dispatch(RoomsActions.socketFireLoader(data)),
  dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(TasksLayout);
