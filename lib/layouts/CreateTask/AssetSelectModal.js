import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  ScrollView,
  FlatList,
  Dimensions,
  Modal,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import I18n from 'react-native-i18n';
import Button from 'rc-mobile-base/lib/components/Button';
import { filter, find, includes } from 'lodash/collection';
import { get } from 'lodash/object';
import ListView from "deprecated-react-native-listview";

import ModalHeader from 'rc-mobile-base/lib/components/ModalHeader';

import {
  flx1,
} from 'rc-mobile-base/lib/styles';

import AssetSelectRow from './AssetSelectRow';

class AssetSelectModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: '',
    }
  }

  _handleSearch(t) {
    const cleanQuery = t && t.toLowerCase() || null;

    if (!cleanQuery) {
      this.setState({ searchQuery: '', });
    } else {
      this.setState({ searchQuery: t, });
    }
  }

  render() {
    const {
      isVisible,
      toggleModal,
      handleSelectAsset,
      selectedAsset,
      assets,
      isDisableLiteTasks
    } = this.props;

    const { searchQuery } = this.state;
    const cleanQuery = searchQuery.toLowerCase();
    const selectedAssetId = get(selectedAsset, '_id', null);
    
    const filteredAssets = filter(assets, o => includes(get(o, 'name', '').toLowerCase(), cleanQuery));
    const isExisting = !!find(assets, asset => cleanQuery === asset.name.toLowerCase());

    return (
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={isVisible}
        onRequestClose={() => null}
      >
        <View style={[flx1]}>
          <ModalHeader value={I18n.t('maintenance.createtask.assetselectmodal.select-asset')} onPress={toggleModal}/>
          <View>
            <TextInput
              style={styles.textField}
              onChangeText={(t) => { this._handleSearch(t) }}
              value={searchQuery}
              multiline={false}
              placeholderTextColor="#ccc"
              placeholder={I18n.t('maintenance.createtask.assetselectmodal.search-assets')} />
          </View>

          <View style={[flx1]}>
            {/* <ListView
              dataSource={this.state.dataSource}
              renderRow={(rowData, sId, rId) => <AssetSelectRow asset={rowData} onPress={handleSelectAsset} index={rId} isSelected={rowData._id === selectedAssetId} />}
              enableEmptySections={true}
              renderFooter={() => isExisting ? null : <AssetSelectRow isCreate={true} searchQuery={searchQuery} onPress={handleSelectAsset} index={0} />}
            /> */}
            <FlatList
              data={filteredAssets}
              keyExtractor={(item) => `${item._id}:${item.name}`}
              renderItem={({ item, index }) => <AssetSelectRow asset={item} onPress={handleSelectAsset} index={index} isSelected={item._id === selectedAssetId} />}
              ListFooterComponent={() => isExisting ? null : !isDisableLiteTasks && !!searchQuery && searchQuery.length ? <AssetSelectRow isCreate={true} searchQuery={searchQuery} onPress={handleSelectAsset} index={0} /> : null}
              />
          </View>


          {/* <View style={styles.btnContainer}>
            <Button style={{ backgroundColor: '#81BC3F', height: 50, borderColor: '#81BC3F' }} onPress={toggleModal}>
              <Text>{I18n.t('base.ubiquitous.close')}</Text>
            </Button>
          </View> */}
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    ...flx1,
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
    flex: 1
  },
  btnContainer: {
    // height: 100
  }
});

AssetSelectModal.defaultProps = {
  isVisible: false
};

export default AssetSelectModal;
