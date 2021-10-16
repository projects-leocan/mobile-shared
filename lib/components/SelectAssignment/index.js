import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  StyleSheet,
  Modal
} from 'react-native';
import compact from 'lodash/compact';

import Icon from 'react-native-vector-icons/FontAwesome';
import EIcon from 'react-native-vector-icons/Entypo';
import I18n from 'react-native-i18n'
import { Field, reduxForm  } from 'redux-form';
import ListView from 'rc-mobile-base/lib/components/ListView';
import FormField from 'rc-mobile-base/lib/components/FormField';
import SectionHeading from '../section-heading';

import { get, extend } from 'lodash/object';
import { remove } from 'lodash/array';

import Header from './Header';
import Item from './Item';
import SearchForm from './SearchForm';
import Submit from './Submit';
import SectionHeader from '../SectionHeader';

import {
  Container,
  ListContainer,
  ListHeader,
  ListFooter,
  Name,
  BackupContainer,
  BackupLabel,
  SubmitButton,
  SubmitButtonDisabled,
  SubmitLabel,
  Search,
} from './styles';

import {
  white,
  blueLt,
  grey,
  greyDk,
  text,
  flxRow,
  aic,
  padding,
  green,
  jcc,
  margin,
  flexGrow1,
  blue300,
  jcsb,
} from 'rc-mobile-base/lib/styles';

class AssignmentSelect extends Component {
  state = {
    search: null
  }

  _handleSelect = (value) => {
    const { selectedAssignments, updateAssignments } = this.props;
    let assignments = null;

    if (value === 'maintenance team') {
      return updateAssignments(['maintenance team']);
    }

    if (selectedAssignments.length === 1 && selectedAssignments[0] === 'maintenance team') {
      return updateAssignments([value,]);
    }

    if (selectedAssignments.includes(value)) {
      assignments = selectedAssignments.filter(assignment => assignment !== value);
    } else {
      assignments = [
        ...selectedAssignments,
        value
      ]
    }

    updateAssignments(assignments);
  }

  handleSearch = (value) => {
    this.setState({ search: value })
  }

  _getOptions() {
    const { assignmentOptions, selectedAssignments, selectedAction } = this.props;
    const search = this.state.search
    let options = extend([], assignmentOptions);
    
    if (selectedAction && get(selectedAction, 'body.default_assignment')) {
      const defaultAssignment = get(selectedAction, 'body.default_assignment');
      const [name, type, value] = defaultAssignment.split(':');
      // options.unshift({ name, value, type: 'default-assignment' });
      options = [
        { name, value, type: 'default-assignment' },
        ...options
      ];
    }

    const mapped = options
      .map(option => ({
        ...option,
        isSelected: selectedAssignments.includes(option.value)
      }))

    if (!search) {
      return mapped
    }

    return mapped.filter(o => o.value.match(new RegExp(search, 'i')))
  }

  render() {
    const options = this._getOptions()

    return (
      <Container>
        <Search>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            style={[white.bg, greyDk.text, text.center, text.fw600, {borderRadius: 20, height: 40}]}
            name="search"
            placeholder={I18n.t('maintenance.createtask.assignment.search-assignments')}
            onChangeText={(text) => this.handleSearch(text)}
          />
        </Search>

        <ListContainer>
          <ListView
            data={options}
            renderRow={(row, _, index) => <Item index={index} onPress={this._handleSelect} {...row} />}
            renderSectionHeader={(label) => <Header label={label} />}
            renderFooter={() => <ListFooter />}
            getSectionId={(data) => data.type}
          />
        </ListContainer>
      </Container>
    )
  }
}

import ModalHeader from 'rc-mobile-base/lib/components/ModalHeader';

const Assignment = ({ name, onPress }) => (
  <TouchableOpacity
    style={[flxRow, blue300.bg, aic, jcsb, margin.a5, padding.x5, {height: 45, minWidth: 35, borderRadius: 20}]}
    onPress={onPress}
  >
    <Text style={[white.text, margin.x5]}>
      {name}
    </Text>
    <EIcon
      style={[margin.x5]}
      name="cross"
      size={18}
      color={white.color}
    />
  </TouchableOpacity>
)

const AssignmentAdd = ({ onPress }) => (
  <TouchableOpacity
    style={[green.bg, aic, jcc, margin.a5, {height: 45, width: 45, borderRadius: 27}]}
    onPress={onPress}
  >
    <EIcon
      name="plus"
      size={20}
      color={white.color}
    />
  </TouchableOpacity>
)

const Opener = ({ assignments, toggle, onRemove }) => (
  <View
    style={[white.bg, flxRow, aic,  padding.x5, {flexWrap: 'wrap'}]}
  >
    {
      assignments.length > 0 ? assignments.map((field, index) => (
        <Assignment
          key={index}
          name={field.name}
          onPress={() => onRemove(field.value)}
        />
      )) : null
    }
    <AssignmentAdd onPress={toggle} />
  </View>
)


class ModalAssignment extends Component {
  state = {
    isVisible: false
  }

  handleValue = () => this.setState({ isVisible: !this.state.isVisible })

  render() {
    const { assignmentOptions, selectedAssignments, updateAssignments, removeAssignment, isShowHeader, isOptional, headerLabel = null } = this.props
    const selected = compact(selectedAssignments.map(a => assignmentOptions.find(ao => ao.value === a)))

    return (
      <View>
        { isShowHeader && (
          isOptional ?
            <SectionHeader value={headerLabel || `${I18n.t('base.ubiquitous.assignments')} (${I18n.t('base.ubiquitous.optional')})`} />
          :
            <SectionHeader value={headerLabel || I18n.t('base.ubiquitous.assignments')} />
        )}
        <Opener
          toggle={this.handleValue}
          onRemove={removeAssignment}
          assignments={selected}
        />
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.isVisible}
          onRequestClose={() => this.setState({ isVisible: false })}
        >
          <View style={[flexGrow1, grey.bg]}>
            <ModalHeader value={I18n.t('base.components.selectassignmentmodal.select-assignment')} onPress={this.handleValue} />
            <AssignmentSelect
              assignmentOptions={assignmentOptions}
              selectedAction={null}
              selectedAssignments={selectedAssignments || []}
              updateAssignments={updateAssignments}
              submit={(assignments) => console.log('SSSSSS', assignments)}
            />
          </View>
        </Modal>
      </View>
    )
  }
}

export default ModalAssignment;
