import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  StyleSheet
} from 'react-native';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
// import { Lightbox } from '@shoutem/ui';
import Lightbox from 'react-native-lightbox';
import ListView from 'rc-mobile-base/lib/components/ListView';
import Entypo from 'react-native-vector-icons/Entypo';
import { get } from 'lodash/object';
import { isArray } from 'lodash/lang';

import UpdatesActions from 'rc-mobile-base/lib/actions/updates';
import { computedIndexedUsers } from 'rc-mobile-base/lib/selectors/users';
import { close as closeModal } from 'rc-mobile-base/lib/modal';

import AssignmentOptions from 'rc-mobile-base/lib/components/AssignmentOptions';

import {
  eitherGrey_100_200,
  flxRow,
  flx1,
  blue,
  red,
  orange,
  lCenterCenter,
  aic,
  jcsb,
  padding,
  margin,
  text,
  greyDk,
  slate,
  white
} from 'rc-mobile-base/lib/styles';

import ModalHeader from '../../ModalHeader';

import Stats from './Stats';
import LastHistory from './LastHistory';
import Message from './Message';
import NewMessage from './NewMessage';

const Label = ({ label, style }) => (
  <Text style={[styles.labelStyle, style]}>{ label.toUpperCase() }</Text>
)

const UpdateCommand = ({ children, onPress, style }) => (
  <TouchableOpacity style={[styles.commandBtn, style]} onPress={onPress}>
    <Text style={styles.commandLabel}>{ children.toUpperCase() }</Text>
  </TouchableOpacity>
)

class TaskModal extends Component {

  state = {
    isReassign: false,
    selectedAssignments: [],
    taskMessage: '',
  }
  
  _handleUpdate = (status) => {
    const { task: { uuid }, closeModal, updateTask } = this.props;
    updateTask(uuid, status);
    closeModal();
  }

  _handleToggleReassign = () => this.setState({ isReassign: !this.state.isReassign })
  _handleSelectAssignment = (assignment) => {
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

  _handleReassign = (selection) => {
    const { task: { uuid }, closeModal, reassignTask } = this.props;
    reassignTask(uuid, selection);
    closeModal();
  }

  _handleSubmitMessage = () => {
    const { task: { uuid }, closeModal, updateTask } = this.props;
    const { taskMessage: message } = this.state;
    updateTask(uuid, { isMessage: true, message });
    closeModal();
  }

  render() {
    const { task, closeModal, indexUsers } = this.props;
    const { uuid, messages } = task;
    const image = get(task, 'meta.image', null);
    const assigned = get(task, 'responsible') && `${task.responsible.first_name} ${task.responsible.last_name}` || get(task, 'assigned.label');
    const isClosed = get(task, 'is_completed') || get(task, 'is_cancelled');

    return (
      <View style={styles.container}>
        <View style={[styles.header, flxRow, blue.bg]}>
          <View style={styles.headerSide}></View>
          <Text style={[white.text, { fontSize: 17 }]}>{ task.task }</Text>
          <TouchableOpacity style={styles.headerSide} onPress={closeModal}>
            <Entypo name="cross" size={32} color={white.color} />
          </TouchableOpacity>
        </View>

        { this.state.isReassign ?
          <AssignmentOptions
            users={this.props.users}
            groups={this.props.groups}
            handleSubmit={this._handleReassign}
            handleCancel={this._handleToggleReassign}
            />
          :
          <View style={[flxRow, padding.a20, jcsb]}>
            <View style={[{ width: 196, height: 510 }]}>
              { image ?
                <Lightbox
                  key={image}
                  renderContent={() => <Image style={{ height: 300, marginTop: Dimensions.get('window').height / 2 - 150 }} resizeMode="contain" source={{ uri: image }} />}
                  swipeToDismiss={false}
                  >
                  <Image
                    source={{ uri: image }}
                    resizeMode="stretch"
                    style={styles.imageStyle}
                    />
                </Lightbox>
                : null
              }

              <Stats task={task} />
            </View>

            <View style={[{ width: 424, height: 510 }]}>
              <Label label={ I18n.t('base.tasktable.modal.assigned-to') } />
              <Text style={styles.valueStyle}>{ assigned }</Text>

              <Label label={ I18n.t('base.tasktable.modal.last-action') } style={{ ...margin.t15 }} />
              <LastHistory task={task} indexUsers={indexUsers} />

              <Label label={ I18n.t('base.tasktable.modal.messages') } style={{ ...margin.t15, ...margin.b5 }} />
              <View>
                <ListView
                  data={isArray(messages) ? messages : []}
                  renderRow={(rowData) => <Message message={rowData} indexUsers={this.props.indexUsers} />}
                  />
              </View>
              <NewMessage
                user={this.props.user}
                value={this.state.taskMessage}
                updateInput={(t) => this.setState({ taskMessage: t })}
                onPress={this._handleSubmitMessage}
                />
            </View>

            <View style={[{ width: 100, height: 510 }]}>
              { !isClosed ?
                <UpdateCommand
                  onPress={() => this._handleUpdate('completed')}
                  style={{ ...blue.bg }}
                  >
                  { I18n.t('base.tasktable.modal.complete-task') }
                </UpdateCommand>
                : null
              }
              { !isClosed ?
                <UpdateCommand
                  onPress={() => this._handleUpdate('cancelled')}
                  style={{ ...red.bg }}
                  >
                  { I18n.t('base.tasktable.modal.cancel-task') }
                </UpdateCommand>
                : null
              }
              { !isClosed ?
                <UpdateCommand
                  onPress={this._handleToggleReassign}
                  style={{ ...orange.bg }}
                  >
                  { I18n.t('base.tasktable.modal.reassign-task') }
                </UpdateCommand>
                : null
              }
            </View>
          </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    // height: 500,
    flex: 1,
    width: 800,
    backgroundColor: 'white'
  },
  header: {
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerSide: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 50
  },
  imageStyle: {
    height: 196,
    width: 196,
    marginBottom: 10
  },
  labelStyle: {
    ...slate.text,
    opacity: .7,
    fontSize: 14,
    marginBottom: 2
  },
  valueStyle: {
    fontSize: 17,
    ...slate.text,
    fontWeight: '500',
    opacity: .9
  },
  subvalueStyle: {
    fontSize: 14,
    ...slate.text,
    opacity: .8,
  },
  commandBtn: {
    width: 100,
    height: 60,
    borderRadius: 2,
    ...padding.x10,
    ...margin.b10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  commandLabel: {
    fontSize: 14,
    ...white.text,
    textAlign: 'center',
    fontWeight: 'bold'
  }
});

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    users: state.users.users,
    groups: state.users.hotelGroups,
    indexUsers: computedIndexedUsers(state),
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateTask: (uuid, status) => dispatch(UpdatesActions.taskUpdate({ uuid, status })),
    reassignTask: (uuid, ids) => dispatch(UpdatesActions.taskReassign({ uuid, ids })),
    dispatch
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskModal);
