import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  ScrollView,
  Dimensions,
  Modal,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import ListView from "deprecated-react-native-listview";
import Button from 'rc-mobile-base/lib/components/Button';
import I18n from 'react-native-i18n';

import AssetSelectRow from './AssetSelectRow';
import ModalHeader from './ModalHeader';

import { filter, find, includes } from 'lodash/collection';
import { get } from 'lodash/object';

class AssetSelectModal extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 || r1.isSelected || r2.isSelected });
    const { assets } = this.props;

    this.state = {
      searchQuery: '',
      dataSource: ds.cloneWithRows(assets),
    }
  }

  _handleSearch(t) {
    const { assets } = this.props;
    const cleanQuery = t && t.toLowerCase() || null;

    if (!cleanQuery) {
      this.setState({
        searchQuery: '',
        dataSource: this.state.dataSource.cloneWithRows(assets)
      })
    } else {
      const filteredAssets = filter(assets, o => includes(get(o, 'name', '').toLowerCase(), cleanQuery));

      this.setState({
        searchQuery: t,
        dataSource: this.state.dataSource.cloneWithRows(filteredAssets)
      });
    }
  }

  componentWillReceiveProps( nextProps ) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows( nextProps.assets )
    });
  }

  render() {
    const {
      isVisible,
      toggleModal,
      handleSelectAsset,
      selectedAsset,
      assets,
      isDisableCreate
    } = this.props;

    const { searchQuery } = this.state;
    const cleanQuery = searchQuery.toLowerCase();
    const selectedAssetId = get(selectedAsset, '_id', null);
    const isExisting = !!find(assets, asset => cleanQuery === asset.name.toLowerCase());

    return (
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={isVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.container}>
          <ModalHeader onPress={toggleModal}>Select Asset</ModalHeader>
          <View>
            <TextInput
              style={styles.textField}
              onChangeText={(t) => { this._handleSearch(t) }}
              value={searchQuery}
              multiline={false}
              placeholder={I18n.t('base.ubiquitous.search-assets')} />
          </View>

          <View style={styles.listView}>
            <ListView
              dataSource={this.state.dataSource}
              renderRow={(rowData, sId, rId) => <AssetSelectRow asset={rowData} onPress={handleSelectAsset} index={rId} isSelected={rowData._id === selectedAssetId} />}
              enableEmptySections={true}
              renderFooter={() => isExisting ? null : isDisableCreate ? null : <AssetSelectRow isCreate={true} searchQuery={searchQuery} onPress={handleSelectAsset} index={0} />}
            />
          </View>


          <View style={styles.btnContainer}>
            <Button style={{ backgroundColor: '#81BC3F', height: 50, borderColor: '#81BC3F' }} onPress={toggleModal}>
              <Text>Close</Text>
            </Button>
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {

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
    color: '#000',
    borderWidth: 1,
    borderRadius: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 14,
    margin: 20
  },
  listView: {
    height: Dimensions.get('window').height - 130
  },
  btnContainer: {
    height: 100
  }
});

AssetSelectModal.defaultProps = {
  isVisible: false
};

export default AssetSelectModal;
