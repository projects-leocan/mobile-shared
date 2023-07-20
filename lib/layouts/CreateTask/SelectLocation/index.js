import React from 'react';
import { View, TouchableOpacity, Text, TextInput, Alert, Dimensions } from 'react-native';
import styles from './styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SelectLocationModal from 'rc-mobile-base/lib/layouts/CreateTask/SelectLocationModal/index';
import I18n from "react-native-i18n";
import AssetSelectModal from "./AssetSelectModal";
import { filter, flatten, get, includes, intersection, map, uniq, difference } from 'lodash';
import _ from 'lodash';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import {
  flxRow,
  margin,
  splashBg,
  themeTomato,
  white
} from 'rc-mobile-base/lib/styles';
import TaskButton from '../TaskButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import TimeSelectComponent from 'rc-mobile-base/lib/components/TimeSelectComponent/timeSelectComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class SelectLocation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSelectAssets: false,
      selectedAsset: null,
      updatedAssets: [],
      updatedAction: [],
      selectedAction: [],
      desc: '',
      isLocationModalOpen: false,
      isDateModal: false,
      selectedDate: moment(new Date()),
      selectedTime: { hr: moment(new Date()).format("HH"), min: moment(new Date()).format("mm") },
      doneCounter: false
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


  closeLocaitonModal = () => {
    this.setState({ isLocationModalOpen: false })
  }

  onPressRemoveLocation = (item) => {
    const { getSelectedLocation } = this.props
    const finalSelectedObject = getSelectedLocation.map((loc) => {
      return {
        ...loc,
        isSelected: loc.id === item.id ? !loc.isSelected : loc.isSelected
      }
    })
    this.props.setLocation(finalSelectedObject)
  }

  _renderLocation() {
    const { locations, room } = this.props;
    const { updatedAssets } = this.state;
    const { getSelectedLocation } = this.props

    if (locations && locations.length) {
      return (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>{I18n.t('base.ubiquitous.location')}</Text>
          <TouchableOpacity style={styles.sectionButton} onPress={() => this.setState({ isLocationModalOpen: true })}>
            <View style={styles.selectionPlaceholderContainer}>
              {getSelectedLocation.some((d) => d.isSelected)
                ?
                <View style={[flxRow, { flexWrap: 'wrap' }]}>
                  {getSelectedLocation.map(item => {
                    return (
                      item.isSelected &&
                      <TouchableOpacity
                        key={item.id}
                        style={styles.assetsSelectionCell}
                        onPress={() => this.onPressRemoveLocation(item)}
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
                <Text style={styles.selectionPlaceholder}>{I18n.t("base.ubiquitous.select-location")}</Text>
              }
            </View>
            <View style={styles.sectionButtonRightContainer}>
              <MaterialIcons name='chevron-right' size={26} color={splashBg.color} />
            </View>
          </TouchableOpacity>
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
        (el, elIndex) => el === asset ? { ...el, isSelected: !el.isSelected } : { ...el, isSelected: false }
      ),
      selectedAction: []
    }), () => {
      // this.getSelectedActions();
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.currentPage === 1) {
      return true
    }
    else {
      return false
    }
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
                      key={item.id}
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
    const { selectedAction, isSelectAssets } = this.state;

    if (includes(selectedAction, actionId)) {
      const updateSelectionAction = selectedAction.filter(item => item !== actionId);
      this.setState({ selectedAction: updateSelectionAction }, () => {
        this.getSelectedActions();
      })

    } else {
      this.setState({ selectedAction: uniq([actionId]) }, () => {
        this.getSelectedActions();
      })
      if (isSelectAssets) {
        this._handleToggleAssets()
      }
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

  selectDatePicker = () => {

    const { selectedDate, isDateModal } = this.state

    let customDatesStyles = [];
    customDatesStyles.push({
      date: selectedDate.clone(),
      style: { backgroundColor: '#1D2F58' },
      textStyle: { color: '#fff' },
      containerStyle: [],
      allowDisabled: true,
    })

    return (
      <View style={{
        borderWidth: 1,
        borderColor: '#cfd4de',
        height: 'auto',
      }}>
        <CalendarPicker
          style={{
            zIndex: 200, width: 20, shadowColor: '#171717',
            shadowOffset: { width: -2, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            borderWidth: 2
          }}
          defaultColor="#1D2F58"
          defaultBackgroundColor="#1D2F58"
          initialDate={selectedDate}
          minDate={new Date()}
          maxDate={moment().add(3, "months").startOf("day")}
          headerWrapperStyle={{ backgroundColor: "#1D2F58", color: "#fff" }}
          monthYearHeaderWrapperStyle={{ color: "#fff" }}
          monthTitleStyle={{
            color: '#fff',
          }}
          width={Dimensions.get("window").width - 40}
          yearTitleStyle={{
            color: '#fff',
          }}
          previousTitleStyle={{
            color: '#fff',
          }}
          nextTitleStyle={{
            color: '#fff',
          }}
          selectedDayColor="#1D2F58"
          selectedDayTextColor="#FFFFFF"
          onDateChange={this._handleSelectDate}
          customDatesStyles={customDatesStyles}

        />
      </View>
    )
  }

  renderDateTimeContainer() {
    const { isDateModal, isTimeModal, selectedTime } = this.state
    return (
      <>
        <View style={[styles.sectionContainer, { flexDirection: "row", justifyContent: "space-between" }]}>
          {this._renderDate()}
          {this._renderTime()}

        </View >
        {isDateModal &&
          this.selectDatePicker()
        }
        {
          isTimeModal &&
          <TimeSelectComponent
            selectedTime={selectedTime}
            onCloseModal={() => this.setState({ isTimeModal: false })}
            handleTImeCOnfirm={(key, value) => this.handleTImeCOnfirm(key, value)}
          />
        }
      </>
    )
  }

  _renderDate() {
    const { selectedDate, isDateModal } = this.state
    return (
      <View style={{ width: "60%" }}>
        <Text style={styles.sectionLabel}>{I18n.t("maintenance.createtask.assetactiondescription.date")}</Text>
        <TouchableOpacity style={[styles.sectionButton, { position: "relative" }]} onPress={() => this.setState({ isDateModal: !this.state.isDateModal, isTimeModal: false, doneCounter: false })}>
          <View style={styles.selectionPlaceholderContainer}>
            <Text style={styles.selectionPlaceholder}>{selectedDate.format("DD-MM-YYYY")}</Text>
          </View>
          <View style={styles.sectionButtonRightContainer}>
            <MaterialIcons name='chevron-right' size={26} color={splashBg.color} />
          </View>
        </TouchableOpacity>
      </View>

    );
  }

  _renderTime() {
    const { selectedDate, isTimeModal, selectedTime } = this.state

    let customDatesStyles = [];
    customDatesStyles.push({
      date: selectedDate.clone(),
      style: { backgroundColor: '#1D2F58' },
      textStyle: { color: '#fff' },
      containerStyle: [],
      allowDisabled: true,
    })

    return (
      <View style={{ width: "35%" }}>
        <Text style={styles.sectionLabel}>{I18n.t("inspector.history.historyheader.time")}</Text>
        <TouchableOpacity style={[styles.sectionButton]} onPress={() => this.setState({ isTimeModal: !isTimeModal, doneCounter: false, isDateModal: false })}>
          <View style={styles.selectionPlaceholderContainer}>
            <Text style={styles.selectionPlaceholder}>{selectedTime.hr}:{selectedTime.min}</Text>
          </View>
          {
            this.state.doneCounter ?
              <View style={styles.sectionButtonRightContainer}>
                <Ionicons
                  name="ios-checkmark"
                  size={30}
                  color={splashBg.color}
                />
              </View>
              :
              <View style={styles.sectionButtonRightContainer}>
                <MaterialIcons name='chevron-right' size={26} color={splashBg.color} />
              </View>
          }
        </TouchableOpacity>

        {/* <DateTimePickerModal
          isVisible={isTimeModal}
          mode="time"
          display='spinner'
          is24Hour={true}
          date={selectedTime}
          onConfirm={this.handleTImeCOnfirm}
          onCancel={() => { this.setState({ isTimeModal: false }) }}
        /> */}

      </View>

    );
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
    const validateLocation = selectedLocations.some((s) => s.isSelected)

    const validateAssets = filter(updatedAssets, ['isSelected', true]);

    if (!validateLocation) {
      Alert.alert(I18n.t('base.ubiquitous.alert'), I18n.t('maintenance.task.create-task-alert.select-location'));
      return true;
    } else if (get(validateAssets, 'length') <= 0) {
      Alert.alert(I18n.t('base.ubiquitous.alert'), I18n.t('maintenance.task.create-task-alert.select-asset'));
      return true;
    } else if (get(selectedAction, 'length') <= 0) {
      Alert.alert(I18n.t('base.ubiquitous.alert'), I18n.t('maintenance.task.create-task-alert.select-asset-action'))
      return true;
    }

    onNext();
  }


  getSelectedLocation = (selectedLocation) => {
    this.setState({ selectedLocation: selectedLocation })
  }

  _handleSelectDate = (date) => {
    this.setState({ selectedDate: date })
    this.props.getSelectedDateTime('date', date)
    this.setState({ isDateModal: false })
  }

  handleTImeCOnfirm = (key, time) => {
    const { selectedTime } = this.state
    let finalData = {}
    if (key === 'hour') {
      finalData = {
        ...selectedTime,
        hr: time
      }
    }
    else {
      finalData = {
        ...selectedTime,
        min: time
      }
    }
    this.setState({ doneCounter: true })
    // this.setState({ isTimeModal: false })
    this.props.getSelectedDateTime('time', finalData)
    this.setState({ selectedTime: finalData })
  }

  closeDateModal = () => {
    this.setState({ isDateModal: false })
  }
  render() {
    const { isSelectAssets, selectedAsset, updatedAssets, selectedAction, isLocationModalOpen, isDateModal } = this.state;
    const { assets, isDisableLiteTasks, customActions } = this.props;
    const { getSelectedLocation, locations, isMaintenanceApp } = this.props;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.rootContainer}>
          <View style={styles.bodySection}>
            <KeyboardAwareScrollView
              resetScrollToCoords={{ x: 0, y: 0 }}
              extraScrollHeight={120}
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ minHeight: '100%' }}
              enableOnAndroid={true}
            >
              <View style={{ flex: 1, justifyContent: "space-around" }}>
                {this._renderLocation()}
                {this._renderSelectAsset()}
                {this._renderSelectAction()}
                {isMaintenanceApp && this.renderDateTimeContainer()}
                {/* <View style={[styles.sectionContainer, { flexDirection: "row", justifyContent: "space-between" }]}>
                  {isMaintenanceApp && this._renderDate()}
                  {isMaintenanceApp && this._renderTime()}
                </View> */}
                {this._renderDesc()}
              </View>

              {
                isLocationModalOpen &&
                <SelectLocationModal
                  getSelectedLocation={this.getSelectedLocation}
                  options={_.isEmpty(getSelectedLocation) ? locations : getSelectedLocation}
                  isLocationModalOpen={isLocationModalOpen}
                  closeLocaitonModal={() => this.closeLocaitonModal()}
                  setLocation={this.props.setLocation}
                />
              }
              {isSelectAssets &&
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
              }
            </KeyboardAwareScrollView>
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