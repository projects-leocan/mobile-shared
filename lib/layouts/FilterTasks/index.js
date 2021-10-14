import React, { Component } from 'react';
import { connect } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { uniq, remove } from 'lodash'

import SelectOption from './SelectOption';
import TaskList from 'rc-mobile-base/lib/components/TaskList';

import {
  filterOptionsSelector,
  availableTasksSelector
} from './selectors'

import {
  Container,
  SubheaderFilterContainer,
  SubheaderActiveFiltersContainer,
  SubheaderFilterButton,
  SubheaderFilteredItemButton,
  SubheaderFilteredItemText
} from './styles';

import {
  blueLt
} from 'rc-mobile-base/lib/styles';

class FilterTasksLayout extends React.PureComponent {

  state = {
    isSelectVisible: false,
    filteredOptions: [],
    availableTasks: []
  }

  _toggleSelect = () => this.setState({ isSelectVisible: !this.state.isSelectVisible })
  _handleAddOption = (option) => this.setState({ filteredOptions: uniq([ ...this.state.filteredOptions, option ]), isSelectVisible: false })
  _handleRemoveOption = (option) => this.setState({filteredOptions: this.state.filteredOptions.filter(o => o.value !== option.value ) })

  render() {
    const { filterOptions, availableTasks } = this.props;
    const { filteredOptions } = this.state;

    console.log(availableTasks)

    return (
      <Container>
        <SubheaderFilterContainer>
          <SubheaderActiveFiltersContainer>
            { filteredOptions.map(option =>
              <SubheaderFilteredItemButton key={option.value} onPress={() => this._handleRemoveOption(option)}>
                <SubheaderFilteredItemText>{ option.label }</SubheaderFilteredItemText>
                <FontAwesome name="times" color="white" size={12} />
              </SubheaderFilteredItemButton>  
            )}
          </SubheaderActiveFiltersContainer>
          
          <SubheaderFilterButton onPress={this._toggleSelect}>
            <FontAwesome name="filter" size={20} color={blueLt.color} />
          </SubheaderFilterButton>
        </SubheaderFilterContainer>

        <TaskList
          sectionId="category"
          tasks={tasks}
          Row={Task}
          onPress={() => null}
          onSwipeoutPress={() => null}
          openModal={() => null}
          closeModal={() => null}
          isVirtualized={true}
          />

        <SelectOption
          toggleModal={this._toggleSelect}
          isVisible={this.state.isSelectVisible}
          filterOptions={filterOptions}
          addOption={this._handleAddOption}
          />
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  filterOptions: filterOptionsSelector(state),
  availableTasks: availableTasksSelector()(state)
})

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(FilterTasksLayout);