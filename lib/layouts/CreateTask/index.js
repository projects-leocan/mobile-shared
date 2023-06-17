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
import _ from "lodash"
import { KeyboardAwareView } from 'react-native-keyboard-aware-view'

import { get, uniq, map, filter, groupBy, at, keyBy, omit, flatten, values, compact, isEmpty, uniqBy, intersection, isEqual } from 'lodash';

import { connect } from "react-redux";
import { getFormValues } from "redux-form";
import {
  locationsSelector,
  assignmentSelector,
  assignmentSelectorForModal,
  assigneeBySearch
} from "./selectors";
import { computedAssets } from "rc-mobile-base/lib/selectors/assets";
import { getRoomById } from "../../selectors/rooms";
import UpdatesActions from "rc-mobile-base/lib/actions/updates";
import FiltersActions from "rc-mobile-base/lib/actions/filters";
import { ErrorState, SendingState, SentState } from "./TaskStates";
import { difference, first } from 'lodash/array';
import { includes } from 'lodash/collection';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
      isGuestReq: false,
      isPriority: false,
      isMandatory: null,
      isBlocking: false,
      finalAssigns: [],
      isCaptureImage: false
    }
  }

  componentDidMount() {
    this.createAssigneeHolder()
  }

  createAssigneeHolder = () => {
    const { setGroupAssignee, assignmentOptions, setActiveGroupAssignee } = this.props;

    const validateOptions = assignmentOptions
      .map(option => {
        return {
          ...option,
          isSelected: false,
          groupUsers: map(get(option, 'groupUsers'), function (o) { return { ...o, isSelected: false } }),
          userSubGroup: map(get(option, 'userSubGroup'), function (o) { return { ...o, isSelected: false, subGroupUsers: map(get(o, 'subGroupUsers'), function (o) { return { ...o, isSelected: false } }) } }),
        }
      })

    setActiveGroupAssignee(validateOptions);
    setGroupAssignee(validateOptions);
  }

  componentDidUpdate(prevProps, prevState) {
    const { isSendingTask, isSentTask } = prevProps;
    // const { isSentTask } = prevState;
    const { isSendingTask: nextIsSendingTask, isSentTask: nextIsSentTask, } = this.props;
    const { taskError: nextTaskError } = this.state;

    if (nextTaskError) {
      return;
    }

    if (isSendingTask && !isSentTask && !nextIsSendingTask && nextIsSentTask && !nextTaskError) {
      setTimeout(() => {
        this.onPreviousScreen();
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

      const selectedAssignments = get(this, 'props.assigneeGroup', []);
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
    const { isPriority, isGuestReq, isBlocking } = this.state;

    const assetsHolder = get(this, 'SelectedAssets.state.assetsHolder', []);

    const selectedAssets = get(this, 'SelectLocation.state.updatedAssets', []);
    const validateAssets = map(filter(selectedAssets, ['isSelected', true]), 'id');
    const actionId = get(this, 'SelectLocation.state.selectedAction', []);
    const description = get(this, 'SelectLocation.state.desc', '');

    const selectedAssignments = get(this, 'props.assigneeGroup', []);
    const userGroupIds = compact(uniq(map(filter(selectedAssignments, ['isSelected', true]), 'value')));

    const mapSelectedSubGroup = uniqBy(flatten(map(selectedAssignments, 'userSubGroup')), 'value');
    const excluseSubGroupOnGroup = filter(mapSelectedSubGroup, function (o) { return !includes(userGroupIds, get(o, 'groupId', null)) });
    const userSubGroupIds = compact(map(filter(excluseSubGroupOnGroup, ['isSelected', true]), 'value'));
    // const userGroupIds = map(filter(mapSelectedSubGroup, ['isSelected', true]), 'groupId');

    const selectedAssigneeUserFromGroup = filter(flatten(map(mapSelectedSubGroup, 'subGroupUsers')), ['isSelected', true]);
    const excludeUserFromGroupAnsSubGroup = filter(selectedAssigneeUserFromGroup, function (o) { return !(includes(userGroupIds, get(o, 'groupId', null)) || includes(userSubGroupIds, get(o, 'subGroupId', null))) });
    const selectedUserAssignee = uniq(map(excludeUserFromGroupAnsSubGroup, 'value'));

    const mapSoloAssignee = uniqBy(flatten(map(selectedAssignments, 'groupUsers')), 'value');
    // const selectedSoloAssigneeUser = uniq(map(filter(mapSoloAssignee, ['isSelected', true]), 'value'));
    const selectedSoloAssigneeUser = uniq(map(filter(mapSoloAssignee, function (o) {
      return (o.isSelected && !includes(userGroupIds, get(o, 'groupId', null)))
    }), 'value'));
    const userIds = compact(uniq([...selectedUserAssignee, ...selectedSoloAssigneeUser]));

    const mapAllAssigneeForGroup = map(selectedAssignments, 'groupUsers');

    // map(mapAllAssigneeForGroup, function (o) {
    //   const mapAssigneeByGroup = map(o, 'value');

    //   const isAllUserInGroup = intersection(userIds, mapAssigneeByGroup).length === mapAssigneeByGroup.length;

    //   if (isAllUserInGroup) {
    //     userGroupIds.push(get(first(o), 'groupId'));
    //   }
    // })

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
      isGuestRequest: isGuestReq == null ? false : isGuestReq,
      imageUrl: assetsHolder,
      startsAt: null,
      userIds: userIds,
      userGroupIds: userGroupIds,
      userSubGroupIds: userSubGroupIds,
      isBlocking: isBlocking == null ? false : isBlocking
    }
    this.props.createTask(data);
    this.props.navigation.goBack();
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

  handleDefaultAssignee = (defaultAssignee) => {
    if (this.AssignmentSelect) {
      this.AssignmentSelect.setDefaultAssignee(defaultAssignee);
    }

    if (!_.isEmpty(defaultAssignee)) {
      if (!defaultAssignee[0]?.defaultAssignedToUserGroupId && !defaultAssignee[0]?.defaultAssignedToUserId && !defaultAssignee[0]?.defaultAssignedToUserSubGroupId) {
        this.setState({ finalAssigns: [] })
      }
      else {
        let finalAssignyArray = []
        defaultAssignee[0]?.defaultAssignedToUserGroupId ? finalAssignyArray.push(defaultAssignee[0]?.defaultAssignedToUserGroupId) :
          defaultAssignee[0]?.defaultAssignedToUserId ? finalAssignyArray.push(defaultAssignee[0]?.defaultAssignedToUserId) :
            defaultAssignee[0]?.defaultAssignedToUserSubGroupId ? finalAssignyArray.push(defaultAssignee[0]?.defaultAssignedToUserSubGroupId) : finalAssignyArray = []

        this.setState({ finalAssigns: finalAssignyArray })
      }
    }
    else {
      this.setState({ finalAssigns: [] })
    }

  }

  onTakeImages = (data) => {
    this.setState({ isCaptureImage: data })
  }

  renderPagePerIndex = (index, displayAssignation) => {
    const { room, locations, assets, isDisableLiteTasks, customActions, assignmentOptions, selectedLocations, assigneeGroup,
      setGroupAssignee, searchAssignee, originalAssigneeGroup, setActiveGroupAssignee, isAttendantApp } = this.props;
    const { isPriority, isMandatory, isBlocking, isGuestReq, finalAssigns, isCaptureImage } = this.state;
    const taskProps = {
      room: room,
      locations: locations,
      assets: assets,
      customActions: customActions,
      isDisableLiteTasks: isDisableLiteTasks,
      assignmentOptions: assignmentOptions,
      selectedLocations: selectedLocations,
      assigneeGroup: assigneeGroup,
      originalAssigneeGroup: originalAssigneeGroup,
      searchAssignee: get(searchAssignee, 'search', null),
      handleDefaultAssignee: (data) => this.handleDefaultAssignee(data),
      onNext: () => this.onNextPage(),

      isShowPriority: true,
      isGuestReq: isGuestReq,
      isPriority: isPriority,
      isMandatory: isMandatory,
      isBlocking: isBlocking,
      setGroupAssignee: (data) => setGroupAssignee(data),
      setActiveGroupAssignee: (data) => setActiveGroupAssignee(data),
      handleUpdateGuestReq: (v) => this._handleUpdateGuestReq(v),
      handleUpdatePriority: (v) => this._handleUpdatePriority(v),
      handleUpdateMandatory: (v) => this._handleUpdateMandatory(v),
      handleUpdateBlocking: (v) => this._handleUpdateBlocking(v),
      handleSubmit: () => this.handleSubmit()
    };

    if (isAttendantApp) {
      if (displayAssignation && _.isEmpty(finalAssigns)) {
        switch (index) {
          case 0:
            return <SelectedAssets ref={ref => this.SelectedAssets = ref} {...taskProps} isCaptureImage={isCaptureImage} onTakeImages={this.onTakeImages} />
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
      else {
        switch (index) {
          case 0:
            return <SelectedAssets ref={ref => this.SelectedAssets = ref} {...taskProps} isCaptureImage={isCaptureImage} onTakeImages={this.onTakeImages} />
          case 1:
            return <SelectLocation ref={ref => this.SelectLocation = ref} {...taskProps} />
          case 2:
            return <TaskOptions ref={ref => this.TaskOptions = ref} {...taskProps} />
          default:
            break;
        }
      }
    }
    else {
      switch (index) {
        case 0:
          return <SelectedAssets ref={ref => this.SelectedAssets = ref} {...taskProps} isCaptureImage={isCaptureImage} onTakeImages={this.onTakeImages} />
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

  }

  renderViewPagerPage = (data, index, displayAssignation) => {
    return (
      <View key={data} style={[styles.pageContainer, { padding: index === 2 ? 0 : 20 }]}>
        {/* <Text>{data}</Text> */}
        {this.renderPagePerIndex(index, displayAssignation)}
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


  getStepIndicatorIconConfigWithoutAssignation = ({
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

  onPreviousScreen = () => {
    const { resetTask, navigation } = this.props;
    resetTask();
    navigation.goBack();
  }

  render() {
    const { currentPage, finalAssigns } = this.state;
    const { taskError, isSendingTask, isSentTask, searchAssignee, config, assigneeGroup, isAttendantApp } = this.props;

    const displayAssignation = get(config, 'showAssignation', true)

    // if (taskError) {
    //   return <ErrorState onPress={() => this.onPreviousScreen()} />;
    // } else if (isSendingTask) {
    //   return <SendingState onPress={() => this.onPreviousScreen()} />;
    // } else if (isSentTask) {
    //   return <SentState onPress={() => this.onPreviousScreen()} />;
    // }


    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.rootContainer}>
          <View style={styles.stepIndicator}>
            <StepIndicator
              stepCount={isAttendantApp ? displayAssignation && _.isEmpty(finalAssigns) ? 4 : 3 : 4}
              customStyles={stepIndicatorStyles}
              currentPosition={currentPage + 1}
              renderStepIndicator={isAttendantApp ? displayAssignation && _.isEmpty(finalAssigns) ? this.renderStepIndicator : this.getStepIndicatorIconConfigWithoutAssignation : this.renderStepIndicator}
              onPress={(position) => this.onStepPress(position)}
            />
          </View>
          <SafeAreaProvider>
            <PagerView
              style={{ flexGrow: 1 }}
              initialPage={0}
              ref={this.pagerRef}
              scrollEnabled={false}
              onPageSelected={(e) => this.stepFromPagination(e.nativeEvent.position)}>
              {PAGES.map((page, index) => this.renderViewPagerPage(page, index, displayAssignation))}
            </PagerView>
          </SafeAreaProvider>
        </View>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state, props) => {

  const roomId = get(props, "navigation.state.params.selectedRoom", null) || null;
  const department = get(props, "navigation.state.params.type", "all");

  return {
    isAttendantApp: get(props, 'screenProps.isAttendantApp', null),
    config: get(state, "auth.config"),
    room: (roomId && getRoomById(roomId)(state)) || null,
    locations: locationsSelector(state),
    assets: computedAssets(state),
    selectedLocations: getFormValues("taskLocations")(state),
    searchAssignee: getFormValues("assignmentSearch")(state),
    customActions: state.assets.hotelCustomActions,
    assignmentOptions: assignmentSelectorForModal(department)(state),
    isDisableLiteTasks: get(state, "auth.config.isDisableLiteTasks", false),
    taskError: state.updates.taskError,
    isSendingTask: state.updates.isSendingTask,
    isSentTask: state.updates.isSentTask,
    assigneeGroup: assigneeBySearch(state),
    originalAssigneeGroup: state.filters.assigneeGroup
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createTask: data => dispatch(UpdatesActions.taskCreate(data)),
    resetTask: data => dispatch(UpdatesActions.taskSendingReset()),
    setGroupAssignee: assigneeGroup => dispatch(FiltersActions.setGroupAssignee({ assigneeGroup })),
    setActiveGroupAssignee: assigneeGroup => dispatch(FiltersActions.setActiveGroupAssignee({ assigneeGroup })),
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateTask);