import ModalHeader from 'rc-mobile-base/lib/layouts/CreateTask/SelectLocationModal/ModalHeader';
import SafeAreaHeader from "rc-mobile-base/lib/components/SafeAreaHeader";
import {
    flxRow,
    margin,
    padding,
    aic,
    white,
    jcsb,
    flx1,
    splashBg,
    lightBlueBorder,
} from "rc-mobile-base/lib/styles";
import React, { useState } from "react"
import { SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View, Text } from "react-native";
import Modal from "react-native-modal";
import I18n from "react-native-i18n";
import Icon from 'react-native-vector-icons/Feather';
import IconCross from 'react-native-vector-icons/Entypo';
import stylesLocation from 'rc-mobile-base/lib/layouts/CreateTask/SelectLocationModal/styles';

import SelectLocation from 'rc-mobile-base/lib/components/SelectLocation';
import { filter } from 'lodash';

const buttonBorderColor = '#cfd4de';

function SelectLocationModal({ isLocationModalOpen, closeLocaitonModal, options, getSelectedLocation, setLocation }) {

    const [searchQuery, setSearchQuery] = useState("")
    const [locationOption, setLocationOption] = useState(options)
    const [searchData, setSearchData] = useState(options)

    const onCloseModal = () => {
        closeLocaitonModal()
    }

    const onConfirmLocation = () => {
        setLocation(locationOption)
        closeLocaitonModal()
    }

    const onResetLocation = () => {
        const finalSelectedObject = locationOption.map((loc) => {
            return {
                ...loc,
                isSelected: false
            }
        })
        setLocationOption(finalSelectedObject)
    }

    const _handleSearch = (t) => {
        const cleanQuery = t && t.toLowerCase() || null;
        if (!cleanQuery) {
            setSearchQuery('')
            // setSearchData()
        } else {
            setSearchQuery(t)
        }
    }

    const setSelectedData = (data, isSelected) => {
        const finalSelectedObject = locationOption.map((loc) => {
            return {
                ...loc,
                isSelected: loc.id === data.id ? !loc.isSelected : loc.isSelected
            }
        })

        setLocationOption(finalSelectedObject)
    }

    const onPressRemoveLocation = (item) => {
        const finalSelectedObject = locationOption.map((loc) => {
            return {
                ...loc,
                isSelected: loc.id === item.id ? !loc.isSelected : loc.isSelected
            }
        })
        setLocationOption(finalSelectedObject)
    }

    const Location = ({ input }) => (
        input.isSelected ?

            <TouchableOpacity
                key={input.id}
                style={[flxRow, white.bg, aic, jcsb, margin.a5, padding.x5, { height: 35, minWidth: 35, borderRadius: 5, borderWidth: 1, borderColor: lightBlueBorder.color }]}
                onPress={() => onPressRemoveLocation(input)}
            >
                <Text style={[splashBg.text, margin.x5, { fontWeight: '600' }]}>
                    {input.name}
                </Text>
                <IconCross
                    style={[margin.x5]}
                    name="cross"
                    size={18}
                    color={splashBg.color}
                />
            </TouchableOpacity>
            : null
    )



    const filteredOption = filter(locationOption, ['isTemporaryRoom', false]);

    const regex = new RegExp(searchQuery, 'i')
    const filteredFinalOption = filteredOption.filter(location => location.name.match(regex))

    return (
        <>
            <Modal
                style={{ margin: 0 }}
                animationType={"slide"}
                transparent={true}
                visible={isLocationModalOpen}
                onRequestClose={() => null}
            >
                {Platform.OS === 'ios' ? <SafeAreaHeader /> : null}
                <SafeAreaView style={[flx1]}>
                    <ModalHeader value={I18n.t('base.ubiquitous.locations')}
                        isExtraButton={true}
                        onPress={() => { }}
                        onExtraAction={() => onResetLocation()}
                        onLeftAction={() => onCloseModal()}
                        onRightAction={() => onConfirmLocation()}
                    />
                    <View style={[flx1, { backgroundColor: "#fff" }]}>
                        <View style={styles.searchSection}>
                            <View style={styles.searchIconContainer}>
                                <Icon
                                    name='search'
                                    size={30}
                                    color={splashBg.color}
                                />
                            </View>

                            <TextInput
                                style={styles.searchFieldContainer}
                                onChangeText={(t) => { _handleSearch(t) }}
                                value={searchQuery}
                                multiline={false}
                                placeholder={I18n.t('base.ubiquitous.search-locations')} />
                        </View>
                        {
                            locationOption.some((l) => l.isSelected) &&
                            <TouchableOpacity style={[stylesLocation.selctedPreviewContainer]} >
                                <View style={[stylesLocation.selectionPlaceholderContainer, flx1]}>
                                    <View style={[flxRow, { flexWrap: 'wrap' }]}>
                                        {locationOption.map((loc) => {
                                            return (
                                                <React.Fragment key={loc.id}>
                                                    <Location
                                                        input={loc}
                                                    />
                                                </React.Fragment>
                                            )
                                        })}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        }


                        <SelectLocation
                            options={filteredFinalOption}
                            onPress={(data, isSelected) => setSelectedData(data, isSelected)}
                        />

                    </View>

                </SafeAreaView>
            </Modal>
        </>
    )
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
        width: 'auto',
        borderColor: '#DDDDDD',
        borderWidth: 1,
        borderRadius: 2,
        fontSize: 14,
    },
    listView: {
        flex: 1
    },
    searchSection: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginVertical: 10,
        marginHorizontal: 18,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: buttonBorderColor
    },
    searchIconContainer: {
        width: 50,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    searchFieldContainer: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 0,
    },
});

export default SelectLocationModal