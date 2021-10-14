import React, { Component, PureComponent } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux';

import { get, extend } from 'lodash/object';
import { pull } from 'lodash/array';
import { includes, find } from 'lodash/collection';
import moment from 'moment';
import { getFormValues } from 'redux-form';

import { computedAssets } from 'rc-mobile-base/lib/selectors/assets';
import { computedInspectorUsers } from 'rc-mobile-base/lib/selectors/users';
import UpdatesActions from 'rc-mobile-base/lib/actions/updates';

import { ErrorState, SendingState, SentState } from './TaskStates';
import FullTask from './FullTask';
import MaintenanceTask from './MaintenanceTask';

import { locationsSelector, assignmentSelector } from './selectors';
import { getRoomById } from '../../selectors/rooms';

import {
  green,
  red,
  white
} from 'rc-mobile-base/lib/styles';

const INITIAL_STATE = {
  photoId: null,
  desc: '',
  selectedAsset: null,
  selectedAction: null,
  selectedModel: null,
  selectedSublocation: null,
  createdAsset: '',
  isPriority: false,
  isMandatory: false,
  isBlocking: false,
  selectedAssignments: [],
  isSentTask: false
}

class CreateTaskLayout extends Component {
  constructor(props) {
    super(props);

    this.state = extend({}, INITIAL_STATE);
  }

  componentWillMount() {
    this.props.resetTask();
    const type = get(this, 'props.navigation.state.params.type', 'all');
    
    if (type === 'all' || type === 'maintenance') {
      this.setState({
        selectedAssignments: ['maintenance team']
      })
    } else if (type === 'housekeeping') {
      this.setState({
        selectedAssignments: this.props.inspectors.map(inspector => inspector._id)
      })
    }

  }

  componentWillUnmount() {
    this.state = extend({}, INITIAL_STATE);
  }

  componentDidUpdate(prevProps, prevState) {
    const { isSendingTask } = prevProps;
    const { isSentTask } = prevState;
    const { isSendingTask: nextIsSendingTask } = this.props;
    const { isSentTask: nextIsSentTask, taskError: nextTaskError } = this.state;

    if (nextTaskError) {
      return;
    }

    if ((isSendingTask && isSentTask) && !nextIsSendingTask && !nextTaskError) {
      setTimeout(() => {
        this.props.navigation.goBack();
      }, 2000);
    }
  }

  _handleUpdateAssignment = (selectedAssignments) => this.setState({ selectedAssignments })

  // _handleTakePicture = (camera) => {
  //   camera.capture()
  //     .then((data) => {
  //       const photoId = moment().format('X');
  //       this.setState({ photoId });
  //       this.props.uploadPhoto(data.path, photoId);
  //     })
  //     .catch(err => console.error(err));
  //   this.tabView.goToPage(1);
  // }

  _handleTakePicture = async (camera) => {
    const options = {
      fixOrientation: false,
      quality: .5,
      width: 960
    };

    // this.camera.capture()
    this.tabView.goToPage(1);

    if ((camera.status || camera.getStatus()) !== 'READY') {
      console.log('Camera not valid');
      return;
    }

    const data = await camera.takePictureAsync(options);
    const photoId = moment().format('X');
    this.setState({ photoId });
    this.props.uploadPhoto(data.uri, photoId);
  }

  _handleNextPage = () => {
    const { state: { currentPage }} = this.tabView;
    this.tabView.goToPage(currentPage + 1);
  }
  
  _handlePhotoContinue = () => {
    this.tabView.goToPage(1);
  }

  _handleContinueToAssignment = () => {
    this.tabView.goToPage(2);
  }

  _handleContinueToOptions = () => {
    this.tabView.goToPage(3);
  }

