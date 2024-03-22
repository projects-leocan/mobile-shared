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
import { allAudits } from 'rc-mobile-base/lib/layouts/Audits/selectors';
import checkEqual from "rc-mobile-base/lib/utils/check-equal";

class TasksLayout extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !checkEqual(this.props, nextProps, "insertAuditTask")||
      !checkEqual(this.props, nextProps, "assigned") || 
      !checkEqual(this.props, nextProps, "backlog") || 
      !checkEqual(this.props, nextProps, "sent") ||
      !checkEqual(this.props, nextProps, "closedTask") 
    );
  }

  componentDidUpdate(){
    let insertAuditTask = this.props.insertAuditTask
    if (!_.isEmpty(insertAuditTask)) {
      if (insertAuditTask?.meta?.success === true && !_.isEmpty(insertAuditTask?.meta?.taskId)) {
        let task = [insertAuditTask?.meta?.taskId]
        this.props.fetchTask(task)
      }
    }
  }
  handleSelectTask = (task) => this.props.navigation.navigate('Task', { title: task.task })
  handleSelectActivity = (task, activity) => {
    const is_audit_required = get(task, 'is_audit_required', false);
    const audit_template_id = get(task, 'audit_template_id', '');
    const audit_id = get(task, 'audit_id', '');
    const is_audit_answered = get(task, 'is_audit_answered', false);
    const { audits } = this.props
    const auditValidate = !_.isEmpty(audits) && audits.map((item) => {
      return {
        title: get(item, 'status', 'open'),
        data: [item]
      }
    })

    if (is_audit_required && is_audit_answered === false && activity.status === 'completed') {
      const audit = !_.isEmpty(auditValidate) && auditValidate.filter((audit) =>{
        let auditData = !_.isEmpty(audit) ? audit.data[0] : []
        if (auditData.id === audit_id) {
          return audit
        }
      })
      const auditData = !_.isEmpty(audit) ? audit[0].data[0] : [];

      if (!_.isEmpty(auditData)) {
        const finalData = {
          ...auditData,
          roomId:task?.meta?.room_id,
          floorId:task?.room?.floorId,
          buildingId:task?.room?.buildingId,
          hotelId:task.hotel_id,
          taskId: task?.id
        }
        this.props.navigation.navigate('AuditEdit', { audit: finalData })
        
      }else{
        return true
      }
    }else if(is_audit_required && is_audit_answered && activity.status === 'completed'){
      this.props.updateTask(task.uuid, activity.status, audit_id, audit_template_id, is_audit_required)
    }else{
      this.props.updateTask(task.uuid, activity.status, audit_id, audit_template_id, is_audit_required)
    }

  };

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
            onPress={() => this.props.navigation.navigate('CreateTask', {tasks:assigned})}
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
    allTasks: state.rooms.hotelTasks,
    audits: allAudits(state),
    insertAuditTask: state.roomAudit.insertAuditTask

  }
}

const mapDispatchToProps = (dispatch) => ({
  updateTask: (uuid, status, auditId, auditTemplateId, isAuditRequired) => dispatch(taskUpdate({ uuid, status, auditId, auditTemplateId, isAuditRequired })),
  tabToggle: (tab) => dispatch(setActiveTab(tab)),
  socketFireLoader: (data) => dispatch(RoomsActions.socketFireLoader(data)),
  fetchTask: (id) => dispatch(RoomsActions.auditTasksFetch(id)),
  dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(TasksLayout);
