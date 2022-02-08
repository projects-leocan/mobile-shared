import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import styles from './styles';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { splashBg } from 'rc-mobile-base/lib/styles';
import SelectLocationModal from 'rc-mobile-base/lib/layouts/CreateTask/SelectLocationModal';

export default class SelectLocation extends React.Component {
    constructor(props) {
        super(props);
    }

    _renderLocation() {
        const { locations, room } = this.props.taskProps;
        console.log('---- _renderLocation ----');
        console.log(locations)
    
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

    render() {
        return (
            <View style={styles.rootContainer}>
                {/* <View style={styles.addRoomSection}>
                    <TouchableOpacity style={styles.addRoomRoundContainer} activeOpacity={0.7} >
                        <Ionicons name='add' size={wp('7%')} color={splashBg.color} />
                    </TouchableOpacity>
                    <Text style={styles.addRoomLabel}>Add Room</Text>
                </View> */}
                {this._renderLocation()}


                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionLabel}>Asset</Text>
                    <TouchableOpacity style={styles.sectionButton}>
                        <View style={styles.selectionPlaceholderContainer}>
                            <Text style={styles.selectionPlaceholder}>Select asset</Text>
                        </View>
                        <View style={styles.sectionButtonRightContainer}>
                            <MaterialIcons name='chevron-right' size={26} color={splashBg.color} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}