import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  InteractionManager,
  StyleSheet
} from 'react-native';
import Modal from 'react-native-modalbox';
import I18n from 'react-native-i18n'
import ListView from 'rc-mobile-base/lib/components/ListView';
import Lightbox from 'react-native-lightbox';
import Icon from 'react-native-vector-icons/FontAwesome';
import IcoMoonIcon from 'rc-mobile-base/lib/components/IcoMoonIcon';
import Entypo from 'react-native-vector-icons/Entypo';
import checkEqual from 'rc-mobile-base/lib/utils/check-equal';
import NavigationService from 'rc-mobile-base/lib/utils/navigation-service';

import {
  red,
  blue,
  blueLt,
  white,
  slate,
  greyLt,
  grey,
  aic,
  orange,
  jcc,
  greyDk,
  grey400,
  green,
  padding,
  margin,
  flx1
} from 'rc-mobile-base/lib/styles';

import moment from 'moment';
import { get } from 'lodash/object';
import { last } from 'lodash/array';
import { find } from 'lodash/collection';

import { connect } from 'react-redux';

import { computedPopupTasks, computedPopupNotifications } from 'rc-mobile-base/lib/selectors/rooms';
import {
  computedDefaultPopupNotifications,
  computedAttendantPopupNotifications,
  computedRunnerPopupNotifications,
  computedAssignedAudits
} from './selectors';
import { computedAttendantPopupTasks } from 'rc-mobile-base/lib/selectors/attendant';
import { computedRunnerPopupTasks } from 'rc-mobile-base/lib/selectors/runner';
import { computedMaintenancePopupTasks } from 'rc-mobile-base/lib/selectors/maintenance';
import { computedIndexedUsers } from 'rc-mobile-base/lib/selectors/users';
import { computedPopupGlitches } from 'rc-mobile-base/lib/selectors/glitches';

import UpdatesActions from 'rc-mobile-base/lib/actions/updates';
import GlitchesActions from 'rc-mobile-base/lib/actions/glitches';

