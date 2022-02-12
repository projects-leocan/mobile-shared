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

import { get, uniq, map, filter, groupBy, at, keyBy, omit, flatten, values, compact, isEmpty } from 'lodash';

import { connect } from "react-redux";
import { getFormValues } from "redux-form";
import {
  locationsSelector,
  assignmentSelector,
} from "./selectors";
import { computedAssets } from "rc-mobile-base/lib/selectors/assets";
import { getRoomById } from "../../selectors/rooms";
import UpdatesActions from "rc-mobile-base/lib/actions/updates";
import { ErrorState, SendingState, SentState } from "./TaskStates";

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

  onStepPress = (position) => {
    this.pagerRef.current.setPage(position)
  }

  stepFromPagination = (position) => {
    this.setState({ currentPage: position });
    // this.pagerRef.current.setPage(position)
  }

  onNextPage = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage + 1 });

    this.onStepPress(currentPage + 1)
  }



  handleSubmit = () => {
    const { selectedLocations, assignmentOptions } = this.props;
    const { isPriority } = this.state;

    const assetsHolder = get(this, 'SelectedAssets.state.assetsHolder', []);

    const selectedAssets = get(this, 'SelectLocation.state.updatedAssets', []);
    const validateAssets = map(filter(selectedAssets, ['isSelected', true]), 'id');
    const actionId = get(this, 'SelectLocation.state.selectedAction', []);
    const description = get(this, 'SelectLocation.state.desc', '');

    const selectedAssignments = get(this, 'AssignmentSelect.state.selectedAssign', []);
    const mapSelectedAssignments = map(selectedAssignments, 'value');

    const selectedAssignmentsHolder = groupBy(at(keyBy(assignmentOptions, 'value'), mapSelectedAssignments), "type");

    const omitGroup = omit(selectedAssignmentsHolder, ['group'])
    const assignmentsGroups = groupBy(get(selectedAssignmentsHolder, 'group', []), 'typeKey');
    const userIds = compact(map(uniq(flatten(values(omitGroup))), 'value'))
    const userGroupIds = compact(map(get(assignmentsGroups, 'USER_GROUP'), 'value'));
    const userSubGroupIds = compact(map(get(assignmentsGroups, 'USER_SUB_GROUP'), 'value'));

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
    } else if (isEmpty(userIds) && isEmpty(userGroupIds)) {
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
      userGroupIds: userGroupIds,
      userSubGroupIds: userSubGroupIds
    }


    this.props.createTask(data);
    this.setState({ isSentTask: true })
  }

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
    const { room, locations, assets, isDisableLiteTasks, customActions, assignmentOptions } = this.props;
    const { isPriority, isMandatory, isBlocking } = this.state;
    const taskProps = {
      room: room,
      locations: locations,
      assets: assets,
      customActions: customActions,
      isDisableLiteTasks: isDisableLiteTasks,
      assignmentOptions: assignmentOptions,
      onNext: () => this.onNextPage(),

      isShowPriority: true,
      isPriority: isPriority,
      isMandatory: isMandatory,
      isBlocking: isBlocking,
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
    return <Image source={iconConfig} style={[styles.stepIndicatorIcon, { tintColor: stepStatus === 'finished' ? '#ffffff' : '#000'}]} />
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
            onPageSelected={(e) => this.stepFromPagination(e.nativeEvent.position)}>
            {PAGES.map((page, index) => this.renderViewPagerPage(page, index))}
          </PagerView>
        </View>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state, props) => {
  const roomId = get(props, "navigation.state.params.roomId") || null;
  const department = get(props, "navigation.state.params.type", "all");

  return {
    room: (roomId && getRoomById(roomId)(state)) || null,
    locations: locationsSelector(state),
    assets: computedAssets(state),
    selectedLocations: getFormValues("taskLocations")(state),
    customActions: state.assets.hotelCustomActions,
    assignmentOptions: assignmentSelector(department)(state),
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