import React, { createRef } from 'react';
import { View, SafeAreaView, Text, Platform, Image } from 'react-native';
import styles from './styles';

import StepIndicator from 'react-native-step-indicator';
import PagerView from 'react-native-pager-view';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { splashBg } from 'rc-mobile-base/lib/styles';
import I18n from 'react-native-i18n';

import SelectedAssets from './SelectedAssets';
import SelectLocation from './SelectLocation';
import AssignmentSelect from './AssignmentSelect';
import TaskOptions from './TaskOptions';

import { get, uniq, map, filter, groupBy, at, keyBy, omit, flatten, values, compact, isEmpty, uniqBy, intersection, isEqual } from 'lodash';

import { connect } from "react-redux";
import { getFormValues } from "redux-form";
import {
  locationsSelector,
  assignmentSelector,
  assignmentSelectorForModal
} from "./selectors";
import { computedAssets } from "rc-mobile-base/lib/selectors/assets";
import { getRoomById } from "../../selectors/rooms";
import UpdatesActions from "rc-mobile-base/lib/actions/updates";
import { ErrorState, SendingState, SentState } from "./TaskStates";
import { difference, first } from 'lodash/array';

const PAGES = ['Page 1', 'Page 2', 'Page 3', 'Page 4'];

const diableStrokeColor = '#b8c4e1'

const stepIndicatorStyles = {
  stepIndicatorSize: 60,
  currentStepIndicatorSize: 60,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 1,
  stepStrokeCurrentColor: diableStrokeColor,
  stepStrokeWidth: 1,
  stepStrokeFinishedColor: splashBg.color,
  stepStrokeUnFinishedColor: diableStrokeColor,
  separatorFinishedColor: splashBg.color,
  separatorUnFinishedColor: diableStrokeColor,
  stepIndicatorFinishedColor: splashBg.color,
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 0,
  currentStepIndicatorLabelFontSize: 0,
  stepIndicatorLabelCurrentColor: 'transparent',
  stepIndicatorLabelFinishedColor: 'transparent',
  stepIndicatorLabelUnFinishedColor: 'transparent',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: splashBg.color,
};


class CreateTask extends React.Component {
  constructor(props) {
    super(props);

    this.pagerRef = createRef()

    this.state = {
      currentPage: 0,
      isGuestReq: null,
      isPriority: null,
      isMandatory: null,
      isBlocking: null,
      isSentTask: false,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { isSendingTask } = prevProps;
    const { isSentTask } = prevState;
    const { isSendingTask: nextIsSendingTask } = this.props;
    const { isSentTask: nextIsSentTask, taskError: nextTaskError } = this.state;

    if (nextTaskError) {
      return;
    }

    if (isSendingTask && isSentTask && !nextIsSendingTask && !nextTaskError) {
      setTimeout(() => {
        this.props.navigation.goBack();
      }, 2000);
    }
  }

  onStepPress = async (position) => {
    const { currentPage } = this.state;
    const isPrevious = currentPage > position;

    if (isPrevious) {
      this.pagerRef.current.setPage(position)
    } else {
      const isRedyToNext = await this.validateInput(position);
      if (isRedyToNext) {
        this.pagerRef.current.setPage(position)
      }
    }
  }

  stepFromPagination = async (position) => {
    const { currentPage } = this.state;
    const isPrevious = currentPage > position;

    if (isPrevious) {
      this.pagerRef.current.setPage(position)
      this.setState({ currentPage: position });
    } else {
      const isRedyToNext = await this.validateInput(position);
      if (isRedyToNext) {
        this.setState({ currentPage: position });
      }
    }
    // this.pagerRef.current.setPage(position)
  }

  onNextPage = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage + 1 });

    this.onStepPress(currentPage + 1)
  }

  validateInput = (position) => {
    return new Promise((resolve, reject) => {
      const { currentPage } = this.state;
      const { selectedLocations } = this.props;

      const selectedAssets = get(this, 'SelectLocation.state.updatedAssets', []);
      const validateAssets = map(filter(selectedAssets, ['isSelected', true]), 'id');
      const actionId = get(this, 'SelectLocation.state.selectedAction', []);

      const selectedAssignments = get(this, 'AssignmentSelect.state.assigneeHolder', []);
      const mapSelectedSubGroup = uniqBy(flatten(map(selectedAssignments, 'userSubGroup')), 'value');
      const userSubGroupIds = map(filter(mapSelectedSubGroup, ['isSelected', true]), 'value');
      // const userGroupIds = map(filter(mapSelectedSubGroup, ['isSelected', true]), 'groupId');

      const selectedAssigneeUserFromGroup = uniq(map(filter(flatten(map(mapSelectedSubGroup, 'subGroupUsers')), ['isSelected', true]), 'value'));
      const mapSoloAssignee = uniqBy(flatten(map(selectedAssignments, 'groupUsers')), 'value');
      const selectedSoloAssigneeUser = uniq(map(filter(mapSoloAssignee, ['isSelected', true]), 'value'));
      const userIds = uniq([...selectedAssigneeUserFromGroup, ...selectedSoloAssigneeUser])
      const mapAllAssigneeForGroup = map(selectedAssignments, 'groupUsers');

      let userGroupIds = [];

      map(mapAllAssigneeForGroup, function (o) {
        const mapAssigneeByGroup = map(o, 'value');

        const isAllUserInGroup = intersection(userIds, mapAssigneeByGroup).length === mapAssigneeByGroup.length;

        if (isAllUserInGroup) {
          userGroupIds.push(get(first(o), 'groupId'));
        }
      })

      const finalAssignee = compact([...userGroupIds, ...userSubGroupIds, ...userIds])

      if (currentPage === 0 && position === 0) {
        resolve(true);
        return;
      }

      switch (currentPage) {
        case 0:
          if (position === 2) {
            if (!selectedLocations) {
              alert('Please select location!!');
              resolve(false)
              return true;
            } else if (get(validateAssets, 'length') <= 0) {
              alert('Please select asset!!');
              resolve(false)
              return true;
            } else if (get(actionId, 'length') <= 0) {
              alert('Please select asset action!!');
              resolve(false)
              return true;
            }
          } else if (position === 3) {
            if (isEmpty(finalAssignee)) {
              alert(`Please select ${I18n.t('base.ubiquitous.assignments')}`);
              resolve(false)
              return true;
            }
          }
          break;

        case 1:
          if (position !== 1) {
            if (!selectedLocations) {
              alert('Please select location!!');
              resolve(false)
              return true;
            } else if (get(validateAssets, 'length') <= 0) {
              alert('Please select asset!!');
              resolve(false)
              return true;
            } else if (get(actionId, 'length') <= 0) {
              alert('Please select asset action!!');
              resolve(false)
              return true;
            }
          }

          break;

        case 2:
          if (isEmpty(finalAssignee)) {
            if (position !== 2) {
              alert(`Please select ${I18n.t('base.ubiquitous.assignments')}`);
              resolve(false)
              return true;
            }
          }
          break;

        case 3:
          if (!selectedLocations) {
            alert('Please select location!!');
            resolve(false)
            return true;
          } else if (get(validateAssets, 'length') <= 0) {
            alert('Please select asset!!');
            resolve(false)
            return true;
          } else if (get(actionId, 'length') <= 0) {
            alert('Please select asset action!!');
            resolve(false)
            return true;
          } else if (isEmpty(finalAssignee)) {
            alert(`Please select ${I18n.t('base.ubiquitous.assignments')}`);
            resolve(false)
            return true;
          }
          break;

        default:
          break;
      }

      resolve(true)
    })
  }

  handleSubmit = () => {
    const { selectedLocations, assignmentOptions } = this.props;
    const { isPriority, isGuestReq } = this.state;

    const assetsHolder = get(this, 'SelectedAssets.state.assetsHolder', []);

    const selectedAssets = get(this, 'SelectLocation.state.updatedAssets', []);
    const validateAssets = map(filter(selectedAssets, ['isSelected', true]), 'id');
    const actionId = get(this, 'SelectLocation.state.selectedAction', []);
    const description = get(this, 'SelectLocation.state.desc', '');

    const selectedAssignments = get(this, 'AssignmentSelect.state.assigneeHolder', []);
    const mapSelectedSubGroup = uniqBy(flatten(map(selectedAssignments, 'userSubGroup')), 'value');
    const userSubGroupIds = compact(map(filter(mapSelectedSubGroup, ['isSelected', true]), 'value'));
    // const userGroupIds = map(filter(mapSelectedSubGroup, ['isSelected', true]), 'groupId');

    const selectedAssigneeUserFromGroup = uniq(map(filter(flatten(map(mapSelectedSubGroup, 'subGroupUsers')), ['isSelected', true]), 'value'));
    const mapSoloAssignee = uniqBy(flatten(map(selectedAssignments, 'groupUsers')), 'value');
    const selectedSoloAssigneeUser = uniq(map(filter(mapSoloAssignee, ['isSelected', true]), 'value'));
    const userIds = compact(uniq([...selectedAssigneeUserFromGroup, ...selectedSoloAssigneeUser]));

    const mapAllAssigneeForGroup = map(selectedAssignments, 'groupUsers');
    let userGroupIds = [];

    map(mapAllAssigneeForGroup, function (o) {
      const mapAssigneeByGroup = map(o, 'value');

      const isAllUserInGroup = intersection(userIds, mapAssigneeByGroup).length === mapAssigneeByGroup.length;

      if (isAllUserInGroup) {
        userGroupIds.push(get(first(o), 'groupId'));
      }
    })

    const finalAssignee = compact([...userGroupIds, ...userSubGroupIds, ...userIds])
    const validateLocation = uniq(map(get(selectedLocations, 'locations', []), 'id'))

    if (isEmpty(validateLocation)) {
      alert('Please select location!!');
      return true;
    } else if (get(validateAssets, 'length') <= 0) {
      alert('Please select asset!!');
      return true;
    } else if (get(actionId, 'length') <= 0) {
      alert('Please select asset action!!');
      return true;
    } else if (isEmpty(finalAssignee)) {
      alert(`Please select ${I18n.t('base.ubiquitous.assignments')}`);
      return true;
    }

    const data = {
      roomIds: validateLocation,
      assetId: validateAssets[0],
      actionId: actionId[0],
      quantity: 1,
      price: 0,
      credits: 0,
      comment: description,
      isHighPriority: isPriority == null ? false : isPriority,
      isGuestRequest: false,
      imageUrl: assetsHolder,
      startsAt: null,
      userIds: userIds,
      userGroupIds: compact(userGroupIds),
      userSubGroupIds: userSubGroupIds
    }

    this.props.createTask(data);
    this.setState({ isSentTask: true })
  }

  _handleUpdateGuestReq = v => {
    this.setState({ isGuestReq: v });
  };

  _handleUpdatePriority = v => {
    this.setState({ isPriority: v });
  };

  _handleUpdateMandatory = v => {
    this.setState({ isMandatory: v });
  };

  _handleUpdateBlocking = v => {
    this.setState({ isBlocking: v });
  };


  renderPagePerIndex = (index) => {
    const { room, locations, assets, isDisableLiteTasks, customActions, assignmentOptions, selectedLocations } = this.props;
    const { isPriority, isMandatory, isBlocking, isGuestReq } = this.state;
    const taskProps = {
      room: room,
      locations: locations,
      assets: assets,
      customActions: customActions,
      isDisableLiteTasks: isDisableLiteTasks,
      assignmentOptions: assignmentOptions,
      selectedLocations: selectedLocations,
      onNext: () => this.onNextPage(),

      isShowPriority: true,
      isGuestReq: isGuestReq,
      isPriority: isPriority,
      isMandatory: isMandatory,
      isBlocking: isBlocking,
      handleUpdateGuestReq: (v) => this._handleUpdateGuestReq(v),
      handleUpdatePriority: (v) => this._handleUpdatePriority(v),
      handleUpdateMandatory: (v) => this._handleUpdateMandatory(v),
      handleUpdateBlocking: (v) => this._handleUpdateBlocking(v),
      handleSubmit: () => this.handleSubmit()
    };

    // console.log('---- renderPagePerIndex ----');
    // console.log(assets)

    switch (index) {
      case 0:
        return <SelectedAssets ref={ref => this.SelectedAssets = ref} {...taskProps} />
      case 1:
        return <SelectLocation ref={ref => this.SelectLocation = ref} {...taskProps} />
      case 2:
        return <AssignmentSelect ref={ref => this.AssignmentSelect = ref} {...taskProps} />
      case 3:
        return <TaskOptions ref={ref => this.TaskOptions = ref} {...taskProps} />
      default:
        break;
    }
  }

  renderViewPagerPage = (data, index) => {
    return (
      <View key={data} style={[styles.pageContainer, { padding: index === 2 ? 0 : 20 }]}>
        {/* <Text>{data}</Text> */}
        {this.renderPagePerIndex(index)}
        {/* <SelectedAssets onNext={() => this.onNextPage()} /> */}
      </View>
    );
  };

  getStepIndicatorIconConfig = ({
    position,
    stepStatus,
  }) => {
    let iconConfig = null;
    switch (position) {
      case 0: {
        iconConfig = require('../../images/createTask/bi_camera.png');
        break;
      }
      case 1: {
        iconConfig = require('../../images/createTask/carbon_idea.png');
        break;
      }
      case 2: {
        iconConfig = require('../../images/createTask/ant-design_user-outlined.png');
        break;
      }
      case 3: {
        iconConfig = require('../../images/createTask/carbon_send.png');
        break;
      }
      default: {
        break;
      }
    }
    return <Image source={iconConfig} style={[styles.stepIndicatorIcon, { tintColor: stepStatus === 'finished' ? '#ffffff' : '#000' }]} />
  };

  renderStepIndicator = (params) => (
    this.getStepIndicatorIconConfig(params)
  );

  render() {
    const { currentPage, isSentTask } = this.state;
    const { taskError, isSendingTask } = this.props;

    if (taskError && isSentTask) {
      return <ErrorState onPress={() => this.props.navigation.goBack()} />;
    } else if (isSendingTask && isSentTask) {
      return <SendingState onPress={() => this.props.navigation.goBack()} />;
    } else if (isSentTask) {
      return <SentState onPress={() => this.props.navigation.goBack()} />;
    }

    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.rootContainer}>
          <View style={styles.stepIndicator}>
            <StepIndicator
              stepCount={4}
              customStyles={stepIndicatorStyles}
              currentPosition={currentPage + 1}
              renderStepIndicator={this.renderStepIndicator}
              onPress={(position) => this.onStepPress(position)}
            />
          </View>

          <PagerView
            style={{ flexGrow: 1 }}
            initialPage={0}
            ref={this.pagerRef}
            scrollEnabled={false}
            onPageSelected={(e) => this.stepFromPagination(e.nativeEvent.position)}>
            {PAGES.map((page, index) => this.renderViewPagerPage(page, index))}
          </PagerView>
        </View>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state, props) => {
  const roomId = get(props, "navigation.state.params.selectedRoom", null) || null;
  const department = get(props, "navigation.state.params.type", "all");

  return {
    room: (roomId && getRoomById(roomId)(state)) || null,
    locations: locationsSelector(state),
    assets: computedAssets(state),
    selectedLocations: getFormValues("taskLocations")(state),
    customActions: state.assets.hotelCustomActions,
    assignmentOptions: assignmentSelectorForModal(department)(state),
    isDisableLiteTasks: get(state, "auth.config.isDisableLiteTasks", false),
    taskError: state.updates.taskError,
    isSendingTask: state.updates.isSendingTask,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createTask: data => dispatch(UpdatesActions.taskCreate(data)),
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateTask);