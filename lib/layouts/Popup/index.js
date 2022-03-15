import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  InteractionManager,
  StyleSheet,
  FlatList
} from 'react-native';
// import Modal from 'react-native-modalbox';
import Modal from "react-native-modal";
import I18n from 'react-native-i18n'
import ListView from 'rc-mobile-base/lib/components/ListView';
import Lightbox from 'react-native-lightbox';
import Icon from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import checkEqual from 'rc-mobile-base/lib/utils/check-equal';
import NavigationService from 'rc-mobile-base/lib/utils/navigation-service';

import {
  flexGrow1,
  red,
  blue,
  blueLt,
  white,
  slate,
  greyLt,
  grey,
  black,
  aic,
  orange,
  jcc,
  greyDk,
  grey400,
  green,
  padding,
  margin,
  flx1,
  blueDk,
  splashBg,
  themeTomato
} from 'rc-mobile-base/lib/styles';

import moment from 'moment';
import { get } from 'lodash/object';
import { last, difference, first, differenceBy } from 'lodash/array';
import { find, filter } from 'lodash/collection';

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
import SocketRoomActions from 'rc-mobile-base/lib/actions/socketRooms';
import bellhop from 'rc-mobile-base/lib/images/bellhop.png';
import { isEmpty } from 'lodash';

import icon_location from 'rc-mobile-base/lib/images/icons/icon_location.png';

