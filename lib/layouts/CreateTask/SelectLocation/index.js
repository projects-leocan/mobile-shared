import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import styles from './styles';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { splashBg } from 'rc-mobile-base/lib/styles';
import SelectLocationModal from 'rc-mobile-base/lib/layouts/CreateTask/SelectLocationModal';
import I18n from "react-native-i18n";
import AssetSelectModal from "./AssetSelectModal";

export default class SelectLocation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSelectAssets: false,
  selectedAsset: null,

    }
  }

  _renderLocation() {
    const { locations, room } = this.props.taskProps;

    if (room) {
      return (
        <View>
          <SectionHeader
            value={I18n.t("base.components.assetactiondescription.location")}
          />
          <View style={[styles.roomContainer, grey.bg]}>
            <Text style={styles.btnText}>
              {room.name}
            </Text>
          </View>
        </View>
      );
    }

    if (locations && locations.length) {
      return (
        <View>
          <SelectLocationModal locations={locations} />
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

  _renderSelectAsset() {
    const { selectedAsset, createdAsset } = this.props;
    const displayText = selectedAsset
      ? selectedAsset.name
      : createdAsset
        ? createdAsset
        : I18n.t("base.components.assetactiondescription.select-asset");

    return (
      // <View>
      //   <SectionHeader
      //     value={I18n.t("base.components.assetactiondescription.asset")}
      //   />
      //   <Button
      //     style={styles.assetBtn}
      //     onPress={this._handleToggleAssets.bind(this)}
      //   >
      //     <Text style={styles.btnText}>
      //       {displayText}
      //     </Text>
      //     <Icon name="chevron-down" size={11} color="#4a4a4a" />
      //   </Button>
      // </View>

      <View style={styles.sectionContainer}>
      <Text style={styles.sectionLabel}>Asset</Text>
      <TouchableOpacity style={styles.sectionButton} onPress={() => this._handleToggleAssets()}>
        <View style={styles.selectionPlaceholderContainer}>
          <Text style={styles.selectionPlaceholder}>Select asset</Text>
        </View>
        <View style={styles.sectionButtonRightContainer}>
          <MaterialIcons name='chevron-right' size={26} color={splashBg.color} />
        </View>
      </TouchableOpacity>
    </View>
    );
  }

  render() {
    const { isSelectAssets, selectedAsset } = this.state;
    return (
      <View style={styles.rootContainer}>
        {/* <View style={styles.addRoomSection}>
                    <TouchableOpacity style={styles.addRoomRoundContainer} activeOpacity={0.7} >
                        <Ionicons name='add' size={wp('7%')} color={splashBg.color} />
                    </TouchableOpacity>
                    <Text style={styles.addRoomLabel}>Add Room</Text>
                </View> */}
        {this._renderLocation()}
        {this._renderSelectAsset()}

        <AssetSelectModal
          isVisible={isSelectAssets}
          toggleModal={() => this._handleToggleAssets()}
          selectedAsset={selectedAsset}
          assets={updatedAssets}
          handleSelectAsset={() => this._handleToggleAssets()}
          isDisableLiteTasks={isDisableLiteTasks}
        />
      
      </View>
    )
  }
}