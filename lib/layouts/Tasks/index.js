import React, { Component } from 'react';
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect';
import ActionButton from 'react-native-action-button';
import { get } from 'lodash/object';
import { filter } from 'lodash/collection';

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

import { activeTabSelector, sentTasks, assignedTasks, backlogTasks } from './selectors';
import { userSelector } from '../../selectors/auth';

import { setActiveTab } from './actions';

import Header from './Header';
import Search from './Search';
import Tabs from './Tabs';
import Tab from './Tab';
import ListTasks from './ListTasks';
import TaskAttendant from './TaskAttendant';

class TasksLayout extends Component {

  handleSelectTask = (task) => this.props.navigation.navigate('Task', { title: task.task })
  handleSelectActivity = (task, activity) => this.props.updateTask(task.uuid, activity.status);

  handleSelectActivityAttendant = (uuid, status) => this.props.updateTask(uuid, status);

  render() {
    const { assigned, backlog, sent, activeTab, tabToggle, user } = this.props;
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

        <Tab
          value={0}
          active={activeTab}
        >
          {/* {userType === 'Attendant'
            ?
            <>
              {assigned.map(task =>
                <TaskAttendant
                  key={task.uuid}
                  task={task}
                  updateTask={this.handleSelectActivityAttendant}
                />
              )}
            </>
            : */}
          <>
            <ListTasks
              tasks={assigned}
              isSectionList={true}
              onSwipeoutPress={this.handleSelectActivity}
            />
          </>
          {/* } */}


        </Tab>

        <Tab
          value={1}
          active={activeTab}
        >
          <ListTasks
            tasks={backlog}
            onSwipeoutPress={this.handleSelectActivity}
          />
        </Tab>

        <Tab
          value={2}
          active={activeTab}
        >
          <ListTasks tasks={sent} />
        </Tab>

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

const mapStateToProps = (state, props) => {
  const hotelId = get(props, "navigation.state.params.hotelId", null) || null;

  let validateAssignedTask = assignedTasks(state);
  if (hotelId) {
    validateAssignedTask = filter(validateAssignedTask, function (o) { return o.hotel_id === hotelId })
  }

  return {
    sent: sentTasks(state),
    assigned: validateAssignedTask,
    backlog: backlogTasks(state),
    activeTab: activeTabSelector(state),
    user: userSelector(state)
  }
}

const mapDispatchToProps = (dispatch) => ({
  updateTask: (uuid, status) => dispatch(taskUpdate({ uuid, status })),
  tabToggle: (tab) => dispatch(setActiveTab(tab)),
  dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(TasksLayout);
