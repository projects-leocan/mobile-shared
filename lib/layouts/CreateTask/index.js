import React, { Component, PureComponent } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
  Platform,
  Alert,
} from "react-native";
import { connect } from "react-redux";

import { get, extend, pick, pull, includes, find, uniq, map } from "lodash";
import moment from "moment";
import { getFormValues } from "redux-form";

import { computedAssets } from "rc-mobile-base/lib/selectors/assets";
import { computedInspectorUsers } from "rc-mobile-base/lib/selectors/users";
import UpdatesActions from "rc-mobile-base/lib/actions/updates";

import { ErrorState, SendingState, SentState } from "./TaskStates";
import FullTask from "./FullTask";
import MaintenanceTask from "./MaintenanceTask";

import {
  locationsSelector,
  assignmentSelector,
  enableRecentTasksSelector,
} from "./selectors";
import { getRoomById } from "../../selectors/rooms";
import { RNCamera } from 'react-native-camera';

import { green, red, white } from "rc-mobile-base/lib/styles";

const INITIAL_STATE = {
  photoId: null,
  desc: "",
  selectedAsset: null,
  selectedAction: null,
  selectedModel: null,
  selectedSublocation: null,
  createdAsset: "",
  isPriority: false,
  isMandatory: false,
  isBlocking: false,
  selectedAssignments: [],
  isSentTask: false,
  isStartRecording: null,
  isVideoRecorded: false,
  recordPath: null,
  taskImages: [],
  duplicateTaskImages: [],
  isCaptureModeImage: null,
  assetsHolder: []
};

class CreateTaskLayout extends Component {
  constructor(props) {
    super(props);

    this.state = extend({}, INITIAL_STATE);
  }

