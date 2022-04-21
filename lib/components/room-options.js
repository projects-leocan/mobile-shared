import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
import I18n from 'react-native-i18n'

import RoomModuleButton from 'rc-mobile-base/lib/components/room-module-button';

class RoomOptions extends Component {

  _handleNotes = () => {
    this.props.onNavigate('Notes');
  }

  _handleGallery = () => {
    this.props.onNavigate('Gallery');
  }

  _handleLostFound = () => {
    this.props.onNavigate('LostFound');
  }

  _handleInventory = () => {
    this.props.onNavigate('Inventory');
  }

  _handleMaintenance = () => {
    const { roomId } = this.props;
    this.props.onNavigate('CreateTask', { layout: 'maintenance', type: 'maintenance', selectedRoom: roomId });
  }

  _handleTask = () => {
    this.props.onNavigate('CreateTask');
  }

  _handleGlitches = () => {
    this.props.onPressGlitch();
    this.props.onNavigate('Glitch');
  }

  _handleInspect = () => {
    this.props.onNavigate('Inspect');
  }

  _handleAudits = () => {
    const { roomId } = this.props;
    this.props.onNavigate('Audits', { roomId });
  }

  _handleNotification = () => {
    const { roomId } = this.props;
    this.props.onNavigate('CreateNotification', { roomId });
  }

  render() {
    const {
      isShowClean,
      isShowInspect,
      isShowNotes,
      isShowGallery,
      isShowLostFound,
      isShowInventory,
      isShowMaintenance,
      isShowTask,
      isShowGlitch,
      isShowAudit,
      style
    } = this.props;

    return (
      <View style={[styles.btnGroup, style]}>
        { isShowInspect ?
        <View style={styles.btnItem}>
          <RoomModuleButton
            baseColor='#3CC86B'
            label={ I18n.t('attendant.clean.menu.inspect') }
            onPress={this._handleInspect}
            isCustom={true}
            icon='check'
            />
        </View>
        : null }
        { isShowClean ?
        <View style={styles.btnItem}>
          <RoomModuleButton
            baseColor='#3CC86B'
            label={ I18n.t('attendant.components.room-options.clean-room') }
            onPress={this._handleClean}
            isCustom={true}
            icon='bed' />
        </View>
        : null }
        { isShowNotes ?
        <View style={styles.btnItem}>
          <RoomModuleButton
            baseColor='#87CEEB'
            label={ I18n.t('attendant.components.room-options.hsk-notes') }
            onPress={this._handleNotes}
            icon='pencil' />
        </View>
        : null }
        { isShowGallery ?
        <View style={styles.btnItem}>
          <RoomModuleButton
            baseColor='#65E5D8'
            label={ I18n.t('attendant.components.room-options.room-gallery') }
            onPress={this._handleGallery}
            icon='picture-o' />
        </View>
        : null }
        { isShowLostFound ?
        <View style={styles.btnItem}>
          <RoomModuleButton
            baseColor='#FCAC49'
            label={ I18n.t('attendant.components.room-options.lost-found') }
            onPress={this._handleLostFound}
            icon='book' />
        </View>
        : null }
        { isShowInventory ?
        <View style={styles.btnItem}>
          <RoomModuleButton
            baseColor='#FFA07A'
            label={ I18n.t('attendant.components.room-options.inventory') }
            onPress={this._handleInventory}
            icon='list-ol' />
        </View>
        : null }
        { isShowMaintenance ?
        <View style={styles.btnItem}>
          <RoomModuleButton
            baseColor='#DE5454'
            label={ I18n.t('attendant.components.room-options.maintenance') }
            onPress={this._handleMaintenance}
            icon='exclamation-circle' />
        </View>
        : null }
        { isShowTask ?
        <View style={styles.btnItem}>
          <RoomModuleButton
            baseColor='#4F9BD8'
            label={ I18n.t('attendant.components.room-options.send-task') }
            onPress={this._handleTask}
            icon='send' />
        </View>
        : null }
        { isShowGlitch ?
        <View style={styles.btnItem}>
          <RoomModuleButton
            baseColor='#FF6347'
            label={ I18n.t('runner.components.room-options.guest-glitch') }
            onPress={this._handleGlitches}
            icon='thumbs-up' />
        </View>
        : null }
        { isShowAudit ?
          <View style={styles.btnItem}>
            <RoomModuleButton
              baseColor='#FF6347'
              label={ I18n.t('inspector.navigation.links.audits') }
              onPress={this._handleAudits}
              icon='pencil-square' />
          </View>
          : null
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  btnGroup: {
    paddingLeft: 2,
    paddingRight: 2,
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  btnRow: {
    flexDirection: 'row'
  },
  btnItem: {
    padding: 2,
    width: Dimensions.get('window').width / 2 - 2,
    height: 100
  }
});

export default RoomOptions;
