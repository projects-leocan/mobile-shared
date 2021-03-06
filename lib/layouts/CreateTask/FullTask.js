import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';

import CustomTabbar from './CustomTabbar';
import FullscreenPhoto from './FullscreenPhoto';
import AssetActionDescription from './AssetActionDescription';
import AssignmentSelect from './AssignmentSelect';
import TaskOptions from './TaskOptions';
import RecentTasks from './RecentTasks';
import SelectedAssets from "./SelectedAssets";

const FullTask = ({
  handleSetTabView,
  handleNextPage,

  handleTakePicture,
  handlePhotoContinue,
  taskImages,
  removeImage,
  recordPath,
  isStartRecording,
  isVideoRecorded,
  closeVideo,
  selectVideo,
  confirmImageArray,
  handleStartTakeVideo,
  handleStopTakeVideo,

  toggleCamera,
  getAllAsset,

  label,

  room,
  locations,
  selectedLocations,

  assets,
  selectedAsset,
  createdAsset,
  handleSelectAsset,
  isDisableLiteTasks,
  
  customActions,
  selectedAction,
  handleSelectAction,
  
  sublocations,
  selectedSublocation,
  handleSelectSublocation,
  
  selectedModel,
  handleSelectModel,

  desc,
  handleUpdateDesc,

  assignmentOptions,
  selectedAssignments,
  handleUpdateAssignment,
  
  isPriority,
  handleUpdatePriority,
  
  isMandatory,
  handleUpdateMandatory,

  isBlocking,
  handleUpdateBlocking,
  
  tasksRecent,
  handleRecent,

  handleSubmit
}) => (
  <ScrollableTabView
    style={styles.container}
    renderTabBar={() => <CustomTabbar />}
    ref={handleSetTabView}
    locked
    >
    { tasksRecent && tasksRecent.length ?
      <View tabLabel="pencil-square-o" style={styles.tabView}>
        <RecentTasks
          onSkip={handleNextPage}
          onSelectRecent={handleRecent}
          tasksRecent={tasksRecent}
          />
      </View>
      : null  
    }
    <View tabLabel="camera" style={styles.tabView}>
      <View style={styles.tabView}>
        {/* <FullscreenPhoto
          takePhoto={handleTakePicture}
          noPhoto={handleNextPage}
          taskImages={taskImages}
        /> */}
         {/* <FullscreenPhoto
          takePhoto={handleTakePicture}
          noPhoto={handleNextPage}
          isStartRecording={isStartRecording}
          isVideoRecorded={isVideoRecorded}
          taskImages={taskImages}
          recordPath={recordPath}
          removeImage={removeImage}
          closeVideo={closeVideo}
          selectVideo={selectVideo}
          confirmImageArray={confirmImageArray}
          handleStartTakeVideo={handleStartTakeVideo}
          handleStopTakeVideo={handleStopTakeVideo}
          toggleCamera={toggleCamera}
        /> */}
          <SelectedAssets toggleCamera={toggleCamera} getAllAsset={getAllAsset} noPhoto={handleNextPage} />
      </View>
    </View>
    <View tabLabel="lightbulb-o" style={styles.tabView}>
      <View style={styles.tabView}>
        <AssetActionDescription
          room={room}
          locations={locations}
          selectedLocations={selectedLocations}
          assets={assets}
          customActions={customActions}
          sublocations={sublocations}
          selectedAsset={selectedAsset}
          createdAsset={createdAsset}
          isDisableLiteTasks={isDisableLiteTasks}
          selectedAction={selectedAction}
          selectedModel={selectedModel}
          selectedSublocation={selectedSublocation}
          desc={desc}
          isShowPriority={false}
          isPriority={isPriority}
          handleSelectAsset={handleSelectAsset}
          handleSelectAction={handleSelectAction}
          handleSelectModel={handleSelectModel}
          handleSelectSublocation={handleSelectSublocation}
          handleUpdateDesc={handleUpdateDesc}
          handleUpdatePriority={handleUpdatePriority}
          handleContinue={handleNextPage}
          label={label}
        />
      </View>
    </View>
    <View tabLabel="user" style={styles.tabView}>
      <View style={styles.tabView}>
        <AssignmentSelect
          assignmentOptions={assignmentOptions}
          selectedAction={selectedAction}
          selectedAssignments={selectedAssignments}
          updateAssignments={handleUpdateAssignment}
          submit={handleNextPage}
          /> 
      </View>
    </View>
    <View tabLabel="paper-plane" style={styles.tabView}>
      <View style={styles.tabView}>
        <TaskOptions
          isShowPriority={true}
          isPriority={isPriority}
          isMandatory={isMandatory}
          isBlocking={isBlocking}
          handleUpdatePriority={handleUpdatePriority}
          handleUpdateMandatory={handleUpdateMandatory}
          handleUpdateBlocking={handleUpdateBlocking}
          handleSubmit={handleSubmit}
          />
      </View>
    </View>
  </ScrollableTabView>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
    backgroundColor: '#F7F7F7'
  },
  tabView: {
    flex: 1,
  },
  spinner: {
    marginBottom: 50
  },
  message: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center'
  }
});

export default FullTask;