class PopupLayout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewedTasks: [],
      updatedTasks: [],
      viewedAudits: []
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { tasks } = this.props;
    const { tasks: nextTasks } = nextProps;
    const { viewedTasks, viewedAudits } = this.state;
    const { viewedTasks: nextViewedTasks, viewedAudits: nextViewedAudits } = nextState;
    const taskIds = tasks.map(t => t.uuid);
    const nextTaskIds = nextTasks.map(t => t.uuid);


    return !checkEqual(taskIds, nextTaskIds)
      || !checkEqual(viewedTasks, nextViewedTasks)
      || !checkEqual(viewedAudits, nextViewedAudits)
      || !checkEqual(this.props, nextProps, 'assignedAudits')
      || !checkEqual(this.props, nextProps, 'notifications')
      || !checkEqual(this.props, nextProps, 'glitches');
  }

  componentDidUpdate(prevProps, prevState) {
    const { tasks } = this.props;
    const { viewedTasks, updatedTasks } = this.state;
    const remainingTasks = tasks.filter(task => !viewedTasks.includes(task.uuid));


    if (!remainingTasks.length && updatedTasks.length) {
      this.setState({ updatedTasks: [] })
      
      InteractionManager.runAfterInteractions(() => {
        this.props.updateBatchTask(updatedTasks);
      })
    }
  }

  _handleGlitchAcknowledge = () => {
    const { glitches } = this.props;

    // glitches.forEach(glitch => {
    //   const uuid = glitch.uuid;
    //   this.props.acknowledgeGlitch(uuid);
    // });

    const entries = glitches.map(glitch => glitch.uuid);
    this.props.batchAcknowledgeGlitch(entries);
  }

  _handleUpdate(uuid, status) {
    this.props.updateTask(uuid, status);
  }

  _handleTask(uuid, status) {
    const { updatedTasks, viewedTasks } = this.state;
    this.setState({
      updatedTasks: [...updatedTasks, { uuid, status }],
      viewedTasks: [...viewedTasks, uuid]
    });
  }

  _handleDismiss = (uuid) => {
    const { viewedTasks } = this.state;
    const updatedViewedTasks = [...viewedTasks, uuid]

    this.setState({ viewedTasks: updatedViewedTasks });
  }

  _handleDismissAudit = (audit, isNavigate = false) => {
    this.setState({
      viewedAudits: [...this.state.viewedAudits, audit.id]
    })
    console.log(this.state.viewedAudits, audit)

    if (isNavigate) {
      InteractionManager.runAfterInteractions(() => {
        NavigationService.navigate('AuditEdit', { audit });
      });
    }
  }

  _renderMessage(message) {
    if (!message || !message.message) {
      return null;
    }

    return (
      <View style={styles.messageContainer}>
        <View style={styles.messageImageContainer}>
          <Icon name="picture-o" size={28} color="lightgray" />
        </View>
        <View style={styles.messageMessageContainer}>
          <Text style={styles.messageText}></Text>
          <Text style={styles.messageDetails}></Text>
        </View>
      </View>
    )
  }

  _renderAudit(audits) {
    const firstAudit = get(audits, 0, {});
    const auditName = get(firstAudit, 'name');
    const auditId = get(firstAudit, 'id');
    const auditRoom = get(firstAudit, 'roomName');
    console.log(firstAudit)
    
    return (
      <View style={{justifyContent: 'flex-start', alignItems: 'center', flex: 1}}>
        <View style={styles.header}>
          <View style={styles.headerSide}></View>
          <Text style={styles.headerText}>{ I18n.t('base.popup.index.assigned-audit').toUpperCase() }</Text>
          <TouchableOpacity style={styles.headerSide} onPress={() => this._handleDismissAudit(firstAudit, false)}>
            <Entypo name="cross" color="white" size={32} />
          </TouchableOpacity>
        </View>

        <View style={[aic, padding.x10, padding.y15, flx1]}>
          <Text style={styles.assetText}>{ auditName }</Text>
          <Text style={styles.metaTitle}>{ I18n.t('base.popup.index.location').toUpperCase() }</Text>
          <Text style={styles.metaText}>{ auditRoom || I18n.t('base.ubiquitous.no-location') }</Text>
          <Text style={styles.metaTitle}>{ I18n.t('base.popup.index.submitted-time').toUpperCase() }</Text>
          <Text style={styles.metaText}>{ moment(firstAudit.created_at).fromNow() }</Text>
          <View style={[flx1,]}></View>

          <View style={styles.optionsRow}>
            <TouchableOpacity style={[styles.optionBtn, grey.bg]} onPress={() => this._handleDismissAudit(firstAudit, false)}>
              <Text style={styles.optionBtnText}>{ I18n.t('base.ubiquitous.close').toUpperCase() }</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.optionBtn, { backgroundColor: '#3CC86B' }]} onPress={() => this._handleDismissAudit(firstAudit, true)}>
              <Text style={styles.optionBtnText}>{ I18n.t('base.ubiquitous.start').toUpperCase() }</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  _renderNotification(notifications) {
    const firstNotification = get(notifications, 0, {});
    const task = get(firstNotification, 'task');
    const activeUUID = get(firstNotification, 'uuid');
    const image = get(firstNotification, 'meta.image', null);
    const location = get(firstNotification, 'meta.location', "");
    const user = get(firstNotification, 'creator', {});
    const date_ts = get(firstNotification, 'date_ts');

    return (
      <View style={{justifyContent: 'flex-start', alignItems: 'center', flex: 1}}>
        <View style={styles.header}>
          <View style={styles.headerSide}></View>
          <Text style={styles.headerText}>{ I18n.t('base.popup.index.notification').toUpperCase() }</Text>
          <View style={styles.headerSide}></View>
        </View>

        <ScrollView contentContainerStyle={[aic, padding.x10]}>
          { image ?
            <View style={styles.imageContainer}>
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
            </View>
            : null
          }

          <Text style={styles.assetText}>{ task }</Text>

          <Text style={styles.metaTitle}>{ I18n.t('base.popup.index.location').toUpperCase() }</Text>
          <Text style={styles.metaText}>{ location || I18n.t('base.ubiquitous.no-location') }</Text>

          <Text style={styles.metaTitle}>{ I18n.t('base.popup.index.created-by').toUpperCase() }</Text>
          <Text style={styles.metaText}>{ `${user.first_name} ${user.last_name}` }</Text>

          <Text style={styles.metaTitle}>{ I18n.t('base.popup.index.submitted-time').toUpperCase() }</Text>
          <Text style={styles.metaText}>{ moment.unix(date_ts).fromNow() }</Text>
          <View style={[margin.b10]}></View>
        </ScrollView>

        <View style={[styles.optionsRow]}>
          <TouchableOpacity style={[styles.optionBtn, { backgroundColor: '#3CC86B' }]} onPress={() => this._handleUpdate(activeUUID, 'completed')}>
            <Text style={styles.optionBtnText}>{ I18n.t('base.popup.index.okay').toUpperCase() }</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  _renderTask(tasks) {
    const { indexUsers, isDismissEnable } = this.props;
    const firstTask = get(tasks, 0, {});
    const activeUUID = get(firstTask, 'uuid');
    const [asset, action] = get(firstTask, 'task', ": ").split(": ");
    const image = get(firstTask, 'meta.image', null);
    const lastMessage = last(get(firstTask, 'messages', []));
    const isMandatory = get(firstTask, 'assigned.is_mandatory', false);
    const location = get(firstTask, 'meta.location', "");
    const date_ts = get(firstTask, 'date_ts');
    const user = get(indexUsers, get(firstTask, 'creator_id'));
    const isPriority = get(firstTask, 'is_priority');
    const isGuest = get(firstTask, 'meta.isGuest', false);

    return (
      <View style={{justifyContent: 'flex-start', alignItems: 'center', flex: 1}}>
        <View style={styles.header}>
          <View style={styles.headerSide}>
            
          </View>
          <Text style={styles.headerText}>{ I18n.t('base.popup.index.new-task').toUpperCase() }</Text>
          { isDismissEnable ?
            <TouchableOpacity style={styles.headerSide} onPress={() => this._handleDismiss(activeUUID)}>
              <Entypo name="cross" color="white" size={32} />
            </TouchableOpacity>
            : <View style={styles.headerSide}></View>
          }
        </View>
        <ScrollView contentContainerStyle={[aic, padding.x10]}>
          { image ?
            <View style={styles.imageContainer}>
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
            </View>
            : null
          }
          <Text style={styles.assetText}>{ asset }</Text>
          <Text style={styles.actionText}>{ action }</Text>
          { isGuest ?
            <IcoMoonIcon
              name="guest-priority"
              color={red.color}
              size={48}
              style={{ marginTop: 4 }}
              />
            : isPriority ?
            <Icon
              name="star"
              color={orange.color}
              size={30}
              style={{ marginTop: 4 }}
              />
            : null
          }
          { lastMessage ?
            <View style={{ alignItems: 'center'}}>
              <Text style={styles.metaTitle}>{ I18n.t('base.popup.index.last-message').toUpperCase() }</Text>
              <Text style={[styles.metaText, { fontSize: 15, ...red.text, marginVertical: 2 }]}>{ lastMessage.message }</Text>
            </View>
            : null
          }
          <Text style={styles.metaTitle}>{ I18n.t('base.popup.index.location').toUpperCase() }</Text>
          <Text style={styles.metaText}>{ location || "No Location" }</Text>
          
          <View style={{ width: 100, borderBottomWidth: 1, borderBottomColor: grey400.color, opacity: .8, marginVertical: 6 }} />
          
          <Text style={styles.metaTitle}>{ I18n.t('base.popup.index.created-by').toUpperCase() }</Text>
          <Text style={styles.metaText}>{ user ? `${user.first_name} ${user.last_name}` : '' }</Text>
          <Text style={styles.metaTitle}>{ I18n.t('base.popup.index.submitted-time').toUpperCase() }</Text>
          <Text style={styles.metaText}>{ moment.unix(date_ts).fromNow() }</Text>
        </ScrollView>

        <View style={styles.optionsRow}>
          { !isMandatory ?
            <TouchableOpacity style={[styles.optionBtn, { backgroundColor: '#C93C46' }]} onPress={() => this._handleTask(activeUUID, 'rejected')}>
              <Text style={styles.optionBtnText}>{ I18n.t('base.popup.index.reject').toUpperCase() }</Text>
            </TouchableOpacity>
            : null
          }
          <TouchableOpacity style={[styles.optionBtn, { backgroundColor: '#3CC86B' }]} onPress={() => this._handleTask(activeUUID, 'claimed')}>
            <Text style={styles.optionBtnText}>{ I18n.t('base.popup.index.accept').toUpperCase() }</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  _renderGlitches() {
    const { glitches, users } = this.props;

    return (
      <View>
        <View style={styles.header}>
          <View style={styles.headerSide}></View>
          <Text style={styles.headerText}>New Experience(s)</Text>
          <View style={styles.headerSide}></View>
        </View>
        <View style={{ flex: 1 }}>
          <ListView
            data={glitches}
            renderRow={this._renderGlitch}
            />
        </View>
        <View style={styles.optionsRow}>
          <TouchableOpacity style={[styles.optionBtn, { ...blue.bg }]} onPress={this._handleGlitchAcknowledge}>
            <Text style={styles.optionBtnText}>OKAY</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  _renderGlitch(glitch) {
    return (
      <View style={styles.glitchItem}>
        <Text style={styles.glitchCategory}>{ glitch.category }</Text>
        <Text style={styles.glitchDesc}>{ glitch.description}</Text>
        <Text style={styles.glitchRoom}>{ glitch.room_name } · { moment.unix(glitch.date_ts).format('LT') }</Text>
      </View>
    )
  }

  render() {
    const { tasks, notifications, glitches, assignedAudits } = this.props;
    const { viewedTasks , viewedAudits } = this.state;

    const availableTasks = tasks.filter(task => !viewedTasks.includes(task.uuid));
    const availableAudits = assignedAudits.filter(audit => !viewedAudits.includes(audit.id));
    const isOpen = get(notifications, 'length') > 0
                || get(availableTasks, 'length') > 0
                || get(glitches, 'length') > 0
                || get(availableAudits, 'length') > 0;

    if (!isOpen) {
      return null;
    }

    return (
      <Modal
        style={[styles.modal]}
        position={"center"}
        ref={"modal3"}
        backdropPressToClose={false}
        swipeToClose={false}
        backdropColor={'#4a4a4a'}
        isOpen={isOpen}>

        { notifications.length ?
          this._renderNotification(notifications)
          : availableTasks.length ?
          this._renderTask(availableTasks)
          : glitches.length ?
          this._renderGlitches()
          : availableAudits.length ?
          this._renderAudit(availableAudits) :
          null
        }
      </Modal>
    )
  }
}

const window = Dimensions.get('window')
const modalWidth = window.width > window.height ? window.width * 0.45 : window.width * 0.75;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0
  },
  modal: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingBottom: 5,
    borderRadius: 5,
    height: window.height * 0.9,
    width: modalWidth,
  },
  header: {
    width: modalWidth,
    backgroundColor: '#198CFF',
    height: 50,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  headerSide: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white'
  },
  taskText: {
    color: '#4a4a4a',
    fontSize: 19
  },
  imageStyle: {
    height: 128,
    width: 128
  },
  imageContainer: {
    height: 128,
    width: 128,
    ...margin.b20,
    ...margin.t10
  },
  assetText: {
    fontSize: 20,
    fontWeight: '500',
    ...slate.text
  },
  actionText: {
    fontSize: 18,
    fontWeight: '500',
    ...slate.text,
    opacity: .8
  },
  metaTitle: {
    fontSize: 14,
    opacity: .9,
    fontWeight: 'bold',
    ...slate.text,
    ...margin.t15,
    marginBottom: 3
  },
  metaText: {
    fontSize: 17,
    ...slate.text,
  },
  messageContainer: {
    flexDirection: 'row',
    minHeight: 50
  },
  messageImageContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  messageMessageContainer: {

  },
  messageText: {

  },
  messageDetails: {

  },
  spacer: {
    flex: 1
  },
  optionBtn: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    borderRadius: 5,
    margin: 3
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // ...greyLt.bg
  },
  optionBtnText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600'
  },
  glitchItem: {
    ...padding.x10,
    ...padding.y5,
    borderBottomColor: greyLt.color,
    borderBottomWidth: 1
  },
  glitchCategory: {
    fontSize: 17,
    ...slate.text,
    marginBottom: 6
  },
  glitchDesc: {
    fontSize: 15,
    ...slate.text,
    ...margin.b10
  },
  glitchRoom: {
    fontSize: 14,
    ...greyDk.text
  },
  glitchTime: {
    fontSize: 14,
    ...greyDk.text
  },
});

