import React from 'react';
import { Modal, SectionList } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import ModalHeader from 'rc-mobile-base/lib/components/ModalHeader';
import SearchSubheader from 'rc-mobile-base/lib/components/SearchSubheader';

import {
  ModalContainer,
  ModalOptionItem,
  ModalOptionText,
  ModalSectionHeader
} from './styles';

import {
  white,
  slate,
  padding,
  jcc,
  aic
} from 'rc-mobile-base/lib/styles';

class SelectOption extends React.Component {

  static defaultProps = {
    isVisible: false,
    toggleModal: () => null,
    filterOptions: []
  }

  state = {
    searchQuery: ''
  }

  _handleUpdateQuery = (t) => this.setState({ searchQuery: t })

  render() {
    const { isVisible, toggleModal, filterOptions, addOption } = this.props;
    const { searchQuery } = this.state;
    const cleanQuery = searchQuery && searchQuery.toLowerCase().trim();

    const searchedOptions = cleanQuery ?
      filterOptions
        .map(section => ({
          ...section,
          data: section.data.filter(item => item.label.toLowerCase().includes(cleanQuery))
        }))
        .filter(section => section.data.length)
      : filterOptions;
    
    return (
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={isVisible}
        onRequestClose={toggleModal}
      >
        <ModalContainer>
          <ModalHeader
            onPress={toggleModal}
            value={'Options'}
            />
          <SearchSubheader
            updateQuery={this._handleUpdateQuery}
            searchQuery={this.state.searchQuery}
            style={{
              container: { ...white.bg, ...padding.y10 },
              input: { ...jcc, ...aic }
            }}
            >
            Search
          </SearchSubheader>

          <SectionList
            renderItem={({ item, index }) => (
              <ModalOptionItem onPress={() => addOption(item)}>
                <ModalOptionText>{ item.label }</ModalOptionText>
                <FontAwesome name="chevron-right" color={slate.color} size={24} />
              </ModalOptionItem>
            )}
            renderSectionHeader={({ section: { title }}) => (
              <ModalSectionHeader>{ title }</ModalSectionHeader>
            )}
            sections={searchedOptions}
            keyExtractor={(item, index) => item.value}
            ListFooterComponent={() => cleanQuery ? (
              <ModalOptionItem onPress={() => { addOption({ label: searchQuery, value: searchQuery }); this.setState({ searchQuery: '' }) }}>
                <ModalOptionText>{ `Add search term: ${searchQuery}` }</ModalOptionText>
              </ModalOptionItem>
            ) : null}
            />
        
        </ModalContainer>
      </Modal>
    )
  }
}

export default SelectOption;