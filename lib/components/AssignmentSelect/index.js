import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet
} from 'react-native';
import I18n from 'react-native-i18n';

import Button from 'rc-mobile-base/lib/components/Button';
import ListView from 'rc-mobile-base/lib/components/ListView';

import SectionHeading from '../section-heading';
import UserSelectRow from './UserSelectRow';
import GroupSelectRow from './GroupSelectRow';
import SpecialSelectRow from './SpecialSelectRow';

import { find, filter, includes } from 'lodash/collection';
import { get } from 'lodash/object';
import { flatten } from 'lodash/array';

import {
  padding,
  grey400,
  red,
  flxRow,
  flx1
} from 'rc-mobile-base/lib/styles';

const TEAM_MAP = {
  'housekeeping': { label: 'Housekeeping', translation: 'housekeeping', userFlags: ['isAttendant', 'isInspector'] },
  'attendant': { label: 'Attendants', translation: 'attendants', userFlags: ['isAttendant'] },
  'inspector': { label: 'Inspectors', translation: 'inspectors', userFlags: ['isInspector'] },
  'maintenance': { label: 'Maintenance', translation: 'maintenance', userFlags: ['isMaintenance'] },
  'runner': { label: 'Runners', translation: 'runners', userFlags: ['isRoomRunner'] },
  'concierge': { label: 'Concierge', translation: 'concierge', userFlags: ['isReceptionist'] },
  'management': { label: 'Management', translation: 'management', userFlags: ['isAdministrator'] },
};

class AssignmentSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: ''
    }
  }

  _renderDefaultAssignment() {
    const { defaultAssignment } = this.props;

    if (!defaultAssignment) {
      return null;
    }

    return (
      <View>
        <SectionHeading>Default Assignment</SectionHeading>
      </View>
    );
  }

  _renderPlannedAttendant(team) {
    const { selectedAssignments, handleSelectAssignment } = this.props;
    if (team !== 'attendant') {
      return null;
    }

    const user = {
      value: 'planned',
      name: 'Planned Attendant',
      isPlannedAttendant: true,
      symbol: 'A'
    }

    return (
      <SpecialSelectRow
        special={user}
        index={0}
        style={{paddingLeft: 10, paddingRight: 10, borderColor: '#F5F5F5'}}
        isSelected={selectedAssignments.includes(user.value)}
        onPress={handleSelectAssignment}
        />
    )
  }

  _renderPlannedRunner(team) {
    const { selectedAssignments, handleSelectAssignment } = this.props;
    if (team !== 'runner') {
      return null;
    }

    const user = {
      value: 'runner',
      name: 'Planned Runner',
      isPlannedRunner: true,
      symbol: 'R'
    }

    return (
      <SpecialSelectRow
        special={user}
        index={0}
        style={{paddingLeft: 10, paddingRight: 10, borderColor: '#F5F5F5'}}
        isSelected={selectedAssignments.includes(user.value)}
        onPress={handleSelectAssignment}
        />
    )
  }

  _renderMaintenanceTeam(team) {
    const { selectedAssignments, handleSelectAssignment } = this.props;
    if (team !== 'maintenance') {
      return null;
    }

    const user = {
      value: 'maintenance team',
      name: 'Maintenance Team',
      isMaintenanceTeam: true,
      symbol: 'M'
    }

    return (
      <SpecialSelectRow
        special={user}
        index={0}
        style={{paddingLeft: 10, paddingRight: 10, borderColor: '#F5F5F5'}}
        isSelected={selectedAssignments.includes(user.value)}
        onPress={handleSelectAssignment}
        />
    )
  }

  _renderTeam(users, team, isDisabled) {
    const { isShowTeams, selectedAssignments, handleSelectAssignment } = this.props;

    if (isDisabled) {
      return null;
    }

    const teamInformation = get(TEAM_MAP, team);
    const teamFlags = get(teamInformation, 'userFlags');
    const teamUsers = flatten(teamFlags.map(f => filter(users, f)));

    if (!teamUsers || !teamUsers.length) {
      return null;
    }

    return (
      <View>
        <View style={styles.headingContainer}>
          <Text style={styles.headingLabel}>{ I18n.t(`runner.components.assignment-select.${teamInformation.translation}`).toUpperCase() }</Text>
        </View>
        { this._renderPlannedAttendant(team) }
        { this._renderPlannedRunner(team) }
        { this._renderMaintenanceTeam(team) }
        {teamUsers.map((user, idx) => {
          return <UserSelectRow
            key={user._id}
            user={user}
            index={1}
            style={{paddingLeft: 10, paddingRight: 10, borderColor: '#F5F5F5'}}
            isSelected={selectedAssignments.includes(user._id)}
            onPress={handleSelectAssignment} />
        })}
      </View>
    )
  }

  _renderGroups(groups) {
    const { selectedAssignments, handleSelectAssignment } = this.props;

    return (
      <View>
        <View style={styles.headingContainer}>
          <Text style={styles.headingLabel}>{ I18n.t(`runner.components.assignment-select.groups`).toUpperCase() }</Text>
        </View>
        {groups.map((group, idx) => {
          return <GroupSelectRow
            key={group._id}
            group={group}
            index={1}
            style={{paddingLeft: 10, paddingRight: 10, borderColor: '#F5F5F5'}}
            isSelected={selectedAssignments.includes(group._id)}
            onPress={handleSelectAssignment} />
        })}
      </View>
    )
  }

  render() {
    const {
      isVisible,
      users,
      groups,
      isShowTeams,
      isShowGroups,
      isMultiple,
      isDisableHousekeeping,
      isDisableMaintenance,
      isDisableConcierge,
      isDisableManagement,
      defaultAssignment,
      toggleModal,
      handleSubmit,
      handleCancel,
      handleContinue
    } = this.props;

    const { searchQuery } = this.state;
    const cleanQuery = searchQuery && searchQuery.toLowerCase() || null;
    const filteredUsers = cleanQuery ?
      filter(users, u => includes(u.first_name.toLowerCase(), cleanQuery)
                      || includes(u.last_name.toLowerCase(), cleanQuery)
      )
      : users;

    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textField}
          onChangeText={(t) => this.setState({ searchQuery: t })}
          value={searchQuery}
          multiline={false}
          placeholder={I18n.t('base.ubiquitous.search-users')} />

        <View style={[flx1]}>
          <ScrollView>
            { this._renderDefaultAssignment() }
            { this._renderTeam(filteredUsers, 'attendant', isDisableHousekeeping) }
            { this._renderTeam(filteredUsers, 'runner', isDisableHousekeeping) }
            { this._renderTeam(filteredUsers, 'maintenance', isDisableHousekeeping) }
            { this._renderTeam(filteredUsers, 'inspector', isDisableHousekeeping) }
            { this._renderTeam(filteredUsers, 'concierge', isDisableHousekeeping) }
            { this._renderTeam(filteredUsers, 'management', isDisableHousekeeping) }
            { this._renderGroups(groups) }
          </ScrollView>
        </View>

        { handleContinue ?
          <Button style={{ height: 50, backgroundColor: '#3CC86B', borderRadius: 5, margin: 3 }} onPress={handleContinue}>
            <Text style={styles.bigBtnText}>{ I18n.t('base.ubiquitous.continue').toUpperCase() }</Text>
          </Button>
          : null
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
    backgroundColor: '#F7F7F7'
  },
  scrollContainer: {
    // flex: 1,
    // paddingTop: 5,
    // marginBottom: 2
    height: 450
  },
  fieldLabel: {
    fontWeight: '600',
    color: '#4A4A4A',
    fontSize: 14,
    marginTop: 5,
    marginRight: 20,
    marginLeft: 20
  },
  textField: {
    height: 40,
    borderColor: '#DDDDDD',
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    // marginTop: 5,
    fontSize: 14,
    marginRight: 20,
    marginLeft: 20,
    marginTop: 0,
    marginBottom: 5
  },
  subheader: {
    shadowColor: 'rgba(0,0,0,0.40)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  headingContainer: {
    // height: 20,
    backgroundColor: '#52C0F9',
    justifyContent: 'center',
    alignItems: 'flex-start',
    ...padding.x20,
    ...padding.y10
  },
  headingLabel: {
    color: 'white',
    fontWeight: '600',
    fontSize: 13
  },
  submitBtn: {
    height: 50,
    backgroundColor: '#3CC86B',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bigBtnText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '500'
  },
});

export default AssignmentSelect;
