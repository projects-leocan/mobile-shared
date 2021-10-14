import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
import I18n from 'react-native-i18n'

import RoomModuleButton from './RoomModuleButton';

class RoomOptions extends Component {

  _handleNotes() {
    this.props.onNavigate('Notes');
  }

  _handleGallery() {
    this.props.onNavigate('Gallery');
  }

  _handleLostFound() {
    this.props.onNavigate('LostFound');
  }

  _handleInventory() {
    this.props.onNavigate('Inventory');
  }

  _handleMaintenance() {
    // this.props.onNavigate('Maintenance');
    this.props.onNavigate('CreateTask', { layout: 'maintenance', type: 'maintenance' });
  }

  _handleTask() {
    this.props.onNavigate('Task');
  }

  _handleGlitches() {
    this.props.onPressGlitch();
    this.props.onNavigate('Glitch');
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
      isShowNotes,
      isShowGallery,
      isShowLostFound,
      isShowInventory,
      isShowMaintenance,
      isShowTask,
      isShowGlitch,
      style
    } = this.props;

    return (
      <View style={[styles.btnGroup, style]}>
        { isShowClean ?
        <View style={styles.btnItem}>
          <RoomModuleButton
            baseColor='#3CC86B'
            label={ I18n.t('attendant.components.room-options.clean-room') }
            onPress={this._handleClean.bind(this)}
            isCustom={true}
            icon='bed' />
        </View>
        : null }
        { isShowNotes ?
        <View style={styles.btnItem}>
          <RoomModuleButton
            baseColor='#87CEEB'
            label={ I18n.t('attendant.components.room-options.hsk-notes') }
            onPress={this._handleNotes.bind(this)}
            icon='pencil' />
        </View>
        : null }
        { isShowGallery ?
        <View style={styles.btnItem}>
          <RoomModuleButton
            baseColor='#65E5D8'
            label={ I18n.t('attendant.components.room-options.room-gallery') }
            onPress={this._handleGallery.bind(this)}
            icon='picture-o' />
        </View>
        : null }
        { isShowLostFound ?
        <View style={styles.btnItem}>
          <RoomModuleButton
            baseColor='#FCAC49'
            label={ I18n.t('attendant.components.room-options.lost-found') }
            onPress={this._handleLostFound.bind(this)}
            icon='book' />
        </View>
        : null }
        { isShowInventory ?
        <View style={styles.btnItem}>
          <RoomModuleButton
            baseColor='#FFA07A'
            label={ I18n.t('attendant.components.room-options.inventory') }
            onPress={this._handleInventory.bind(this)}
            icon='list-ol' />
        </View>
        : null }
        { isShowMaintenance ?
        <View style={styles.btnItem}>
          <RoomModuleButton
            baseColor='#DE5454'
            label={ I18n.t('attendant.components.room-options.maintenance') }
            onPress={this._handleMaintenance.bind(this)}
            icon='exclamation-circle' />
        </View>
        : null }
        { isShowTask ?
        <View style={styles.btnItem}>
          <RoomModuleButton
            baseColor='#4F9BD8'
            label={ I18n.t('attendant.components.room-options.send-task') }
            onPress={this._handleTask.bind(this)}
            icon='send' />
        </View>
        : null }
        { isShowGlitch ?
        <View style={styles.btnItem}>
          <RoomModuleButton
            baseColor='#FF6347'
            label={ I18n.t('attendant.components.room-options.guest-glitch') }
            onPress={this._handleGlitches.bind(this)}
            icon='bell-o' />
        </View>
        : null }

        {/* <View style={styles.btnItem}>
          <RoomModuleButton
            baseColor='#FF6347'
            label={ I18n.t('inspector.navigation.links.audits') }
            onPress={this._handleAudits}
            icon='bell-o' />
        </View> */}

        {/* <View style={styles.btnItem}>
          <RoomModuleButton
            baseColor='#FF6347'
            label={ I18n.t('base.ubiquitous.notifications') }
            onPress={this._handleNotification}
            icon='bell-o' />
        </View> */}
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