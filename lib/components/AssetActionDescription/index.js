import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  StyleSheet
} from 'react-native';
import I18n from 'react-native-i18n';

import Button from 'rc-mobile-base/lib/components/Button';
import Icon from 'react-native-vector-icons/FontAwesome';

import { get, extend } from 'lodash/object';
import { pull } from 'lodash/array';
import { includes, find } from 'lodash/collection';

import SectionHeading from '../section-heading';
import AssetSelectModal from '../AssetSelectModal';
import SelectLocation from './SelectLocation';

import {
  grey,
  slate,
  greyDk,
  margin,
  white,
  padding
} from 'rc-mobile-base/lib/styles';

class AssetActionDescription extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSelectAssets: false,
    }
  }

  _handleToggleAssets() {
    this.setState({
      isSelectAssets: !this.state.isSelectAssets,
    });
  }

  _handleSelectAsset() {
    const { handleSelectAsset } = this.props;
    this.setState({ isSelectAssets: false });
    handleSelectAsset(...arguments);
  }

  _renderLocation() {
    const { locations, room } = this.props;

    if (room) {
      return (
        <View>
          <SectionHeading style={{ paddingLeft: 15 }}>{ I18n.t('base.components.assetactiondescription.location') }</SectionHeading>
          <View style={[styles.roomContainer, grey.bg]}>
            <Text style={styles.btnText}>{ room.name }</Text>
          </View>
        </View>
      )
    }

    if (locations && locations.length) {
      return (
        <View style={[margin.b15]}>
          <SelectLocation locations={this.props.locations} />
        </View>
      )
    }

    return null;
  }

  _renderSelectAsset() {
    const { selectedAsset, createdAsset } = this.props;
    const displayText = selectedAsset ? selectedAsset.name : createdAsset ? createdAsset : `${I18n.t('base.components.assetactiondescription.select-asset')}`;

    return (
      <View>
        <SectionHeading style={{ paddingLeft: 15 }}>{ I18n.t('base.components.assetactiondescription.asset') }</SectionHeading>
        <Button style={styles.assetBtn} onPress={this._handleToggleAssets.bind(this)}>
          <Text style={styles.btnText}>
            { displayText }
          </Text>
          <Icon name="chevron-down" size={11} color="#4a4a4a" />
        </Button>
      </View>
    );
  }

  _renderModels() {
    const { selectedAsset, createdAsset } = this.props;
    // console.log(selectedAsset)
    
    if (!selectedAsset) {
      return null;
    }

    return (
      <View>
        <SectionHeading style={{ paddingLeft: 15 }}>{ I18n.t('maintenance.asset.index.models') }</SectionHeading>
        <View style={styles.modelsContainer}>

        </View>
      </View>
    );
  }

  _renderSelectAction() {
    const { customActions, selectedAsset, createdAsset, selectedAction, handleSelectAction } = this.props;

    if (!selectedAsset) {
      return [];
    }

    const availableOptions = get(selectedAsset, 'customActions', []).map(action => {
      return extend({}, action, { isSelected: get(action, 'id') === get(selectedAction, 'id') });
    });

    const buttons = availableOptions.map(action => {
      return (
        <TouchableOpacity key={action.id} style={[styles.actionBtn, action.isSelected ? styles.selectedActionbtn : null]} onPress={() => handleSelectAction(action)}>
          <Text style={styles.actionBtnLabel}>{ `${action.label}`.toUpperCase() }</Text>
        </TouchableOpacity>
      )
    })

    let rendered;
    if (createdAsset) {
      rendered = <Text style={styles.actionError}>{ I18n.t('base.components.assetactiondescription.no-actions') }</Text>;
    } else if (!selectedAsset) {
      rendered = <Text style={styles.actionError}>{ I18n.t('base.components.assetactiondescription.first-select') }</Text>;
    } else if (!buttons || !buttons.length) {
      rendered = <Text style={styles.actionError}>{ I18n.t('base.components.assetactiondescription.no-available') }</Text>;
    } else {
      rendered = buttons;
    }

    return (
      <View>
        <SectionHeading style={{ paddingLeft: 15 }}>{ I18n.t('base.components.assetactiondescription.action') }</SectionHeading>
        <View style={styles.actionContainer}>
          { rendered }
        </View>
      </View>
    )
  }

  _renderDesc() {
    const { desc, handleUpdateDesc } = this.props;

    return (
      <View>
        <SectionHeading style={{paddingLeft: 15}}>{ I18n.t('base.components.assetactiondescription.description') }</SectionHeading>
        <TextInput
          style={styles.textArea}
          onChangeText={handleUpdateDesc}
          value={desc}
          multiline={true}
          maxLength={200}
          placeholder={I18n.t('base.components.assetactiondescription.description-placeholder')} />
      </View>
    )
  }

  _renderPriority() {
    const { isShowPriority, isPriority, handleUpdatePriority} = this.props;

    if (!isShowPriority) {
      return null;
    }

    return (
      <View>
        <SectionHeading style={{paddingLeft: 15}}>{ I18n.t('base.components.assetactiondescription.priority') }</SectionHeading>
        <View style={styles.priorityContainer}>
          <TouchableOpacity style={[styles.priorityBtn, isPriority ? { backgroundColor: '#3CC86B' } : null]} onPress={() => handleUpdatePriority(true)}>
            <Text style={styles.bigBtnText}>{ I18n.t('base.components.assetactiondescription.yes') }</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.priorityBtn, isPriority ? null : { backgroundColor: '#C93C46' }]} onPress={() => handleUpdatePriority(false)}>
            <Text style={styles.bigBtnText}>{ I18n.t('base.components.assetactiondescription.no') }</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    const { assets, selectedAsset, desc, isPriority, handleSelectAsset, handleUpdateDesc, handleUpdatePriority, handleContinue, handleSubmit, style } = this.props;

    let updatedAssets = assets;
    if (selectedAsset && selectedAsset._id) {
      updatedAssets = assets.map(asset => {
        if (selectedAsset._id === asset._id) {
          return extend({}, asset, { isSelected: true });
        }
        return asset;
      });
    }
    return (
      <View style={[styles.container, style]}>
        <ScrollView>
          { this._renderLocation() }
          { this._renderSelectAsset() }
          { this._renderSelectAction() }
          { this._renderDesc() }
          { this._renderPriority() }
        </ScrollView>

        { handleSubmit ?
          <Button style={{ height: 50, backgroundColor: '#3CC86B', borderRadius: 5 }} onPress={handleSubmit}>
            <Text style={styles.bigBtnText}>{ I18n.t('base.components.assetactiondescription.submit-maintenance').toUpperCase() }</Text>
          </Button>
          : null
        }

        { handleContinue ?
          <Button style={{ height: 50, backgroundColor: '#3CC86B', borderRadius: 5 }} onPress={handleContinue}>
            <Text style={styles.bigBtnText}>{ I18n.t('base.components.assetactiondescription.continue').toUpperCase() }</Text>
          </Button>
          : null
        }

        <AssetSelectModal
          isVisible={this.state.isSelectAssets}
          toggleModal={this._handleToggleAssets.bind(this)}
          selectedAsset={selectedAsset}
          assets={updatedAssets}
          handleSelectAsset={this._handleSelectAsset.bind(this)}
          />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingLeft: 4,
    paddingRight: 4,
    paddingBottom: 4,
    backgroundColor: '#F7F7F7'
  },
  btnText: {
    fontWeight: '500',
    color: "#4a4a4a",
    marginRight: 5
  },
  actionContainer: {
    backgroundColor: 'white',
    // minHeight: 56,
    marginBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 6,
    paddingBottom: 2,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  actionBtn: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: '#AFAFAF',
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
    height: 44
  },
  actionBtnLabel: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600'
  },
  selectedActionbtn: {
    backgroundColor: '#C93C46'
  },
  textArea: {
    height: 80,
    // borderColor: '#DDDDDD',
    backgroundColor: 'white',
    // borderWidth: 1,
    borderRadius: 2,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 15,
    marginTop: 0,
    fontSize: 14
  },
  priorityContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 4,
    paddingBottom: 4,
    marginBottom: 15
  },
  priorityBtn: {
    width: 80,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#AFAFAF',
    marginRight: 5
  },
  spacer: {
    flex: 1
  },
  bigBtnText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '500'
  },
  actionError: {
    color: '#4a4a4a',
    fontWeight: '500',
    paddingTop: 8,
    paddingBottom: 8
  },
  assetBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 15,
    borderRadius: 0,
    backgroundColor: 'white'
  },
  roomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...padding.x15,
    ...padding.y10,
    marginBottom: 15,
    borderRadius: 0,
    ...white.bg
  },
  roomText: {
    ...slate.text
  }
});

export default AssetActionDescription;
