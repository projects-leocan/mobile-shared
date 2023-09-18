import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  InteractionManager,
  SectionList,
  SafeAreaView,
  Platform,
} from 'react-native';
import I18n from 'react-native-i18n'
import ListView from 'rc-mobile-base/lib/components/ListView';
import Modal from 'react-native-modalbox';
import { get } from 'lodash/object';
import { find } from 'lodash/collection';
import { map, groupBy, keys, orderBy } from 'lodash';

import Subheader from './Subheader';
import RoomRow from './RoomRow';
import FloorLabel from './FloorLabel';
import ModalContent from './ModalContent';
import { SafeAreaView as AndroidSafeAreaView } from 'react-native-safe-area-context';
import {
  flx1,
  flexGrow1,
  lCenterCenter,
  margin,
  green,
  white,
  slate,
  red,
  orange,
  flxRow
} from 'rc-mobile-base/lib/styles';

class Turndown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowPriority: false,
      activeRoomId: null,
      isFilterOpen: false,
      isFilterActive: false,
      activeRoomCategory: { label: 'All Categories', id: 'all' },
      activeCategories: [],
    }
  }

  componentWillMount() {
    const { roomCategories } = this.props;

    const activeCategories = roomCategories.map(category => ({ label: category.label, value: category.id, isEnabled: true }));
    this.setState({ activeCategories });
  }

  _handleActiveRoom = (roomId) => this.setState({ activeRoomId: roomId })
  _handleDismissRoom = () => this.setState({ activeRoomId: null })

  _handleToggleFilter = () => this.setState({ isFilterOpen: !this.state.isFilterOpen })
  _handleUpdateRoomCategory = (category) => this.setState({ activeRoomCategory: category })
  _handleToggleCategory = (value) => {
    const { activeCategories } = this.state;

    const updatedCategories = activeCategories.map(category => {
      let updated = category.asMutable ? category.asMutable() : category;
      if (value === updated.value) {
        updated.isEnabled = !updated.isEnabled;
      }
      return updated;
    });

    this.setState({ activeCategories: updatedCategories });
  }

  _handleTurndown = (value) => {
    const roomId = this.state.activeRoomId;
    const activeRoom = this._getRoom();
    const cleaningId = get(activeRoom, 'roomPlanning.id', null);
    if (!roomId) {
      return;
    }
    // this._handleDismissRoom();
    InteractionManager.runAfterInteractions(() => {
      const updateTurnDownStatus = { roomId, cleaningId, status: value }
      this.props.turndown(updateTurnDownStatus);
      // if (value === "cleaning") {
      //   this.props.cleanStart(roomId);
      // }
      // this.props.turndown(roomId, value);
    })
  }

  _handleNavigation = (layout, options = {}) => {
    const { activeRoomId: roomId } = this.state;

    if (!roomId) {
      return;
    }
    this.props.navigation.navigate(layout, { roomId, ...options });
  }

  _getRoom = () => find(this.props.rooms, { id: this.state.activeRoomId })

  render() {
    const { rooms, displayUser, config } = this.props;
    // const {  roomUpdate } = this.props;
    // let specificRoomUpdate = roomUpdate && get(roomUpdate.rooms, this.state.activeRoomId , null)

    const { activeRoomCategory } = this.state;
    const activeRoom = this._getRoom();
    const availableCategory = this.state.activeCategories
      .filter(category => category.isEnabled)
      // .map(category => category.value)
      .map(category => category.label)
    // let filterRooms = rooms.filter(room => availableCategory.includes(room.roomCategory._id))
    let filterRooms = rooms.filter(room => availableCategory.includes(room.roomCategoryName))
    let priorityRooms = filterRooms
      .filter(room => get(room, 'roomPlanning.is_priority', false));

    const priorityWiseFilter = orderBy(filterRooms, 'roomPlanning.is_priority', 'desc')

    const groupByFloor = groupBy(priorityWiseFilter, option => {
      const isPriority = get(option, 'roomPlanning.is_priority')
      const buildingName = get(option, 'buildingName')
      const floorName = get(option, 'floorName')
      const validateSectionName = isPriority ? I18n.t("attendant.main.index.priority-rooms").toUpperCase() : buildingName ? `${buildingName} \u2022 ${floorName}` : floorName;
      return validateSectionName
    });
    const listFilterRooms = keys(groupByFloor).map(k => ({ data: get(groupByFloor, k), title: k, key: k }));

    if (Platform.OS === "android") {
      return (
        <AndroidSafeAreaView style={{ flex: 1, backgroundColor: "white"}} >
          <View style={styles.container}>
            <Subheader
              rooms={filterRooms}
              priorityRooms={priorityRooms}
              isFilterOpen={this.state.isFilterOpen}
              toggleFilter={this._handleToggleFilter}
              isFilterActive={this.state.activeCategories.length !== availableCategory.length}
              roomCategories={this.props.roomCategories}
              activeCategories={this.state.activeCategories}
              activeRoomCategory={this.state.activeRoomCategory}
              updateCategory={this._handleToggleCategory}
            />
            <View style={[flexGrow1, { flex: 1 }]}>
              <SectionList
                sections={listFilterRooms}
                renderItem={({ item, index }) => <RoomRow room={item} activateRoom={this._handleActiveRoom} displayUser={displayUser} />}
                ListHeaderComponent={() => <View style={[margin.t15]}></View>}
                renderSectionHeader={({ section }) => <FloorLabel>{section.title}</FloorLabel>}
                keyExtractor={(item, index) => `key-${index}`}
              />
            </View>
            <Modal
              style={[styles.modal, styles.modal4]}
              position={"bottom"}
              swipeToClose={false}
              isOpen={!!this.state.activeRoomId}
              onClosed={this._handleDismissRoom}
              coverScreen={true}
            >
              <ModalContent
                activeRoom={activeRoom}
                dismiss={this._handleDismissRoom}
                submit={this._handleTurndown}
                config={config}
                onNavigate={this._handleNavigation}
              // specificRoomUpdate={specificRoomUpdate}
              />
            </Modal>

          </View>
        </AndroidSafeAreaView>
      )
    } else {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white"}} >
          <View style={styles.container}>
            <Subheader
              rooms={filterRooms}
              priorityRooms={priorityRooms}
              isFilterOpen={this.state.isFilterOpen}
              toggleFilter={this._handleToggleFilter}
              isFilterActive={this.state.activeCategories.length !== availableCategory.length}
              roomCategories={this.props.roomCategories}
              activeCategories={this.state.activeCategories}
              activeRoomCategory={this.state.activeRoomCategory}
              updateCategory={this._handleToggleCategory}
            />
            <View style={[flexGrow1, { flex: 1 }]}>
              <SectionList
                sections={listFilterRooms}
                renderItem={({ item, index }) => <RoomRow room={item} activateRoom={this._handleActiveRoom} displayUser={displayUser} />}
                ListHeaderComponent={() => <View style={[margin.t15]}></View>}
                renderSectionHeader={({ section }) => <FloorLabel>{section.title}</FloorLabel>}
                keyExtractor={(item, index) => `key-${index}`}
              />
            </View>
            <Modal
              style={[styles.modal, styles.modal4]}
              position={"bottom"}
              swipeToClose={false}
              isOpen={!!this.state.activeRoomId}
              onClosed={this._handleDismissRoom}
              coverScreen={true}
            >
              <ModalContent
                activeRoom={activeRoom}
                dismiss={this._handleDismissRoom}
                submit={this._handleTurndown}
                config={config}
                onNavigate={this._handleNavigation}
              // specificRoomUpdate={specificRoomUpdate}
              />
            </Modal>

          </View>
        </SafeAreaView>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
    backgroundColor: '#F7F7F7'
  },
  modal: {
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  modal4: {
    height: "100%",
  },
});

Turndown.RoomRow = RoomRow

export default Turndown;
