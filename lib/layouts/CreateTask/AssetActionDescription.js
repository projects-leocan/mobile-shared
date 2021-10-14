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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Button from 'rc-mobile-base/lib/components/Button';
import Icon from 'react-native-vector-icons/FontAwesome';
import I18n from 'react-native-i18n'

import { get, extend } from 'lodash/object';
import { pull } from 'lodash/array';
import { includes, find, filter } from 'lodash/collection';

import SectionHeader from './SectionHeader';
import AssetSelectModal from './AssetSelectModal';
import SelectLocation from './SelectLocation';
import Models from './Models';
import ModalHeader from 'rc-mobile-base/lib/components/ModalHeader';

import {
  grey,
  slate,
  greyDk,
  margin,
  white,
  padding,
  flx1,
  aic,
  jcc
} from 'rc-mobile-base/lib/styles';

import {
  WarningModal,
  WarningModalContainer,
  WarningContainer,
  WarningMessage
} from './styles';

const { width, height } = Dimensions.get('window')

class AssetActionDescription extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSelectAssets: false,
      isAssetWarning: false,
    }
  }

  componentDidUpdate(prevProps) {
    const { selectedAsset } = this.props;
    const roomTasks = get(this.props, 'room.roomTasks') || [];
    const { selectedAsset: prevSelectedAsset } = prevProps;

    if (!prevSelectedAsset && selectedAsset) {
      const existingAssetTasks = roomTasks
        .map(task => get(task, 'meta.durable_asset_id') || get(task, 'meta.virtual_asset_id') || get(task, 'meta.asset_id'))
        .filter(Boolean);
      const selectedId = get(selectedAsset, '_id');
      
      if (existingAssetTasks.includes(selectedId)) {
        this.setState({ isAssetWarning: true });
      }
    }
  }

  _renderLocation() {
    const { locations, room } = this.props;

    if (room) {
      return (
        <View>
          <SectionHeader value={ I18n.t('base.components.assetactiondescription.location') } />
          <View style={[styles.roomContainer, grey.bg]}>
            <Text style={styles.btnText}>{ room.name }</Text>
          </View>
        </View>
      )
    }

    if (locations && locations.length) {
      return (
        <View>
          <SelectLocation locations={this.props.locations} />
        </View>
      )
    }

    return null;
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

  _renderSelectAsset() {
    const { selectedAsset, createdAsset } = this.props;
    const displayText = selectedAsset ? selectedAsset.name : createdAsset ? createdAsset : I18n.t('base.components.assetactiondescription.select-asset');

    return (
      <View>
        <SectionHeader value={I18n.t('base.components.assetactiondescription.asset')} />
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
    const { selectedAsset, createdAsset, handleSelectModel, selectedModel } = this.props;
    
    if (!selectedAsset || !selectedAsset.models || !selectedAsset.models.length) {
      return null;
    }

    const models = selectedAsset.models.map(model => extend({}, model, { isSelected: selectedModel && model._id === selectedModel._id }));

    return (
      <View>
        <SectionHeader value={I18n.t('maintenance.asset.index.models')} />
        <Models
          show={true}
          style={{ borderColor: null, borderWidth: null }}
          value={models}
          onPress={handleSelectModel}
          />
      </View>
    );
  }

  _renderSublocations() {
    const { selectedModel, room, selectedLocations, sublocations, selectedSublocation, handleSelectSublocation } = this.props;
    // console.log(selectedLocations, selectedModel, sublocations)

    if (!selectedModel) {
      return null;
    }
    
    if (!room && !get(selectedLocations, 'locations', []).length === 1) {
      return null;
    }

    const roomId = room && get(room, '_id') || get(selectedLocations, ['locations', 0, '_id']) || null;
    if (!roomId) {
      return null;
    }
    
    const availableSublocations = filter(sublocations, { model_id: selectedModel._id, room_id: roomId })
      .map(sublocation => extend({}, sublocation, { isSelected: selectedSublocation && selectedSublocation.id === sublocation.id }));

    
    const buttons = availableSublocations.map(sublocation => {
      return (
        <TouchableOpacity key={sublocation.id} style={[styles.actionBtn, sublocation.isSelected ? styles.selectedActionbtn : null]} onPress={() => handleSelectSublocation(sublocation)}>
          <Text style={styles.actionBtnLabel}>{ `${sublocation.sublocation}`.toUpperCase() }</Text>
        </TouchableOpacity>
      )
    });

    return (
      <View>
        <SectionHeader value={'Sublocations'} />
        <View style={styles.actionContainer}>
          { buttons }
        </View>
      </View>
    )
  }

  _renderSelectAction() {
    const { customActions, selectedAsset, createdAsset, selectedAction, handleSelectAction } = this.props;
    let availableOptions = [];

    if (selectedAsset) {
      get(selectedAsset, 'customActions', []).forEach(action => {
        if (get(selectedAction, 'id', null) === get(action, 'id', null)) {
          action = extend({}, action, { isSelected: true });
        }

        availableOptions.push(action);
      });
    }

    const buttons = availableOptions.map(action => {
      return (
        <TouchableOpacity key={action.id} style={[styles.actionBtn, action.isSelected ? styles.selectedActionbtn : null]} onPress={() => handleSelectAction(action)}>
          <Text style={styles.actionBtnLabel}>{ `${action.label}`.toUpperCase() }</Text>
        </TouchableOpacity>
      )
    })

    let rendered;
    if (createdAsset) {
      rendered = <Text style={styles.actionError}>{ I18n.t('maintenance.createtask.assetactiondescription.no-actions-for-created-asset') }</Text>;
    } else if (!selectedAsset) {
      rendered = <Text style={styles.actionError}>{ I18n.t('maintenance.createtask.assetactiondescription.you-must-first-select-an-asset') }</Text>;
    } else if (!buttons || !buttons.length) {
      rendered = <Text style={styles.actionError}>{ I18n.t('maintenance.createtask.assetactiondescription.there-are-no-actions-for-your-asset') }</Text>;
    } else {
      rendered = buttons;
    }

    return (
      <View>
        <SectionHeader value={I18n.t('base.components.assetactiondescription.action')} />
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
        <SectionHeader value={I18n.t('base.components.assetactiondescription.description')} />
        <TextInput
          style={styles.textArea}
          onChangeText={handleUpdateDesc}
          onFocus={() => this.scroll && this.scroll.scrollToPosition(0, 160)}
          value={desc}
          multiline={true}
          maxLength={200}
          placeholderTextColor="#ccc"
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
        <SectionHeader value={I18n.t('base.components.assetactiondescription.priority')} />
        <View style={styles.priorityContainer}>
          <TouchableOpacity style={[styles.priorityBtn, isPriority ? { backgroundColor: '#3CC86B' } : null]} onPress={() => handleUpdatePriority(true)}>
            <Text style={styles.bigBtnText}>{ I18n.t('maintenance.createtask.assetactiondescription.yes') }</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.priorityBtn, isPriority ? null : { backgroundColor: '#C93C46' }]} onPress={() => handleUpdatePriority(false)}>
            <Text style={styles.bigBtnText}>{ I18n.t('maintenance.createtask.assetactiondescription.no') }</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    const { assets, selectedAsset, desc, isPriority, handleSelectAsset, isDisableLiteTasks, handleUpdateDesc, handleUpdatePriority, handleContinue, handleSubmit, label, style } = this.props;

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
      <View style={{ flex: 1 }}>
        {/* <ScrollView style={[styles.container, style]}>
          { this._renderLocation() }
          { this._renderSelectAsset() }
          { this._renderModels() }
          { this._renderSublocations() }
          { this._renderSelectAction() }
          { this._renderDesc() }
          { this._renderPriority() }
        </ScrollView> */}

        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          extraScrollHeight={120}
          scrollEnabled={true}
          ref={ref => {
            this.scroll = ref
          }}
          >
          { this._renderLocation() }
          { this._renderSelectAsset() }
          { this._renderModels() }
          {/* { this._renderSublocations() } */}
          { this._renderSelectAction() }
          { this._renderDesc() }
          { this._renderPriority() }
        </KeyboardAwareScrollView>

        { handleSubmit ?
          <Button style={{ height: 50, backgroundColor: '#3CC86B', borderRadius: 0 }} onPress={handleSubmit}>
            <Text style={styles.bigBtnText}>{ I18n.t(`maintenance.createtask.assetactiondescription.submit-${label || 'maintenance'}`).toUpperCase() }</Text>
          </Button>
          : null
        }

        { handleContinue ?
          <Button style={{ height: 50, backgroundColor: '#3CC86B', borderRadius: 0 }} onPress={handleContinue}>
            <Text style={styles.bigBtnText}>{ `Continue`.toUpperCase() }</Text>
          </Button>
          : null
        }

        <AssetSelectModal
          isVisible={this.state.isSelectAssets}
          toggleModal={this._handleToggleAssets.bind(this)}
          selectedAsset={selectedAsset}
          assets={updatedAssets}
          handleSelectAsset={this._handleSelectAsset.bind(this)}
          isDisableLiteTasks={isDisableLiteTasks}
          />

        <WarningModal
          position={"center"}
          backdropPressToClose={true}
          swipeToClose={false}
          backdropColor={'#4a4a4a'}
          onClosed={() => this.setState({ isAssetWarning: false })}
          isOpen={this.state.isAssetWarning}>
          <WarningModalContainer>
            <ModalHeader
              value="Similar Task Warning"
              onPress={() => this.setState({ isAssetWarning: false })}
              />

            <WarningContainer>
              <WarningMessage>
                At least one task with this asset exists for the selected location(s).
              </WarningMessage>
            </WarningContainer>
          </WarningModalContainer>
        </WarningModal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
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
    color: '#000',
    // borderWidth: 1,
    borderRadius: 2,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5,
    // marginBottom: 15,
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
    borderRadius: 0,
    backgroundColor: 'white'
  },
  modelsContainer: {
    height: 200,
    ...white.bg
  },
  roomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...padding.x15,
    ...padding.y10,
    // marginBottom: 15,
    borderRadius: 0,
    ...white.bg
  },
  roomText: {
    ...slate.text
  }
});

export default AssetActionDescription;
