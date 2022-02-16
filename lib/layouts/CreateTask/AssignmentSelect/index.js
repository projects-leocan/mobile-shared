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
import { Field, reduxForm } from 'redux-form';
import ListView from 'rc-mobile-base/lib/components/ListView';
import FormField from 'rc-mobile-base/lib/components/FormField';
import checkEqual from 'rc-mobile-base/lib/utils/check-equal';

import { get, extend } from 'lodash/object';
import { remove, uniq } from 'lodash/array';
import { includes, some } from 'lodash/collection';
import { isEmpty } from 'lodash/lang';

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
  SubmitLabel,
  BodyContainer,
  FooterContainer
} from './styles';

import {
  white,
  blueLt,
  grey,
  greyDk,
  text,
  themeTomato
} from 'rc-mobile-base/lib/styles';
import { omit } from 'lodash';
import TaskButton from '../TaskButton';

class AssignmentSelect extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedAssign: []
    }
  }

  _handleSelect = (value) => {
    const { selectedAssign } = this.state;

    const validateSelectedAssign = selectedAssign.map(item => omit(item, ['isSelected']));
    const validateSelected = omit(value, ['isSelected']);

    if (some(validateSelectedAssign, validateSelected)) {
      const updateSelectionAssign = selectedAssign.filter(item => (item.value !== value.value || item.type !== value.type));
      this.setState({ selectedAssign: updateSelectionAssign })
    } else {
      this.setState({ selectedAssign: uniq([...selectedAssign, value]) })
    }
    // const { selectedAssignments, updateAssignments } = this.props;
    // let assignments = null;

    // if (value === 'maintenance team') {
    //   return updateAssignments(['maintenance team']);
    // }

    // if (selectedAssignments.length === 1 && selectedAssignments[0] === 'maintenance team') {
    //   return updateAssignments([value,]);
    // }

    // if (selectedAssignments.includes(value)) {
    //   assignments = selectedAssignments.filter(assignment => assignment !== value);
    // } else {
    //   assignments = [
    //     ...selectedAssignments,
    //     value
    //   ]
    // }

    // updateAssignments(assignments);
  }

  _getOptions() {
    const { assignmentOptions, selectedAssignments, selectedAction } = this.props;
    const { selectedAssign } = this.state;

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


    const validateSelectedAssign = selectedAssign.map(item => omit(item, ['isSelected']));
    // console.log(validateSelectedAssign)
    // console.log('---- validateSelectedAssign ----')
    // console.log(validateSelectedAssign)

    // return options
    //   .map(option => ({
    //     ...option,
    //     // isSelected: selectedAssignments.includes(option.value)
    //     isSelected: includes(validateSelectedAssign, option)
    //   }))

    return options
      .map(option => {
        // console.log('---- map ---');
        // console.log(option)
        // console.log(validateSelectedAssign)
        // console.log(some(validateSelectedAssign, option))

        return {
          ...option,
          isSelected: some(validateSelectedAssign, option)
        }
      })
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   // const { assignmentOptions, selectedAssignments, selectedAction } = this.props;

  //   return !checkEqual(this.props, nextProps, 'assignmentOptions')
  //     || !checkEqual(this.props, nextProps, 'selectedAssignments')
  //     || !checkEqual(this.props, nextProps, 'selectedAction');
  // }

  onNextPage = () => {
    const { onNext } = this.props;
    const { selectedAssign } = this.state;

    if (isEmpty(selectedAssign)) {
      alert(`Please select ${I18n.t('base.ubiquitous.assignments')}`);
      return true;
    }

    onNext();
  }

  render() {
    const { selectedAssignments, submit, onNext } = this.props;
    const options = this._getOptions();

    return (
      <Container>
        <BodyContainer>
          <SearchForm />

          <ListContainer>
            <ListView
              data={options}
              renderRow={(row, _, index) => <Item index={index} onPress={this._handleSelect} row={row} />}
              renderSectionHeader={(label) => <Header label={label} />}
              renderFooter={() => <ListFooter />}
              getSectionId={(data) => data.type}
            />
          </ListContainer>

        </BodyContainer>

        <FooterContainer>
        <TaskButton
          label="Next"
          buttonStyle={{ backgroundColor: themeTomato.color, borderWidth: 0 }}
          labelStyle={{ color: '#FFF' }}
          onPress={() => this.onNextPage()}
        />
        </FooterContainer>
        {/* <Submit
          assignments={selectedAssignments}
          onPress={submit}
        /> */}
      
      </Container>
    )
  }
}

export default AssignmentSelect;