  _handleSelectAsset = (asset) => {
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

  _handleSelectAction = (action) => {
    const { selectedAction } = this.state;

    if (selectedAction && get(selectedAction, 'id', null) === get(action, 'id', null)) {
      this.setState({ selectedAction: null });
    } else {
      let opts = {
        selectedAction: action
      }
      if (get(action, 'body.default_assignment')) {
        const defaultAssignment = get(action, 'body.default_assignment');
        const [name, type, value] = defaultAssignment.split(':');
        opts.selectedAssignments = [value,];
      }
      this.setState(opts);
    }
  }

  _handleSelectModel = (model) => {
    const { selectedModel } = this.state;

    if (selectedModel && get(selectedModel, '_id', null) === get(model, '_id', null)) {
      this.setState({ selectedModel: null });
    } else {
      this.setState({ selectedModel: model });
    }
  }

  _handleSelectSublocation = (sublocation) => {
    const { selectedSublocation } = this.state;

    if (selectedSublocation && get(selectedSublocation, 'id', null) === get(sublocation, 'id', null)) {
      this.setState({ selectedSublocation: null });
    } else {
      this.setState({ selectedSublocation: sublocation });
    }
  }

  _handleUpdateDesc = (t) => {
    this.setState({ desc: t })
  }

  _handleUpdatePriority = (v) => {
    this.setState({ isPriority: v });
  }

  _handleUpdateMandatory = (v) => {
    this.setState({ isMandatory: v });
  }

  _handleUpdateBlocking = (v) => {
    this.setState({ isBlocking: v });
  }

  _handleSubmit = () => {
    if (this.props.room) {
      const data = {
        asset: this.state.selectedAsset,
        action: this.state.selectedAction,
        model: this.state.selectedModel,
        assignments: this.state.selectedAssignments,
        room: this.props.room,
        photoId: this.state.photoId,
        desc: this.state.desc,
        isPriority: this.state.isPriority,
        isMandatory: this.state.isMandatory,
        isBlocking: this.state.isBlocking,
        createdAsset: this.state.createdAsset
      };

      if (this.props.activeGlitch || get(this, 'props.navigation.state.params.activeGlitch')) {
        data.activeGlitch = this.props.activeGlitch || get(this, 'props.navigation.state.params.activeGlitch');
      }

      this.props.createTask(data);
    } else {
      const data = {
        asset: this.state.selectedAsset,
        action: this.state.selectedAction,
        model: this.state.selectedModel,
        assignments: this.state.selectedAssignments,
        photoId: this.state.photoId,
        desc: this.state.desc,
        isPriority: this.state.isPriority,
        isMandatory: this.state.isMandatory,
        isBlocking: this.state.isBlocking,
        createdAsset: this.state.createdAsset,
        locations: get(this, 'props.selectedLocations.locations', []),
      }

      this.props.createTasks(data);
    }
    
    this.setState(extend({}, INITIAL_STATE, { isSentTask: true }));
  }

  _handleSetTabView = (tabView) => {
    if (tabView !== null) {
      this.tabView = tabView;
    }
  }

  render() {
    const { assets, customActions, locations, isSendingTask, taskError, room = null, selectedLocations = [] } = this.props;
    const { isSentTask } = this.state;
    const params = this.props.navigation.state.params;
    const asset = params && params.asset;
    const layout = get(this, 'props.navigation.state.params.layout', null);
    const isAllowSubmit = (room || selectedLocations.length)
      && this.state.selectedAssignments;

    if (taskError && isSentTask) {
      return <ErrorState onPress={() => this.props.navigation.goBack()} />
    } else if (isSendingTask && isSentTask) {
      return <SendingState onPress={() => this.props.navigation.goBack()} />
    } else if (isSentTask) {
      return <SentState onPress={() => this.props.navigation.goBack()} />
    }

    const taskProps = {
      handleSetTabView: this._handleSetTabView,
      handleNextPage: this._handleNextPage,
      handleTakePicture: this._handleTakePicture,
      handlePhotoContinue: this._handlePhotoContinue,
      label: get(this, 'props.navigation.state.params.type', 'all'),
      room: this.props.room,
      locations: locations,
      selectedLocations: this.props.selectedLocations,
      assets: assets,
      selectedAsset: asset || this.state.selectedAsset,
      createdAsset: this.state.createdAsset,
      handleSelectAsset: this._handleSelectAsset,
      isDisableLiteTasks: this.props.isDisableLiteTasks,
      customActions: customActions,
      selectedAction: this.state.selectedAction,
      handleSelectAction: this._handleSelectAction,
      sublocations: this.props.sublocations,
      selectedSublocation: this.state.selectedSublocation,
      handleSelectSublocation: this._handleSelectSublocation,
      selectedModel: this.state.selectedModel,
      handleSelectModel: this._handleSelectModel,
      desc: this.state.desc,
      handleUpdateDesc: this._handleUpdateDesc,
      assignmentOptions: this.props.assignmentOptions,
      selectedAction: this.state.selectedAction,
      selectedAssignments: this.state.selectedAssignments,
      handleUpdateAssignment: this._handleUpdateAssignment,
      isPriority: this.state.isPriority,
      handleUpdatePriority: this._handleUpdatePriority,
      isMandatory: this.state.isMandatory,
      handleUpdateMandatory: this._handleUpdateMandatory,
      isBlocking: this.state.isBlocking,
      handleUpdateBlocking: this._handleUpdateBlocking,
      isAllowSubmit,
      handleSubmit: this._handleSubmit,
    }

    if (layout === "maintenance") {
      return <MaintenanceTask {...taskProps} />
    }

    return <FullTask {...taskProps} />
  }
}

const mapStateToProps = (state, props) => {
  const department = get(props, 'navigation.state.params.type', 'all');
  const roomId = get(props, 'navigation.state.params.roomId') || null;
  
  return {
    assets: computedAssets(state),
    customActions: state.assets.hotelCustomActions,
    sublocations: state.assets.hotelSublocations,
    room: roomId && getRoomById(roomId)(state) || null,
    locations: locationsSelector(state),
    selectedLocations: getFormValues('taskLocations')(state),
    inspectors: computedInspectorUsers(state),
    assignmentOptions: assignmentSelector(department)(state),
    isSendingTask: state.updates.isSendingTask,
    taskError: state.updates.taskError,
    isDisableLiteTasks: get(state, 'auth.config.isDisableLiteTasks', false)
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    uploadPhoto: (path, id) => dispatch(UpdatesActions.photoUpload({ path, id})),
    createTask: (data) => dispatch(UpdatesActions.taskCreate(data)),
    createTasks: (data) => dispatch(UpdatesActions.taskCreateBatch(data)),
    resetTask: (data) => dispatch(UpdatesActions.taskSendingReset()),
    dispatch
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateTaskLayout);