class PopupLayout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewedTasks: [],
      updatedTasks: [],
      viewedAudits: [],
      arrivedMessage: []
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
      || !checkEqual(this.props, nextProps, 'glitches')
      || !checkEqual(this.props, nextProps, 'hotelMessages')
      || !checkEqual(this.props, nextProps, 'socketHotelMessages');
  }

  componentWillReceiveProps(nextProps) {
    const newMessage = get(nextProps, 'hotelMessages', []);
    const currentMessage = get(this.props, 'hotelMessages', []);

    if (newMessage.length !== currentMessage.length) {
      const newlyArrived = differenceBy(newMessage, currentMessage, 'id')
      this.setState({ arrivedMessage: newlyArrived })
    }
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
      updatedTasks: [...updatedTasks, { taskId: uuid, status }],
      viewedTasks: [...viewedTasks, uuid]
    });
    // this.props.updateTask(uuid, status);
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
      <View style={{ justifyContent: 'flex-start', alignItems: 'center', flex: 1 }}>
        <View style={styles.header}>
          <View style={styles.headerSide}></View>
          <Text style={styles.headerText}>{I18n.t('base.popup.index.assigned-audit').toUpperCase()}</Text>
          <TouchableOpacity style={styles.headerSide} onPress={() => this._handleDismissAudit(firstAudit, false)}>
            <Entypo name="cross" color="white" size={32} />
          </TouchableOpacity>
        </View>

        <View style={[aic, padding.x10, padding.y15, flx1]}>
          <Text style={styles.assetText}>{auditName}</Text>
          <Text style={styles.metaTitle}>{I18n.t('base.popup.index.location').toUpperCase()}</Text>
          <Text style={styles.metaText}>{auditRoom || I18n.t('base.ubiquitous.no-location')}</Text>
          <Text style={styles.metaTitle}>{I18n.t('base.popup.index.submitted-time').toUpperCase()}</Text>
          <Text style={styles.metaText}>{moment(firstAudit.created_at).fromNow()}</Text>
          <View style={[flx1,]}></View>

          <View style={styles.optionsRow}>
            <TouchableOpacity style={[styles.optionBtn, grey.bg]} onPress={() => this._handleDismissAudit(firstAudit, false)}>
              <Text style={styles.optionBtnText}>{I18n.t('base.ubiquitous.close').toUpperCase()}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.optionBtn, { backgroundColor: '#3CC86B' }]} onPress={() => this._handleDismissAudit(firstAudit, true)}>
              <Text style={styles.optionBtnText}>{I18n.t('base.ubiquitous.start').toUpperCase()}</Text>
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
      <View style={{ justifyContent: 'flex-start', alignItems: 'center', flex: 1 }}>
        <View style={styles.header}>
          <View style={styles.headerSide}></View>
          <Text style={styles.headerText}>{I18n.t('base.popup.index.notification').toUpperCase()}</Text>
          <View style={styles.headerSide}></View>
        </View>

        <ScrollView contentContainerStyle={[aic, padding.x10]}>
          {image ?
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

          <Text style={styles.assetText}>{task}</Text>

          <Text style={styles.metaTitle}>{I18n.t('base.popup.index.location').toUpperCase()}</Text>
          <Text style={styles.metaText}>{location || I18n.t('base.ubiquitous.no-location')}</Text>

          <Text style={styles.metaTitle}>{I18n.t('base.popup.index.created-by').toUpperCase()}</Text>
          <Text style={styles.metaText}>{`${user.first_name} ${user.last_name}`}</Text>

          <Text style={styles.metaTitle}>{I18n.t('base.popup.index.submitted-time').toUpperCase()}</Text>
          <Text style={styles.metaText}>{moment.unix(date_ts).fromNow()}</Text>
          <View style={[margin.b10]}></View>
        </ScrollView>

        <View style={[styles.optionsRow]}>
          <TouchableOpacity style={[styles.optionBtn, { backgroundColor: '#3CC86B' }]} onPress={() => this._handleUpdate(activeUUID, 'completed')}>
            <Text style={styles.optionBtnText}>{I18n.t('base.popup.index.okay').toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  onDismissMessage = (activeID) => {
    const { updateSocketMessage } = this.props;
    updateSocketMessage(activeID)
  }

  _renderRoomMessage(messages) {
    const { indexUsers, isDismissEnable, hotelRooms } = this.props;
    const firstMessage = get(messages, 0, {});

    const activeID = get(firstMessage, 'id');
    const roomMessage = get(firstMessage, 'message', '');
    const mapRoomId = get(firstMessage, 'messageRooms', []).map(item => item.roomId);
    const mapMessageRoom = mapRoomId.map(item => find(hotelRooms, { id: item }))
    const createdBy = get(firstMessage, 'createdByName', '');
    const date_ts = get(firstMessage, 'createdAt');

    return (
      <View
        style={styles.taskModalInnerContainer}
      >
        <View style={styles.headerContainer}>
          <View style={styles.horizontalContainer}>
            <Text style={[styles.headerTitle, { flex: 1 }]}>{I18n.t('attendant.alert.index.room-message')}</Text>
          </View>

          <View style={styles.closeButtonContainer}>
            <TouchableOpacity style={[flexGrow1, { alignItems: 'center', justifyContent: 'center' }]} onPress={() => this.onDismissMessage(activeID)}>
              <Ionicons name="ios-close-outline" color="white" size={28} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.alertBodyContainer}>
          <Text style={styles.taskTitle}>{roomMessage}</Text>

          <View style={[margin.t30, margin.b10, { flexDirection: 'column' }]}>
            {mapMessageRoom.map(item => {
              return (
                <View style={[{ flexWrap: 'wrap', height: 40, alignItems: 'center', justifyContent: 'center' }]}>
                  <SimpleLineIcons
                    name="location-pin"
                    size={30}
                  />
                  <Text style={[styles.bodyTitle, { marginLeft: 12 }]}>{get(item, 'name', '')}, {get(item, 'floorName', 'No Location')}</Text>
                </View>
              )
            })}
          </View>

          <View style={styles.separatorLine}></View>

          <View style={styles.horizontalContainer}>
            <View style={[styles.locationContainer, flexGrow1]}>
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.creatorTitle}>{I18n.t('base.popup.index.created-by')}</Text>
                <Text style={[styles.creatorTitle, { fontWeight: '500' }]}>{createdBy}</Text>
              </View>
            </View>

            <View style={{ flexShrink: 1, alignItems: 'flex-end', justifyContent: 'flex-start' }}>
              <Text style={[styles.creatorTitle, { lineHeight: 30 }]}>{moment(date_ts).fromNow()}</Text>
            </View>

          </View>


          <View style={[styles.bottomContainer, { paddingTop: 10 }]}>
            <TouchableOpacity style={[styles.optionBtn, { backgroundColor: '#3CC86B', width: '45%' }]} onPress={() => this.onDismissMessage(activeID)}>
              <Text style={styles.optionBtnText}>{I18n.t('base.popup.index.okay').toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  _renderTaskImages = (item, index, totalLength) => {
    return (
      <View style={[styles.taskImageCell]}>
        <Image source={{ uri: item }} style={styles.taskImage} />
      </View>
    )
  }

  _renderTask(tasks) {
    const { indexUsers, isDismissEnable, hotelRooms } = this.props;
    const firstTask = get(tasks, 0, {});

    const roomId = get(firstTask, 'meta.room_id', "");
    const activeUUID = get(firstTask, 'uuid');
    const [asset, action] = get(firstTask, 'task', ": ").split(": ");
    const image = get(firstTask, 'meta.image', null);
    const lastMessage = last(get(firstTask, 'messages', []));
    const isMandatory = get(firstTask, 'assigned.is_mandatory', false);
    const createdBy = get(firstTask, 'assigned.label', false);
    const location = get(firstTask, 'meta.location', "");
    const roomName = get(firstTask, 'roomName', "");
    const taskComment = get(firstTask, 'comment', "");

    const date_ts = get(firstTask, 'date_ts');
    const user = get(indexUsers, get(firstTask, 'creator_id'));
    const userType = get(user, 'type', null);
    console.log(user)
    const creatorImage = get(user, 'image', null);
    const isPriority = get(firstTask, 'is_priority');
    const isGuest = get(firstTask, 'meta.isGuest', false);
    const taskImages = get(firstTask, 'image_urls', []);

    return (
      <View
        style={styles.taskModalInnerContainer}
      >
        <View style={styles.headerContainer}>
          <View style={styles.horizontalContainer}>
            <Text style={[styles.headerTitle, { flex: 1 }]}>{I18n.t('base.popup.index.new-task')}</Text>
            {/* <View style={[styles.locationRightContainer]}>
              {isGuest ?
                <MaterialCommunityIcons
                  name="playlist-star"
                  color={red.color}
                  size={48}
                  style={{ marginRight: 4 }}
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
            </View> */}
          </View>

          {isDismissEnable &&
            <View style={styles.closeButtonContainer}>
              <TouchableOpacity style={[flexGrow1, { alignItems: 'center', justifyContent: 'center' }]} onPress={() => this._handleDismiss(activeUUID)}>
                <Ionicons name="ios-close-outline" color="white" size={38} />
              </TouchableOpacity>
            </View>
          }
        </View>

        <View style={styles.alertBodyContainer}>
          {asset.split(/\s*,\s*/).map((item, index) => {
            return (
              <Text style={styles.taskTitle}>{item}</Text>
            )
          })}

          <Text style={[styles.fromNowTitle, { lineHeight: 30 }]}>{moment.unix(date_ts).fromNow()}</Text>

          <View style={styles.horizontalContainer}>
            <View style={[styles.locationContainer, margin.t20, margin.b20, flx1]}>
              <Image source={icon_location} style={styles.locationIcon} />
              <Text style={[styles.bodyTitle, { marginLeft: 10 }]}>{I18n.t('base.popup.index.location')}</Text>
            </View>

            <View style={{ alignSelf: 'center', alignItems: 'center', justifyContent: 'center', ...margin.t10, ...margin.b10 }}>
              <Text style={[styles.bodyTitle, { marginLeft: 12, textAlign: 'center' }]}>{roomName || "No Location"}</Text>
            </View>
          </View>

          <View style={{ width: '100%', marginBottom: isEmpty(taskImages) ? 0 : 20 }}>
            {!isEmpty(taskImages)
              ?
              <FlatList
                data={taskImages}
                keyExtractor={(item, index) => index.toString()}
                numColumns={3}
                renderItem={({ item, index }) => this._renderTaskImages(item, index, get(taskImages.length))}
              />
              : null
            }
          </View>

          <View style={{ marginBottom: 18 }}>
            {taskComment
              ?
              <>
                <Text style={styles.commentTitle}>Comments</Text>
                <Text style={styles.commentText}>{taskComment}</Text>
              </> : null
            }
          </View>
          
          <View style={{ width: '100%' }}>
            <Text style={styles.bodyTitle}>{I18n.t('base.popup.index.created-by')}</Text>

            <View style={[styles.horizontalContainer, { paddingVertical: 18 }]}>
              <View style={[styles.locationContainer, flexGrow1]}>
                <View style={styles.roundedImageContainer}>
                  {creatorImage
                    &&
                    <Image source={{ uri: creatorImage }} style={styles.roundedImage} />
                  }
                </View>

                <View style={{ marginLeft: 10 }}>
                  <Text style={[styles.taskCreatorTitle, { fontWeight: '500' }]}>{user ? `${user.first_name} ${user.last_name}` : ''}</Text>
                  <Text style={[styles.taskCreatorTitle, { fontSize: 18 }]}>{userType ? userType : ''}</Text>
                </View>
              </View>
            </View>
          </View>

         

          <View style={styles.bottomContainer}>
            {!isMandatory ?
              <TouchableOpacity style={[styles.taskOptionBtn, blueDk.bc, { backgroundColor: 'transparent', width: '45%' }]} onPress={() => this._handleTask(activeUUID, 'rejected')}>
                <Text style={[styles.taskOptionBtnText, blueDk.text]}>{I18n.t('base.popup.index.reject').toUpperCase()}</Text>
              </TouchableOpacity>
              : null
            }
            <TouchableOpacity style={[styles.taskOptionBtn, { backgroundColor: themeTomato.color, width: !isMandatory ? '45%' : '100%' }]} onPress={() => this._handleTask(activeUUID, 'claimed')}>
              <Text style={styles.taskOptionBtnText}>{I18n.t('base.popup.index.accept').toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
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
        <Text style={styles.glitchCategory}>{glitch.category}</Text>
        <Text style={styles.glitchDesc}>{glitch.description}</Text>
        <Text style={styles.glitchRoom}>{glitch.room_name} · {moment.unix(glitch.date_ts).format('LT')}</Text>
      </View>
    )
  }

  render() {
    const { tasks, notifications, glitches, assignedAudits, socketHotelMessages } = this.props;
    const { viewedTasks, viewedAudits, arrivedMessage } = this.state;

    const availableTasks = tasks.filter(task => !viewedTasks.includes(task.uuid));
    const availableAudits = assignedAudits.filter(audit => !viewedAudits.includes(audit.id));

    const isOpen = get(notifications, 'length') > 0
      || get(availableTasks, 'length') > 0
      || get(glitches, 'length') > 0
      || get(availableAudits, 'length') > 0
      || get(socketHotelMessages, 'length') > 0;

    if (!isOpen) {
      return null;
    }

    return (
      <Modal
        style={[(availableTasks.length || socketHotelMessages.length) ? styles.taskModal : styles.modal]}
        // position={"center"}
        ref={"modal3"}
        backdropPressToClose={false}
        swipeToClose={false}
        backdropColor={'#4a4a4a'}
        isVisible={isOpen}>
        {notifications.length ?
          this._renderNotification(notifications)
          : availableTasks.length ?
            this._renderTask(availableTasks)
            : glitches.length ?
              this._renderGlitches()
              : availableAudits.length ?
                this._renderAudit(availableAudits)
                : socketHotelMessages.length ?
                  this._renderRoomMessage(socketHotelMessages) : null
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
    alignSelf: 'center',
    backgroundColor: 'white',
    paddingBottom: 5,
    borderRadius: 5,
    height: window.height * 0.9,
    width: modalWidth,
  },
  taskModal: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 12,
    width: window.width * 0.85,
    overflow: 'hidden'
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

  // new alert
  taskModalInnerContainer: {
    justifyContent: 'flex-start',
    alignSelf: 'center',
    alignItems: 'center',
    height: 'auto',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden'
  },
  headerContainer: {
    padding: 18,
    flexGrow: 1,
    width: '100%',
    ...splashBg.bg,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 28,
    lineHeight: 48,
    ...white.text,
    fontWeight: '700',
    textAlign: 'center'
  },
  headerSubTitle: {
    fontSize: 18,
    ...white.text,
  },
  closeButtonContainer: {
    height: 44,
    width: 44,
    borderRadius: 22,
    alignSelf: 'center',
    right: 22,
    position: 'absolute',
    // backgroundColor: 'rgba(255,255,255,0.15)'
  },
  alertBodyContainer: {
    flexGrow: 1,
    width: '100%',
    padding: 18,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  bodyTitle: {
    fontSize: 26,
    ...black.text,
    fontWeight: '500',
    textAlign: 'left'
  },
  taskTitle: {
    fontSize: 25,
    lineHeight: 40,
    ...splashBg.text,
    textAlign: 'left',
    fontWeight: '700'
  },
  horizontalContainer: {
    flexDirection: 'row'
  },
  locationContainer: {
    flex: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationRightContainer: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationIcon: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain'
  },
  separatorLine: {
    height: 1,
    width: '100%',
    marginVertical: 18,
    ...greyDk.bg,
  },
  roundedImageContainer: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: '#ccc',
    overflow: 'hidden'
  },
  roundedImage: {
    height: 60,
    width: 60,
    resizeMode: 'contain'
  },
  creatorTitle: {
    fontSize: 16,
    lineHeight: 25,
    ...black.text,
    textAlign: 'left'
  },
  fromNowTitle: {
    fontSize: 16,
    lineHeight: 25,
    ...slate.text,
    textAlign: 'left'
  },
  commentDescription: {
    fontSize: 16,
    lineHeight: 22,
    color: '#808080',
    textAlign: 'left'
  },
  bottomContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },

  taskImageCell: {
    height: (window.width * 0.85 - 36) / 3.3,
    width: (window.width * 0.85 - 36) / 3.3,
    margin: 5,
    borderRadius: 5,
    overflow: 'hidden'
  },
  taskImage: {
    flex: 1,
    resizeMode: 'cover'
  },
  taskCreatorTitle: {
    fontSize: 20,
    lineHeight: 25,
    ...black.text,
    textAlign: 'left'
  },
  taskOptionBtn: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderRadius: 5,
    margin: 3
  },
  taskOptionBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  commentTitle: {
    fontSize: 22,
    lineHeight: 35,
    fontWeight: '700',
    ...greyDk.text,
    textAlign: 'left'
  },
  commentText: {
    fontSize: 20,
    lineHeight: 35,
    ...black.text,
    fontWeight: '600',
    textAlign: 'left'
  }
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
    hotelRooms: state.rooms.hotelRooms,
    hotelMessages: state.rooms.hotelMessages,
    socketHotelMessages: state.socketRooms.socketHotelMessages,
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
    updateSocketMessage: (messageId) => dispatch(SocketRoomActions.updatesocketMessage(messageId)),
    dispatch
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(PopupLayout);
