import React from 'react';
import { View, TouchableOpacity, Image, Text, TextInput, ScrollView, Alert } from 'react-native';
import styles from './styles';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SelectLocationModal from 'rc-mobile-base/lib/layouts/CreateTask/SelectLocationModal';
import I18n from "react-native-i18n";
import AssetSelectModal from "./AssetSelectModal";
import { filter, flatten, get, includes, intersection, map, uniq, difference } from 'lodash';

import {
  flxRow,
  flxCol,
  margin,
  padding,
  text,
  aic,
  jcc,
  white,
  slate,
  greyDk,
  grey400,
  red,
  blue500,
  blue300,
  blue100,
  green,
  jcsb,
  flex1,
  flx1,
  flexGrow1,
  grey,
  splashBg,
  themeBorderColor,
  lightBlueBorder,
  themeTomato
} from 'rc-mobile-base/lib/styles';
import TaskButton from '../TaskButton';
import { SafeAreaView } from 'react-native-safe-area-context';

export default class SelectLocation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSelectAssets: false,
      selectedAsset: null,
      updatedAssets: [],
      updatedAction: [],
      selectedAction: [],
      desc: ''
    }
  }

  componentDidMount() {
    this.setInitialAssets();
  }

  setInitialAssets = () => {
    const { assets } = this.props;

    const updatedAssets = assets.map(item => {
      return {
        ...item,
        isSelected: false
      }
    });
    this.setState({ updatedAssets: [...updatedAssets] })
  }

  _renderLocation() {
    const { locations, room } = this.props;

    if (locations && locations.length) {
      return (
        <View>
          <SelectLocationModal locations={locations} currentRoom={room} />
        </View>
      );
    }

    return null;
  }

  _handleToggleAssets() {
    this.setState({
      isSelectAssets: !this.state.isSelectAssets,
    });
  }

  _onCacelAssetsSelection = () => {
    this.setInitialAssets();
    this.setState({
      isSelectAssets: !this.state.isSelectAssets,
      selectedAction: []
    });
  }

  _handleSelectedAssets(asset) {
    const { updatedAssets, selectedAction } = this.state;
    const mapAssestAction = map(get(asset, 'customActions', []), 'id');
    const updateSelectionAction = difference(selectedAction, intersection(mapAssestAction, selectedAction));

    this.setState(prevState => ({
      updatedAssets: prevState.updatedAssets.map(
        (el, elIndex) => el === asset ? { ...el, isSelected: !el.isSelected } : { ...el }
      ),
      selectedAction: updateSelectionAction
    }), () => {
      this.getSelectedActions();
    });
  }

  _renderSelectAsset() {
    const { createdAsset, customActions } = this.props;
    const { updatedAssets } = this.state;
    const selectedAsset = filter(updatedAssets, ['isSelected', true]);


    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionLabel}>{I18n.t('base.ubiquitous.task-asset')}</Text>
        <TouchableOpacity style={styles.sectionButton} onPress={() => this._handleToggleAssets()}>
          <View style={styles.selectionPlaceholderContainer}>
            {get(selectedAsset, 'length') > 0
              ?
              <View style={[flxRow, { flexWrap: 'wrap' }]}>
                {selectedAsset.map(item => {
                  return (
                    <TouchableOpacity
                      style={styles.assetsSelectionCell}
                      onPress={() => this._handleSelectedAssets(item)}
                    >
                      <Text style={[splashBg.text, margin.x5, { fontWeight: '600' }]}>
                        {item.name}
                      </Text>
                      <Icon
                        style={[margin.x5]}
                        name="cross"
                        size={18}
                        color={splashBg.color}
                      />
                    </TouchableOpacity>
                  )
                })}
              </View>
              :
              <Text style={styles.selectionPlaceholder}>{I18n.t("base.components.assetactiondescription.select-asset")}</Text>
            }
          </View>
          <View style={styles.sectionButtonRightContainer}>
            <MaterialIcons name='chevron-right' size={26} color={splashBg.color} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  getSelectedActions = () => {
    const { selectedAction } = this.state;
    const { customActions, handleDefaultAssignee } = this.props;

    const filterSelected = filter(customActions, function (obj) { return includes(selectedAction, get(obj, 'id', null)) });
    const mapDefaultAssignee = map(filterSelected, function (obj) {
      return {
        defaultAssignedToUserGroupId: obj.defaultAssignedToUserGroupId,
        defaultAssignedToUserId: obj.defaultAssignedToUserId,
        defaultAssignedToUserSubGroupId: obj.defaultAssignedToUserSubGroupId,
      }
    })

    handleDefaultAssignee(mapDefaultAssignee);
    return;
  }

  handleSelectAction = (actionId) => {
    const { selectedAction } = this.state;
    if (includes(selectedAction, actionId)) {
      const updateSelectionAction = selectedAction.filter(item => item !== actionId);
      this.setState({ selectedAction: updateSelectionAction }, () => {
        this.getSelectedActions();
      })
    } else {
      this.setState({ selectedAction: uniq([...selectedAction, actionId]) }, () => {
        this.getSelectedActions();
      })
    }
  }

  _renderSelectAction() {
    const { customActions } = this.props;
    const { updatedAssets, selectedAction } = this.state;

    const selectedAsset = filter(updatedAssets, ['isSelected', true]);

    let validateFilterAction = []
    if (get(selectedAsset, 'length') > 0) {
      const filterAction = selectedAsset.map(item => {
        const assetGroupId = get(item, 'assetGroupId', null);

        return filter(customActions, function (obj) {
          return obj.assetGroupId === assetGroupId
        })
      })

      if (get(filterAction, 'length') > 0) {
        validateFilterAction = flatten(filterAction);
      }
    }

    if (validateFilterAction.length > 0) {
      return (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>{I18n.t("base.components.assetactiondescription.action")}</Text>
          <View style={[styles.actionSectionContainer]}>
            {validateFilterAction.map(action => {
              return (
                <TouchableOpacity
                  key={action.id}
                  style={[
                    styles.actionBtn,
                    includes(selectedAction, get(action, 'id', null)) ? styles.selectedActionbtn : null,
                  ]}
                  onPress={() => this.handleSelectAction(action.id)}
                >
                  <Text style={[styles.actionBtnLabel, {
                    color: includes(selectedAction, get(action, 'id', null)) ? 'white' : splashBg.color
                  }]}>
                    {`${action.name}`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )
    }
  }

  _renderDesc() {
    const { desc } = this.state;

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionLabel}>{I18n.t("base.components.assetactiondescription.description")}</Text>
        <View style={styles.textAreaContainer} >
          <TextInput
            style={styles.textArea}
            textAlignVertical="top"
            onChangeText={(input) => this.setState({ desc: input })}
            onFocus={() =>
              this.scroll && this.scroll.scrollTo(0, 160)
            }
            value={desc}
            underlineColorAndroid="transparent"
            placeholder="Type here"
            placeholderTextColor="grey"
            numberOfLines={5}
            multiline={true}
          />
        </View>

      </View>
    );
  }

  onNextPage = () => {
    const { onNext, selectedLocations } = this.props;
    const { updatedAssets, selectedAction } = this.state;

    const validateAssets = filter(updatedAssets, ['isSelected', true]);

    if (!selectedLocations) {
      Alert.alert(I18n.t('base.ubiquitous.alert'),I18n.t('maintenance.task.create-task-alert.select-location'));
      return true;
    } else if (get(validateAssets, 'length') <= 0) {
      Alert.alert(I18n.t('base.ubiquitous.alert'),I18n.t('maintenance.task.create-task-alert.select-asset'));
      return true;
    } else if (get(selectedAction, 'length') <= 0) {
      Alert.alert(I18n.t('base.ubiquitous.alert'),I18n.t('maintenance.task.create-task-alert.select-asset-action'))
      return true;
    }

    onNext();
  }

  render() {
    const { isSelectAssets, selectedAsset, updatedAssets, selectedAction } = this.state;
    const { assets, isDisableLiteTasks, customActions } = this.props;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.rootContainer}>
          <View style={styles.bodySection}>
            <ScrollView style={{ flex: 1 }} ref={ref => this.scroll = ref} showsVerticalScrollIndicator={false} >
              <KeyboardAwareScrollView enableOnAndroid={true} extraHeight={130} contentContainerStyle={{ flexGrow: 1 }} extraScrollHeight={130}>
                {this._renderLocation()}
                {this._renderSelectAsset()}
                {this._renderSelectAction()}
                {this._renderDesc()}
              </KeyboardAwareScrollView>

              <AssetSelectModal
                isVisible={isSelectAssets}
                toggleModal={() => this._handleToggleAssets()}
                onCancelSelection={() => this._onCacelAssetsSelection()}
                selectedAsset={selectedAsset}
                selectedAction={selectedAction}
                assets={updatedAssets}
                customActions={customActions}
                handleSelectAsset={(asset) => this._handleSelectedAssets(asset)}
                handleSelectAction={this.handleSelectAction}
                isDisableLiteTasks={isDisableLiteTasks}
              />
            </ScrollView>
          </View>

          <View style={styles.footerSection} >
            <TaskButton
              label={I18n.t('base.ubiquitous.task-next')}
              buttonStyle={{ backgroundColor: themeTomato.color, borderWidth: 0 }}
              labelStyle={{ color: '#FFF' }}
              onPress={() => this.onNextPage()}
            />
          </View>
        </View>
      </SafeAreaView>
    )
  }
}