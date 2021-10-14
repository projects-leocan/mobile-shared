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
import { RNCamera } from 'react-native-camera';

import { get, extend } from 'lodash/object';
import { pull } from 'lodash/array';
import { includes, find } from 'lodash/collection';
import moment from 'moment';

import FullscreenPhoto from './FullscreenPhoto';
import AssetActionDescription from 'rc-mobile-base/lib/components/AssetActionDescription';


import { connect } from 'react-redux';

import { getRoomById } from 'rc-mobile-base/lib/selectors/rooms';

import { computedAssets } from 'rc-mobile-base/lib/selectors/assets';

import UpdatesActions from 'rc-mobile-base/lib/actions/updates';

const INITIAL_STATE = {
  photoId: null,
  desc: '',
  selectedAsset: null,
  selectedAction: null,
  createdAsset: '',
  isPriority: false,
  selectedAssignments: new Set(['maintenance team'])
}

const CAMERA_OPTIONS = {
  // target: RNCamera.Constants.CaptureTarget.temp
}

class MaintenanceLayout extends Component {
  constructor(props) {
    super(props);

    this.state = extend({}, INITIAL_STATE);
  }

  _handleTakePicture(camera) {
    camera.capture(CAMERA_OPTIONS)
      .then((data) => {
        const photoId = moment().format('X');
        this.setState({ photoId });
        this.props.uploadPhoto(data.path, photoId);
      })
      .catch(err => console.error(err));
    this.tabView.goToPage(1);
  }

  _handlePhotoContinue() {
    this.tabView.goToPage(1);
  }

  _handleSelectAsset(asset) {
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

  _handleSelectAction(action) {
    const { selectedAction } = this.state;

    if (selectedAction && get(selectedAction, 'id', null) === get(action, 'id', null)) {
      this.setState({ selectedAction: null });
    } else {
      this.setState({ selectedAction: action });
    }
  }

  _handleUpdateDesc(t) {
    this.setState({ desc: t })
  }

  _handleUpdatePriority(v) {
    this.setState({ isPriority: v });
  }

  _handleSubmit() {
    const data = {
      asset: this.state.selectedAsset,
      action: this.state.selectedAction,
      room: this.props.room,
      photoId: this.state.photoId,
      desc: this.state.desc,
      isPriority: this.state.isPriority,
      createdAsset: this.state.createdAsset,
      assignments: this.state.selectedAssignments
    }

    this.props.createTask(data);
    this.setState(extend({}, INITIAL_STATE));
    this.props.navigation.goBack();
  }

  render() {
    const { assets, customActions } = this.props;

    return (
      <ScrollableTabView
        style={styles.container}
        renderTabBar={() => <CustomTabbar />}
        ref={(tabView) => {
          if (tabView != null) {
            this.tabView = tabView;
          }
        }}
        >
        <View tabLabel="camera" style={styles.tabView}>
          <View style={styles.tabView}>
            <FullscreenPhoto
              takePhoto={this._handleTakePicture.bind(this)}
              noPhoto={this._handlePhotoContinue.bind(this)}
              />
          </View>
        </View>
        <View tabLabel="lightbulb-o" style={styles.tabView}>
          <View style={styles.tabView}>
            <AssetActionDescription
              assets={assets}
              room={this.props.room}
              customActions={customActions}
              selectedAsset={this.state.selectedAsset}
              createdAsset={this.state.createdAsset}
              selectedAction={this.state.selectedAction}
              desc={this.state.desc}
              isShowPriority={true}
              isPriority={this.state.isPriority}
              handleSelectAsset={this._handleSelectAsset.bind(this)}
              handleSelectAction={this._handleSelectAction.bind(this)}
              handleUpdateDesc={this._handleUpdateDesc.bind(this)}
              handleUpdatePriority={this._handleUpdatePriority.bind(this)}
              handleSubmit={this._handleSubmit.bind(this)}
              />
          </View>
        </View>
      </ScrollableTabView>
    )
  }
}

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

});

const mapStateToProps = (state, props) => {
  const roomId = props.navigation.state.params.roomId
  return {
    room: getRoomById(roomId)(state),
    assets: computedAssets(state),
    customActions: state.assets.hotelCustomActions,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    uploadPhoto: (path, id) => dispatch(UpdatesActions.photoUpload({ path, id})),
    createTask: (data) => dispatch(UpdatesActions.taskCreate(data)),
    dispatch
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(MaintenanceLayout);
