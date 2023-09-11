import React, { Component } from 'react';
import ReactNative, {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput
} from 'react-native';
import I18n from 'react-native-i18n';
import { reduxForm, Field } from 'redux-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Button from 'rc-mobile-base/lib/components/Button';
import { get } from 'lodash/object';
import { find } from 'lodash/collection';

import Section from './section';
import TextField from './text-field';
import GlitchCategorySelector from './glitch-category-selector';
import AutoExpandingTextField from './auto-expanding-text-field';
import * as Colors from 'rc-mobile-base/lib/styles';

import LocationSelectModal from 'rc-mobile-base/lib/components/Experience/location-select-modal';
import GroupSelectModal from 'rc-mobile-base/lib/components/Experience/group-select-modal';
import GlitchTask from './GlitchTask';


class GlitchForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAllowLocations: true,
      isLocationsActive: false,
      selectedLocations: new Set(),
      isUsersActive: false,
      selectedUsers: new Set(),
      isGroupsActive: false
    }
  }

  componentWillMount() {
    const { room, change } = this.props;

    if (!room) {
      return;
    }

    change('room_name', get(room, 'name', ""));
    change('guest_info.name', get(room, ['roomCalendar', 0, 'guest_name'], ""))
    change('guest_info.vip', get(room, ['roomCalendar', 0, 'vip'], ""))
    change('guest_info.email', get(room, ['roomCalendar', 0, 'email'], ""))

    this.setState({
      isAllowLocations: false
    });
  }

  _handleToggleLocations() {
    this.setState({
      isLocationsActive: !this.state.isLocationsActive
    });
  }

  _handleToggleGroup() {
    this.setState({
      isGroupsActive: !this.state.isGroupsActive
    });
  }

  _handleChangeLocation({ room, entry }) {
    const { change } = this.props;

    if (room) {
      change('room_name', get(room, 'name', ""));
    }

    if (entry) {
      change('guest_info.name', get(entry, ['name'], ""));
      change('guest_info.vip', get(entry, ['vip'], ""));
      change('guest_info.email', get(entry, ['email'], ""));
    }

    this._handleToggleLocations();
  }

  _handleHandoverGroup(groupId) {
    const { onHandover, initialValues } = this.props;
    this._handleToggleGroup();

    onHandover(initialValues.uuid, groupId);
  }

  render() {
    const {
      handleSubmit,
      onAddTask,
      onUpdate,
      onHandover,
      onClose,
      rooms,
      tasks,
      userId,
      users,
      groups,
      glitchCategories,
      form,
      initialValues,
      ...props
    } = this.props;

    const { isAllowLocations, selectedLocations, isLocationsActive, selectedUsers, isGroupsActive } = this.state;
    const isEditing = form === 'existingGlitch';

    const glitchTasks = get(initialValues, 'tasks', []).map(glitchTask => {
      const task = find(tasks, { uuid: glitchTask.task_id });
      // return task && <Text key={task.uuid} style={styles.glitchTaskText}>{ task.task }</Text>;
      return task && <GlitchTask {...task} />
    }).filter(Boolean);

    return (
      <View style={styles.container}>
        <ScrollView>
          { !isEditing && isAllowLocations ?
            <TouchableOpacity style={styles.subheader} onPress={() => this._handleToggleLocations()}>
              <Text style={styles.subheaderText}>{ I18n.t('runner.glitch-form.index.choose-location').toUpperCase() }</Text>
            </TouchableOpacity>
            : null
          }
          <Section title={I18n.t('runner.glitch-form.index.guest-information')} style={{ marginTop: 20 }}>
            <View style={styles.row}>
              <Text style={styles.label}>{ I18n.t('runner.glitch-form.index.room') }</Text>
              <Field
                name="room_name"
                placeholder={I18n.t('runner.glitch-form.index.enter-room-name')}
                placeholderTextColor={Colors.greyDk.color}
                component={TextField}
                maxLength={10}
                style={styles.rowInput}
              />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{I18n.t('base.glitch-form.index.name')}</Text>
              <Field
                name="guest_info.name"
                placeholder={I18n.t('runner.glitch-form.index.enter-guest-name')}
                placeholderTextColor={Colors.greyDk.color}
                component={TextField}
                style={styles.rowInput}
              />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{I18n.t('base.glitch-form.index.vip')}</Text>
              <Field
                name="guest_info.vip"
                placeholder={I18n.t('runner.glitch-form.index.vip-status-optional')}
                placeholderTextColor={Colors.greyDk.color}
                component={TextField}
                style={styles.rowInput}
              />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{I18n.t('base.glitch-form.index.email')}</Text>
              <Field
                name="guest_info.email"
                placeholder={I18n.t('runner.glitch-form.index.enter-guest-email')}
                placeholderTextColor={Colors.greyDk.color}
                component={TextField}
                style={styles.rowInput}
              />
            </View>
          </Section>
          {/* <Section title={I18n.t('runner.glitch-form.index.select-glitch-category')}>
          { isEditing ?
            <Text>{ initialValues.experienceCategoryName }</Text>
            :
            <Field
              name="category"
              placeholder={I18n.t('runner.glitch-form.index.select-a-glitch-category')}
              placeholderTextColor={Colors.greyDk.color}
              glitchCategories={glitchCategories}
              component={GlitchCategorySelector}
            />
          }
          </Section> */}
          <Section title={I18n.t('runner.glitch-form.index.glitch-information')}>
            <Text style={styles.inputHeader}>{I18n.t('runner.glitch-form.index.incident-description')}</Text>
            <View style={styles.textAreaContainer}>
              <Field
                name="description"
                placeholder={I18n.t('runner.glitch-form.index.add-experience-description')}
                placeholderTextColor={Colors.greyDk.color}
                component={AutoExpandingTextField}
                minHeight={50}
                style={styles.textArea}
              />
            </View>

            <Text style={styles.inputHeader}>{I18n.t('runner.glitch-form.index.actions-to-resolve')}</Text>
            <View style={styles.textAreaContainer}>
              <Field
                name="action"
                placeholder={I18n.t('runner.glitch-form.index.add-actions-to-resolve')}
                placeholderTextColor={Colors.greyDk.color}
                component={AutoExpandingTextField}
                minHeight={50}
                style={styles.textArea}
              />
            </View>

            <Text style={styles.inputHeader}>{I18n.t('runner.glitch-form.index.internal-followup')}</Text>
            <View style={styles.textAreaContainer}>
              <Field
                name="followup"
                placeholder={I18n.t('runner.glitch-form.index.add-followup-instructions')}
                placeholderTextColor={Colors.greyDk.color}
                component={AutoExpandingTextField}
                minHeight={50}
                style={styles.textArea}
              />
            </View>

            <Text style={styles.inputHeader}>{I18n.t('runner.glitch-form.index.compensation-cost')}</Text>
            <View style={styles.compensationCostContainer}>
              <Field
                name="cost"
                placeholder="100"
                placeholderTextColor={Colors.greyDk.color}
                component={TextField}
                maxLength={5}
                style={styles.compensationCostInput}
              />
            <Text style={styles.currency}>{I18n.t('runner.glitch-form.index.eur')}</Text>
            </View>
          </Section>

          { isEditing ?
            <Section title={I18n.t('base.ubiquitous.tasks')}>
              { glitchTasks }
              <TouchableOpacity style={styles.addTaskBtn} onPress={onAddTask}>
                <Text style={styles.addTaskText}>{I18n.t('runner.glitch-form.index.add-task')}</Text>
              </TouchableOpacity>
            </Section>
            : null
          }

          {/* { isEditing ?
            <Section title={I18n.t('runner.glitch-form.index.handover')}>
              <TouchableOpacity style={styles.handoverBtn} onPress={this._handleToggleGroup.bind(this)}>
                <Text style={styles.handoverText}>{I18n.t('runner.glitch-form.index.send-glitch')}</Text>
              </TouchableOpacity>
            </Section>
            : null
          } */}

          <View style={styles.submitButtonContainer}>
            <TouchableOpacity style={[styles.submitButton, isEditing && props.dirty ? Colors.blueLt.bg : null]} onPress={props.pristine ? onClose : handleSubmit}>
              { isEditing ?
                props.pristine ?
                <Text style={styles.submitButtonText}>{I18n.t('runner.glitch-form.index.close-glitch')}</Text>
                : <Text style={[styles.submitButtonText]}>{I18n.t('runner.glitch-form.index.update-glitch')}</Text>
                : <Text style={styles.submitButtonText}>{I18n.t('runner.glitch-form.index.submit-new-glitch')}</Text>
              }
            </TouchableOpacity>
          </View>

          <LocationSelectModal
            rooms={rooms}
            selectedLocations={selectedLocations}
            isVisible={isLocationsActive}
            handleSelectLocation={this._handleChangeLocation.bind(this)}
            toggleModal={this._handleToggleLocations.bind(this)}
            />

          <GroupSelectModal
            groups={groups}
            selectedGroup={null}
            isVisible={isGroupsActive}
            handleSelectGroup={this._handleHandoverGroup.bind(this)}
            toggleModal={this._handleToggleGroup.bind(this)}
            />
        </ScrollView>

        <KeyboardSpacer />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  subheader: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    ...Colors.blueLt.bg,
    // borderRadius: 4
  },
  subheaderText: {
    ...Colors.white.text,
    fontSize: 17,
    fontWeight: '500'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    width: 80,
    fontWeight: 'bold',
    ...Colors.slate.text
  },
  rowInput: {
    flexGrow: 1,
    borderWidth: 1,
    color: '#000',
    borderColor: Colors.greyLt.color,
    borderRadius: 4,
    paddingVertical: 0,
    fontSize: 16,
    paddingLeft: 10,
    height: 45,
  },
  inputHeader: {
    marginBottom: 5,
    color: 'black'
  },
  textAreaContainer: {
    borderWidth: 1,
    padding: 8,
    borderColor: Colors.greyLt.color,
    borderRadius: 4,
    marginBottom: 30,
  },
  textArea: {
    fontSize: 16,
    color: '#000'
  },
  compensationCostContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  compensationCostInput: {
    fontSize: 16,
    height: 40,
    paddingRight: 10,
    textAlign: 'right',
    borderWidth: 1,
    width: 100,
    marginRight: 7,
    color: '#000',
    borderColor: Colors.greyLt.color,
    borderRadius: 4,
    paddingVertical: 0,
  },
  currency: {
  },
  submitButtonContainer: {
    padding: 0,
  },
  submitButton: {
    backgroundColor: Colors.blueLt.color,
    paddingTop: 15,
    paddingBottom: 15,
    alignItems: 'center',
    borderRadius: 0
  },
  submitButtonText: {
    color: Colors.white.color,
    fontWeight: 'bold',
    fontSize: 18
  },
  addTaskBtn: {
    ...Colors.red.bg,
    width: 110,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  addTaskText: {
    textAlign: 'center',
    ...Colors.white.text,
    fontSize: 16
  },
  glitchTaskText: {
    ...Colors.slate.text
  },
  handoverBtn: {
    ...Colors.greyDk.bg,
    width: 110,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    borderRadius: 4,
  },
  handoverText: {
    textAlign: 'center',
    ...Colors.white.text,
    fontSize: 16
  },
  moreOptionBtn: {
    height: 50,
    width: 120,
    marginLeft: 3,
    marginRight: 3,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  moreOptionText: {
    fontSize: 17,
    fontWeight: '500',
    ...Colors.white.text
  }
});

GlitchForm = reduxForm()(GlitchForm);

export default GlitchForm;
