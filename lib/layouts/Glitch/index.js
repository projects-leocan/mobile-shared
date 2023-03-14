import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  ListView,
  StyleSheet
} from 'react-native';

import { connect } from 'react-redux';

import { find } from 'lodash/collection';
import { get, pick } from 'lodash/object';

import { computedGlitchFormInitialValues } from '../../selectors/glitches';
import { computedActiveGlitch } from 'rc-mobile-base/lib/selectors/glitches';
import { computedHotelRooms, computedActiveRoom } from '../../selectors/rooms';

import { getRoomById } from '../../selectors/rooms';

import { computedIndexedUsers } from 'rc-mobile-base/lib/selectors/users';
import GlitchesActions from 'rc-mobile-base/lib/actions/glitches';

import GlitchForm from './glitch-form';
import GlitchReadOnly from './glitch-read-only';
import dummy from './glitch-categories.json';

class GlitchLayout extends Component {
  render() {
    let { initialValues, room, rooms, tasks, users, groups, options, userId } = this.props;
    const glitchCategories = dummy.categories.reduce((pv, item) => {
      pv[item.label] = item;
      return pv;
    }, {});

    const isReadOnly = initialValues && initialValues.uuid && (initialValues.responsible_id !== userId || initialValues.is_completed);
    let renderedView = null;

    if (isReadOnly) {
      renderedView = <GlitchReadOnly
        initialValues={initialValues}
        glitchCategories={options}
        handleStart={this._handleStart.bind(this)}
        handleChangeCategory={this._handleChangeCategory.bind(this)}
        userId={userId}
        />
    } else if (initialValues && initialValues.uuid) {
      renderedView = <GlitchForm
        rooms={rooms}
        tasks={tasks}
        userId={userId}
        users={users}
        groups={groups}
        glitchCategories={options}
        onUpdate={this._handleUpdate.bind(this)}
        onHandover={this._handleHandover.bind(this)}
        onSubmit={this._handleUpdate}
        onClose={this._handleClose}
        onAddTask={() => this.props.navigation.navigate('CreateTask', { roomId: initialValues.room_id, activeGlitch: initialValues.uuid })}
        form="existingGlitch"
        initialValues={initialValues}
        />
    } else {
      renderedView = <GlitchForm
        room={room}
        rooms={rooms}
        glitchCategories={options}
        onSubmit={this._handleSubmit}
        form="createGlitch"
        destroyOnUnmount={true}
        />
    }

    return (
      <View style={styles.container}>
        { renderedView }
      </View>
    )
  }

  _handleSubmit = (values) => {
    const { options } = this.props;
    const option = values.category && find(options, { label: values.category.split(' - ')[0]});
    if (option) {
      values.assignment = option.group;
    }

    const room = find(this.props.rooms, { "name": values.room_name });
    if (room) {
      values.room_id = room._id;
    }

    this.props.submitGlitch(values);

    this.props.navigation.goBack()
  }

  _handleUpdate = (values) => {
    const { initialValues: { uuid }} = this.props;
    const updatedValues = pick(values, 'guest_info', 'description', 'action', 'followup', 'cost');

    this.props.updateGlitch(uuid, updatedValues);
    this.props.navigation.goBack()
  }

  _handleClose = () => {
    const { initialValues, initialValues: { uuid }} = this.props;
    const updatedValues = pick(initialValues, 'guest_info', 'description', 'action', 'followup', 'cost');

    this.props.closeGlitch(uuid, updatedValues);
    this.props.navigation.goBack()
  }

  _handleHandover = (glitchId, assignment) => {
    this.props.handoverGlitch(glitchId, assignment);
    this.props.navigation.goBack()
  }

  _handleChangeCategory = (category) => {
    const { initialValues: { uuid }, options } = this.props;
    const option = find(options, { label: category.split(' - ')[0]});
    this.props.recategorizeGlitch(uuid, category, option.group);
  }

  _handleStart() {
    const { initialValues: { uuid }} = this.props;
    this.props.startGlitch(uuid)
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
});

const mapStateToProps = (state, props) => {
  const roomId = props.navigation.state.params && props.navigation.state.params.roomId
  return {
    room: roomId ? getRoomById(roomId)(state) : null,
    userId: state.auth.userId,
    rooms: computedHotelRooms(state),
    tasks: state.rooms.hotelTasks,
    users: state.users.users,
    groups: state.users.hotelGroups,
    options: state.glitches.glitchOptions,
    initialValues: computedGlitchFormInitialValues(state),
    activeGlitch: computedActiveGlitch(state),
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    submitGlitch: (newGlitch) => dispatch(GlitchesActions.glitchSubmit(newGlitch)),
    updateGlitch: (glitchId, updatedGlitch) => dispatch(GlitchesActions.glitchUpdate({ glitchId, updatedGlitch })),
    recategorizeGlitch: (glitchId, category, assignment) => dispatch(GlitchesActions.glitchRecategorize({ glitchId, category, assignment })),
    startGlitch: (glitchId) => dispatch(GlitchesActions.glitchStart(glitchId)),
    handoverGlitch: (glitchId, assignment) => dispatch(GlitchesActions.glitchHandover({ glitchId, assignment })),
    closeGlitch: (glitchId, closedGlitch) => dispatch(GlitchesActions.glitchClose({ glitchId, closedGlitch })),
    dispatch
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(GlitchLayout);