  componentWillMount() {
    this.props.resetTask();
    const type = get(this, "props.navigation.state.params.type", "all");

    if (type === "all" || type === "maintenance") {
      this.setState({
        selectedAssignments: ["maintenance team"],
      });
    } else if (type === "housekeeping") {
      this.setState({
        selectedAssignments: this.props.inspectors.map(
          inspector => inspector._id
        ),
      });
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

    if (isSendingTask && isSentTask && !nextIsSendingTask && !nextTaskError) {
      setTimeout(() => {
        this.props.navigation.goBack();
      }, 2000);
    }
  }

  _handleUpdateAssignment = selectedAssignments =>
    this.setState({ selectedAssignments });

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

  removeImage = (photoId) => {
    const { taskImages } = this.state;
    const filteredTaskImages = taskImages.filter((item) => item.photoId !== photoId);
    this.setState({ taskImages: filteredTaskImages })
  }

  confirmImageArray = () => {
    const { taskImages } = this.state;
    this._handleNextPage();

    // this.props.uploadPhoto(data.uri, photoId);
    setTimeout(() => {
      this.setState({
        isStartRecording: null,
        isVideoRecorded: false,
        recordPath: null,
        duplicateTaskImages: [...taskImages],
        taskImages: []
      })
    }, 500);
  }

  closeVideoPopUp = () => {
    this.setState({ isVideoRecorded: false })
  }

  _handleTakePicture = async (camera, callBack) => {
    const { taskImages } = this.state;
    const options = {
      fixOrientation: false,
      quality: 0.5,
      width: 960,
    };

    // this.camera.capture()
    // this.tabView.goToPage(1);
    // this._handleNextPage();

    if ((camera.status || camera.getStatus()) !== "READY") {
      console.log("Camera not valid");
      return;
    }
    await camera.takePictureAsync(options).then(async (data) => {
      const photoId = moment().format("X");
      callBack(data)
      this.setState({ photoId, taskImages: [{ photoId: photoId, photoPath: data.uri }, ...taskImages] });
    })
      .catch(err => {
        console.log(err);
      });

    // this.props.uploadPhoto(data.uri, photoId);
  };

  _handleStartTakeVideo = async camera => {
    this.setState({ isStartRecording: true })
    const options = {
      quality: RNCamera.Constants.VideoQuality['480p'],
      orientation: 'portrait',
      mirrorVideo: Platform.OS == 'ios', // allows me to get a .mp4 video on iOS (it's .mov otherwise)
      mute: false,
      // codec: Platform.OS == 'ios' ? RNCamera.Constants.VideoCodec.H264 : undefined,
    };

    // this.camera.capture()
    // this.tabView.goToPage(1);

    if ((camera.status || camera.getStatus()) !== "READY") {
      console.log("Camera not valid");
      return;
    }
    const data = await camera.recordAsync(options);
    const photoId = moment().format("X");
    this.setState({ photoId, recordPath: data.uri });
    // this.props.uploadPhoto(data.uri, photoId);
  };

  _handleStopTakeVideo = async camera => {
    this.setState({ isStartRecording: false })
    const data = await camera.stopRecording();
    this.setState({ isVideoRecorded: true })

  }

  selectVideo = () => {
    const { recordPath } = this.state;
    this.setState({ isVideoRecorded: false });
    this._handleNextPage();
    // this.props.uploadPhoto(recordPath, photoId);

    setTimeout(() => {
      this.setState({
        isStartRecording: null,
        isVideoRecorded: false,
        recordPath: null,
        taskImages: []
      })
    }, 500);
  }

  _handleNextPage = () => {
    const { state: { currentPage } } = this.tabView;
    this.tabView.goToPage(currentPage + 1);
  };

  _handlePhotoContinue = () => {
    this._handleNextPage();
    // this.tabView.goToPage(1);
  };

  toggleCamera = (value) => {
    this.setState({ isCaptureModeImage: value })
  }

  _handleContinueToAssignment = () => {
    this._handleNextPage();
    // this.tabView.goToPage(2);
  };

  _handleContinueToOptions = () => {
    this._handleNextPage();
    // this.tabView.goToPage(3);
  };

  _handleSelectAsset = asset => {
    if (get(asset, "isCreate")) {
      return this.setState({
        selectedAsset: null,
        createdAsset: get(asset, "searchQuery"),
      });
    }

    const existingId = get(this, "state.selectedAsset._id");
    const newId = get(asset, "_id");

    if (existingId && existingId === newId) {
      return this.setState({ selectedAsset: null });
    }

    this.setState({ selectedAsset: asset, createdAsset: "" });
  };

  _handleSelectAction = action => {
    const { selectedAction } = this.state;

    if (
      selectedAction &&
      get(selectedAction, "id", null) === get(action, "id", null)
    ) {
      this.setState({ selectedAction: null });
    } else {
      let opts = {
        selectedAction: action,
      };
      if (get(action, "body.default_assignment")) {
        const defaultAssignment = get(action, "body.default_assignment");
        const [name, type, value] = defaultAssignment.split(":");
        opts.selectedAssignments = [value];
      }
      this.setState(opts);
    }
  };

  _handleSelectModel = model => {
    const { selectedModel } = this.state;

    if (
      selectedModel &&
      get(selectedModel, "_id", null) === get(model, "_id", null)
    ) {
      this.setState({ selectedModel: null });
    } else {
      this.setState({ selectedModel: model });
    }
  };

  _handleSelectSublocation = sublocation => {
    const { selectedSublocation } = this.state;

    if (
      selectedSublocation &&
      get(selectedSublocation, "id", null) === get(sublocation, "id", null)
    ) {
      this.setState({ selectedSublocation: null });
    } else {
      this.setState({ selectedSublocation: sublocation });
    }
  };

  _handleUpdateDesc = t => {
    this.setState({ desc: t });
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

  getAllAsset = (assetsHolder) => {
    this.setState({ assetsHolder: assetsHolder })
  }

  _handleSubmit = () => {
    const layout = get(this, "props.navigation.state.params.layout", null);
    const { taskImages, recordPath, duplicateTaskImages, selectedAsset, selectedAction, assetsHolder, isCaptureModeImage, photoId } = this.state;
    const { selectedLocations } = this.props;

    const isAsset = this.state.selectedAsset;
    const isAction = this.state.selectedAction;
    if (isAsset === null || isAsset === "") {
      this._handleSubmitValidation("1");
    }
    // else if (isAction === null || isAction === "") {
    //   this._handleSubmitValidation("2");
    // } 
    else {
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
          createdAsset: this.state.createdAsset,
          imageArray: duplicateTaskImages
        };

        if (
          this.props.activeGlitch ||
          get(this, "props.navigation.state.params.activeGlitch")
        ) {
          data.activeGlitch =
            this.props.activeGlitch ||
            get(this, "props.navigation.state.params.activeGlitch");
        }

        this.props.createTask(data);
      } else {
        const data = {
          roomIds: uniq(map(get(selectedLocations, 'locations', []), 'id')),
          assetId: get(selectedAsset, 'id', null),
          actionId: get(selectedAction, 'id', null),
          quantity: 1,
          price: 0,
          credits: 0,
          comment: this.state.desc,
          isHighPriority: this.state.isPriority,
          isGuestRequest: false,
          imageUrl: assetsHolder,
          startsAt: null,
          userIds: [
            "bb2bbdb4-5380-429a-a90c-2ac16522dc0c"
          ],
          userGroupIds: [
            "d8f96a04-0c3b-4aa2-be3c-80cb7fdeafe3"
          ],
          userSubGroupIds: [

          ]
        }

        this.props.createTask(data);
      }


      if (this.props.isEnableRecent && layout !== "maintenance") {
        this.props.addRecent(
          pick(this.state, [
            "selectedAsset",
            "selectedAction",
            "selectedModel",
            "selectedAssignments",
            "photoId",
            "desc",
            "isPriority",
            "isMandatory",
            "isBlocking",
            "createdAsset",
          ])
        );
      }

      this.setState(extend({}, INITIAL_STATE, { isSentTask: true }));
    }
  };