const mapStateToProps = (state, props) => {
  const tasks = props.isAttendantApp ?
    computedAttendantPopupTasks(state)
    : props.isMaintenanceApp ?
    computedMaintenancePopupTasks(state)
    : props.isRunnerApp ?
    computedRunnerPopupTasks(state)
    :
    computedPopupTasks(state);

  const notifications = props.isAttendantApp ?
    computedAttendantPopupNotifications(state)
    : props.isRunnerApp ?
    computedRunnerPopupNotifications(state)
    : computedDefaultPopupNotifications(state);

  return {
    tasks,
    glitches: computedPopupGlitches(state),
    // notifications: computedPopupNotifications(state),
    notifications,
    indexUsers: computedIndexedUsers(state),
    assignedAudits: computedAssignedAudits(state)
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateBatchTask: (tasks) => dispatch(UpdatesActions.taskUpdateBatch(tasks)),
    updateTask: (uuid, status) => dispatch(UpdatesActions.taskUpdate({ uuid, status })),
    acknowledgeGlitch: (uuid) => dispatch(GlitchesActions.glitchAcknowledge(uuid)),
    batchAcknowledgeGlitch: (entries) => dispatch(GlitchesActions.glitchBatchAcknowledge(entries)),
    dispatch
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(PopupLayout);
