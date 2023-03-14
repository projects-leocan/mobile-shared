import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet
} from 'react-native';

import Button from 'rc-mobile-base/lib/components/Button';
import ListView from 'rc-mobile-base/lib/components/ListView';

import ModalHeader from './modal-header';

import { find, filter, includes } from 'lodash/collection';
import { padding, grey, margin, lCenterCenter, slate } from 'rc-mobile-base/lib/styles';

class GroupSelectModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: ''
    }
  }

  _renderRow = (data) => {
    const { handleSelectGroup } = this.props;

    return (
      <TouchableOpacity style={styles.groupSelect} onPress={() => handleSelectGroup(data._id)}>
        <View style={styles.groupThumbnail}>
          <Text style={styles.groupInitial}>{ data.name[0] }</Text>
        </View>
        <Text style={styles.groupName}>{ data.name }</Text>
      </TouchableOpacity>
    )
  }

  render() {
    const {
      isVisible,
      groups,
      toggleModal,
      handleSelectGroup
    } = this.props;

    const { searchQuery } = this.state;
    const cleanQuery = searchQuery && searchQuery.toLowerCase() || null;
    const filterGroups = cleanQuery ?
      filter(groups, g => includes(g.name.toLowerCase(), cleanQuery))
      : groups;

    return (
      <Modal
        animationType={"slide"}
        onRequestClose={() => null}
        transparent={false}
        visible={isVisible}
      >
        <View style={styles.container}>
          <ModalHeader>Select Assignment</ModalHeader>
          <View style={styles.subheader}>
            <TextInput
              style={styles.textField}
              onChangeText={(t) => this.setState({ searchQuery: t })}
              value={searchQuery}
              multiline={false}
              placeholder={"Search Users"} />
          </View>

          <View style={{ flex: 1 }}>
            <ListView
              data={filterGroups}
              renderRow={this._renderRow}
              />
          </View>
          <Button styleName="full-width" style={{maxHeight: 44, backgroundColor: '#3CC86B'}} onPress={toggleModal}>
            <Text>Close</Text>
          </Button>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingTop: 6,
    // paddingBottom: 10
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
    marginLeft: 20
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
    height: 20,
    backgroundColor: '#52C0F9',
    justifyContent: 'center',
    padding: 20
  },
  headingLabel: {
    color: 'white',
    fontWeight: '600',
    fontSize: 13
  },
  groupSelect: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    ...padding.x10
  },
  groupThumbnail: {
    height: 48,
    width: 48,
    borderRadius: 24,
    ...margin.r10,
    ...grey.bg,
    ...lCenterCenter
  },
  groupInitial: {
    fontSize: 20,
    ...slate.text
  },
  groupName: {
    ...slate.text,
    fontSize: 17
  }
});

GroupSelectModal.defaultProps = {
  isVisible: false,
  groups: []
};

export default GroupSelectModal;