  _handleSubmitValidation = isCheck => {
    if (isCheck === "1") {
      if (Platform.OS === "android") {
        ToastAndroid.showWithGravity(
          "Please select Asset",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      } else {
        Alert.alert("Please select Asset");
      }
    } else {
      if (Platform.OS === "android") {
        ToastAndroid.showWithGravity(
          "Please select Action",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      } else {
        Alert.alert("Please select Action");
      }
    }
  };

  _handleSetRecent = data => {
    this.setState(data);

    if (this.props.room) {
      this.tabView.goToPage(4);
    } else {
      this.tabView.goToPage(2);
    }
  };

  _handleSetTabView = tabView => {
    if (tabView !== null) {
      this.tabView = tabView;
    }
  };

  render() {
    const {
      assets,
      customActions,
      locations,
      isSendingTask,
      taskError,
      room = null,
      selectedLocations = [],
    } = this.props;
    const { isSentTask, isStartRecording, taskImages, recordPath, isVideoRecorded } = this.state;
    const params = this.props.navigation.state.params;
    const asset = params && params.asset;
    const layout = get(this, "props.navigation.state.params.layout", null);
    const isAllowSubmit =
      (room || selectedLocations.length) && this.state.selectedAssignments;

    if (taskError && isSentTask) {
      return <ErrorState onPress={() => this.props.navigation.goBack()} />;
    } else if (isSendingTask && isSentTask) {
      return <SendingState onPress={() => this.props.navigation.goBack()} />;
    } else if (isSentTask) {
      return <SentState onPress={() => this.props.navigation.goBack()} />;
    }

    const taskProps = {
      handleSetTabView: this._handleSetTabView,
      handleNextPage: this._handleNextPage,
      handleTakePicture: this._handleTakePicture,
      handlePhotoContinue: this._handlePhotoContinue,
      toggleCamera: this.toggleCamera,
      isStartRecording: isStartRecording,
      taskImages: taskImages,
      recordPath: recordPath,
      isVideoRecorded: isVideoRecorded,
      closeVideo: this.closeVideoPopUp,
      selectVideo: this.selectVideo,
      confirmImageArray: this.confirmImageArray,
      removeImage: this.removeImage,
      handleStartTakeVideo: this._handleStartTakeVideo,
      handleStopTakeVideo: this._handleStopTakeVideo,
      label: get(this, "props.navigation.state.params.type", "all"),
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
      getAllAsset: this.getAllAsset,
      handleSubmit: this._handleSubmit,
    };

    if (layout === "maintenance") {
      return <MaintenanceTask {...taskProps} />;
    }

    return (
      <FullTask
        {...taskProps}
        tasksRecent={this.props.tasksRecent}
        handleRecent={this._handleSetRecent}
      />
    );
  }
}

const mapStateToProps = (state, props) => {
  const department = get(props, "navigation.state.params.type", "all");
  const roomId = get(props, "navigation.state.params.roomId") || null;

  return {
    assets: computedAssets(state),
    customActions: state.assets.hotelCustomActions,
    sublocations: state.assets.hotelSublocations,
    room: (roomId && getRoomById(roomId)(state)) || null,
    locations: locationsSelector(state),
    selectedLocations: getFormValues("taskLocations")(state),
    inspectors: computedInspectorUsers(state),
    assignmentOptions: assignmentSelector(department)(state),
    isSendingTask: state.updates.isSendingTask,
    taskError: state.updates.taskError,
    isDisableLiteTasks: get(state, "auth.config.isDisableLiteTasks", false),
    isEnableRecent: enableRecentTasksSelector(state),
    tasksRecent: get(state, "updates.tasksRecent", []),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    uploadPhoto: (path, id) =>
      dispatch(UpdatesActions.photoUpload({ path, id })),
    createTask: data => dispatch(UpdatesActions.taskCreate(data)),
    createTasks: data => dispatch(UpdatesActions.taskCreateBatch(data)),
    resetTask: data => dispatch(UpdatesActions.taskSendingReset()),
    addRecent: data => dispatch(UpdatesActions.tasksAddRecent(data)),
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateTaskLayout);
