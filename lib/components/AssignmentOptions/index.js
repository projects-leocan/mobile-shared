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

import Button from 'rc-mobile-base/lib/components/Button';
import ListView from 'rc-mobile-base/lib/components/ListView';
import I18n from 'react-native-i18n';

import SectionHeader from '../SectionHeader';
import Row from './Row';

import { find, filter, includes } from 'lodash/collection';
import { get, extend } from 'lodash/object';
import { flatten } from 'lodash/array';

import {
  padding,
  grey400,
  lCenterCenter,
  green,
  white,
  red,
  flxRow,
  flx1,
  flx4
} from 'rc-mobile-base/lib/styles';

class AssignmentSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: '',
      selectedOptions: []
    }
  }

  _computedUsersList() {
    const {
      users,
      groups,
      isDisableAttendant,
      isDisableInspectors,
      isDisableMaintenance,
      isDisableRunners,
      isDisableReceptionist,
      isDisableAdministrator,
      isDisableGroups
    } = this.props;

    let options = [];

    if (!isDisableAttendant) {
      options.push({
        value: 'planned',
        name: I18n.t('base.ubiquitous.planned-attendant'),
        type: 'Attendant',
        isPlannedAttendant: true,
        symbol: 'A'
      });

      users
        .filter(u => u.isAttendant)
        .forEach(u => {
          options.push(extend({}, u, { name: `${u.first_name} ${u.last_name}`, value: u._id, type: I18n.t('base.ubiquitous.attendant') }))
        });
    }

    if (!isDisableInspectors) {
      users
        .filter(u => u.isInspector)
        .forEach(u => {
          options.push(extend({}, u, { name: `${u.first_name} ${u.last_name}`, value: u._id, type: I18n.t('base.ubiquitous.inspector') }))
        })
    }

    if (!isDisableMaintenance) {
      options.push({
        value: 'maintenance team',
        name: 'Maintenance Team',
        type: 'Maintenance',
        isMaintenanceTeam: true,
        symbol: 'M'
      });

      users
        .filter(u => u.isMaintenance)
        .forEach(u => {
          options.push(extend({}, u, { name: `${u.first_name} ${u.last_name}`, value: u._id, type: I18n.t('base.ubiquitous.maintenance') }))
        })
    }

    if (!isDisableRunners) {
      users
        .filter(u => u.isRoomRunner)
        .forEach(u => {
          options.push(extend({}, u, { name: `${u.first_name} ${u.last_name}`, value: u._id, type: I18n.t('base.ubiquitous.runner') }))
        })
    }

    if (!isDisableReceptionist) {
      users
        .filter(u => u.isReceptionist)
        .forEach(u => {
          options.push(extend({}, u, { name: `${u.first_name} ${u.last_name}`, value: u._id, type: I18n.t('base.ubiquitous.receptionist') }))
        })
    }

    if (!isDisableAdministrator) {
      users
        .filter(u => u.isAdministrator)
        .forEach(u => {
          options.push(extend({}, u, { name: `${u.first_name} ${u.last_name}`, value: u._id, type: I18n.t('base.ubiquitous.administrator') }))
        })
    }

    if (!isDisableGroups) {
      groups
        .forEach(g => {
          options.push(extend({}, g, { value: g._id, type: I18n.t('base.ubiquitous.group') }))
        })
    }

    return options;
  }

  _handleSelectOption = (option) => {
    const { selectedOptions } = this.state;
    
    if (selectedOptions.includes(option)) {
      this.setState({ selectedOptions: selectedOptions.filter(o => o !== option )})
    } else {
      this.setState({ selectedOptions: [...selectedOptions, option] })
    }
  }

  _renderSection(section) {
    return (
      <View style={styles.headingContainer}>
        <Text style={styles.headingLabel}>{ section.toUpperCase() }</Text>
      </View>
    )
  }

  render() {
    const { handleSubmit, handleCancel } = this.props;
    const { searchQuery, selectedOptions } = this.state;
    
    const options = this._computedUsersList()
      .map(o => extend({}, o, { isSelected: selectedOptions.includes(o.value) }));
    const cleanQuery = searchQuery && searchQuery.toLowerCase();

    const filteredOptions = cleanQuery ?
      options.filter(o => o.name.toLowerCase().includes(cleanQuery)) :
      options;

    const isSubmitDisabled = !selectedOptions.length;

    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textField}
          onChangeText={(t) => this.setState({ searchQuery: t })}
          value={searchQuery}
          multiline={false}
          placeholder={I18n.t('base.ubiquitous.search-users')} />

        <View style={[flx1]}>
          <ListView
            data={filteredOptions}
            renderRow={(userRow, _, index) => <Row user={userRow} index={index} handleSelect={this._handleSelectOption} />}
            renderSectionHeader={(secId) => this._renderSection(secId)}
            getSectionId={(userRow) => userRow.type}
            />
        </View>

        <View style={[flxRow]}>
          <Button style={[{ height: 50, borderRadius: 0, opacity: isSubmitDisabled ? .5 : 1 }, green.bg, flx4, lCenterCenter]} onPress={() => isSubmitDisabled ? null : handleSubmit(selectedOptions)}>
            <Text style={[white.text, { fontSize: 17, fontWeight: 'bold' }]}>{ I18n.t('base.ubiquitous.submit').toUpperCase() }</Text>
          </Button>
          <Button style={[{ height: 50, borderRadius: 0 }, red.bg, flx1, lCenterCenter]} onPress={handleCancel}>
            <Text style={[white.text, { fontSize: 17, fontWeight: 'bold' }]}>{ I18n.t('base.ubiquitous.cancel').toUpperCase() }</Text>
          </Button>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10
  },
  textField: {
    height: 40,
    borderColor: '#DDDDDD',
    backgroundColor: '#F7F7F7',
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
});

export default AssignmentSelect;
