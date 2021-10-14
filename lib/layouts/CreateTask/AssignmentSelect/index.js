import React, { Component, PureComponent } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  StyleSheet
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import I18n from 'react-native-i18n'
import { Field, reduxForm  } from 'redux-form';
import ListView from 'rc-mobile-base/lib/components/ListView';
import FormField from 'rc-mobile-base/lib/components/FormField';
import checkEqual from 'rc-mobile-base/lib/utils/check-equal';

import { get, extend } from 'lodash/object';
import { remove } from 'lodash/array';

import Header from './Header';
import Item from './Item';
import SearchForm from './SearchForm';
import Submit from './Submit';

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
  SubmitLabel
} from './styles';

import {
  white,
  blueLt,
  grey,
  greyDk,
  text,
} from 'rc-mobile-base/lib/styles';

class AssignmentSelect extends Component {

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

  _getOptions() {
    const { assignmentOptions, selectedAssignments, selectedAction } = this.props;
    // let options = extend([], assignmentOptions);
    let options = [...assignmentOptions];
    
    if (selectedAction && get(selectedAction, 'body.default_assignment')) {
      const defaultAssignment = get(selectedAction, 'body.default_assignment');
      const [name, type, value] = defaultAssignment.split(':');
      // options.unshift({ name, value, type: 'default-assignment' });
      options = [
        { name, value, type: 'default-assignment' },
        ...options
      ];
    }

    return options
      .map(option => ({
        ...option,
        isSelected: selectedAssignments.includes(option.value)
      }))
  }

  shouldComponentUpdate(nextProps, nextState) {
    // const { assignmentOptions, selectedAssignments, selectedAction } = this.props;
    
    return !checkEqual(this.props, nextProps, 'assignmentOptions')
        || !checkEqual(this.props, nextProps, 'selectedAssignments')
        || !checkEqual(this.props, nextProps, 'selectedAction');
  }

  render() {
    const { selectedAssignments, submit } = this.props;
    const options = this._getOptions()

    return (
      <Container>
        <SearchForm />

        <ListContainer>
          <ListView
            data={options}
            renderRow={(row, _, index) => <Item index={index} onPress={this._handleSelect} {...row} />}
            renderSectionHeader={(label) => <Header label={label} />}
            renderFooter={() => <ListFooter />}
            getSectionId={(data) => data.type}
            />
        </ListContainer>

        <Submit
          assignments={selectedAssignments}
          onPress={submit}
          />
      </Container>
    )
  }
}

export default AssignmentSelect;