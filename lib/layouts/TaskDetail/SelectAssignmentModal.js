import React from 'react';
import { Modal, SectionList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import ModalHeader from 'rc-mobile-base/lib/components/ModalHeader';
import SearchSubheader from 'rc-mobile-base/lib/components/SearchSubheader';

import {
  ModalContainer,
  ModalUserContainer,
  MessageAvatar,
  MessageAlt,
  ModalUserText,
  ModalSectionHeader
} from './styles';

import {
  white,
  padding,
  jcc,
  aic
} from 'rc-mobile-base/lib/styles';

export const UserItem = ({ user, group, handler = () => null }) => (
  <ModalUserContainer onPress={handler}>
    { user && user.image ?
      <MessageAvatar
        source={{ uri: user.image || '' }}
        />
      :
      user ?
      <MessageAlt>{ user.fullName.length && user.fullName[0] || '' }</MessageAlt>
      :
      <MessageAlt>{ group.name.length && group.name[0] || '' }</MessageAlt>
    }

    { user ?
      <ModalUserText>{ `${user.fullName}` }</ModalUserText>
      :
      <ModalUserText>{ group.name }</ModalUserText>
    }
  </ModalUserContainer>
)

class SelectAssignmentModal extends React.Component {
  
  state = {
    searchQuery: ''
  }

  _handleUpdateQuery = (t) => this.setState({ searchQuery: t })
  _handlePress = (item) => {
    const { toggleModal, handler } = this.props;

    toggleModal();
    handler(item);
  }
  
  render() {
    const { isVisible, toggleModal, userSections } = this.props;
    const { searchQuery } = this.state;
    const cleanQuery = searchQuery && searchQuery.toLowerCase().trim();

    const filteredUserSections = cleanQuery ?
      userSections
        .map(section => ({
          ...section,
          data: section.data.filter(item => item.fullName.toLowerCase().includes(cleanQuery))
        }))
        .filter(section => section.data.length)
      : userSections;

    return (
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={isVisible}
        onRequestClose={toggleModal}
      >
        <ModalContainer>
          {/* <ModalHeader onPress={toggleModal}>Select Assignment</ModalHeader> */}
          <ModalHeader
            onPress={toggleModal}
            value={'Select Assignment'}
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
            renderItem={({ item, index }) =>
              <UserItem
                user={item.fullName && item || null}
                handler={() => this._handlePress(item)}
                />
            }
            renderSectionHeader={({ section: { title }}) => (
              <ModalSectionHeader>{ title }</ModalSectionHeader>
            )}
            sections={filteredUserSections}
            keyExtractor={(item, index) => item._id}
            />
        </ModalContainer>
      </Modal>
    )
  }
}

export default SelectAssignmentModal;