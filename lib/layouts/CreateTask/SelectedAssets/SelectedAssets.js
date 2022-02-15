import React from 'react';
import { View, TouchableOpacity, FlatList, Image, Text } from 'react-native';
import styles from './styles'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import TaskButton from '../TaskButton';
import ImagePicker from 'rc-mobile-base/lib/utils/ImagePicker';
import { get, uniqueId } from 'lodash';
import I18n from 'react-native-i18n';
import moment from 'moment';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { themeTomato, lightPink, splashBg, } from 'rc-mobile-base/lib/styles';
import { v4 as uuidv4 } from 'uuid';
import ToggleSwitch from 'rn-toggle-switch'

export default class SelectedAssets extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isAssetsTypeImage: true,
            assetsHolder: [],
            isFromGallery: null
        }
    }

    onTakePicture = async () => {
        const { assetsHolder, isAssetsTypeImage } = this.state;

        const ImageResponse = await ImagePicker.launchCamera(isAssetsTypeImage ? 'photo' : 'video');
        const assetsPayload = ImageResponse.map(item => {
            return {
                assetsId: uniqueId(),
                assetsPath: item.uri
            }
        })
        this.setState({ isFromGallery: false, assetsHolder: [...assetsHolder, ...assetsPayload] })
    }

    onTakeGallery = async () => {
        const { assetsHolder, isAssetsTypeImage } = this.state;

        const ImageResponse = await ImagePicker.launchLibrary(isAssetsTypeImage ? 'photo' : 'video');
        const assetsPayload = ImageResponse.map(item => {
            return {
                assetsId: uniqueId(),
                assetsPath: item.uri
            }
        })
        this.setState({ isFromGallery: true, assetsHolder: [...assetsHolder, ...assetsPayload] })
    }

    onAddMore = () => {
        const { isFromGallery } = this.state;

        if (isFromGallery) {
            this.onTakeGallery()
        } else {
            this.onTakePicture()
        }
    }

    removeImage = (assetsId) => {
        const { assetsHolder } = this.state;
        const filteredImages = assetsHolder.filter(item => item.assetsId !== assetsId);
        this.setState({ assetsHolder: filteredImages })
    }

    renderAssets = (item, index) => {
        return (
            <View style={styles.assetsCell}>
                <View style={styles.closeCellContainer}>
                    <TouchableOpacity style={styles.closeCell} activeOpacity={0.7} onPress={() => this.removeImage(item.assetsId)}>
                        <Ionicons name='close' color={'#FFF'} size={22} />
                    </TouchableOpacity>
                </View>

                <Image source={{ uri: item.assetsPath }} style={styles.cellImage} />
            </View>
        )
    }

    _handleAssetsType = (value) => {
        this.setState({
            isAssetsTypeImage: value,
            assetsHolder: [],
            isFromGallery: null
        });
    }

    render() {
        const { assetsHolder, isAssetsTypeImage } = this.state;
        const { onNext } = this.props;

        if (get(assetsHolder, 'length') > 0) {
            return (
                <View style={styles.rootContainer}>
                    <View style={styles.topContainer}>
                        <FlatList
                            data={assetsHolder}
                            keyExtractor={(item, index) => index.toString()}
                            numColumns={3}
                            contentContainerStyle={styles.assetsListContainer}
                            renderItem={({ item, index }) => this.renderAssets(item, index)}
                        />
                    </View>

                    <View style={styles.bottomContainer}>
                        <View style={styles.buttonContainer}>
                            <TaskButton
                                buttonStyle={{ borderStyle: 'dashed' }}
                                label="+ Add More Photo"
                                onPress={() => this.onAddMore()}
                            />
                        </View>

                        <TaskButton
                            buttonStyle={{ backgroundColor: themeTomato.color, borderWidth: 0 }}
                            labelStyle={{ color: '#FFF' }}
                            label="Next"
                            onPress={() => onNext()}
                        />
                    </View>

                </View>
            )
        } else {
            return (
                <View style={styles.rootContainer}>
                    <View style={styles.screenContainer}>
                        <View style={[styles.assetTypeContainer]}>
                            <Text style={{ flex: 1 }}>assets Type {isAssetsTypeImage ? `Image` : `Video`}</Text>
                            <ToggleSwitch
                                text={{ on: I18n.t('base.ubiquitous.yes'), off: I18n.t('base.ubiquitous.yes'), activeTextColor: 'white', inactiveTextColor: splashBg.color }}
                                textStyle={{ fontWeight: 'bold' }}
                                color={{ indicator: 'white', active: themeTomato.color, inactive: lightPink.color, activeBorder: themeTomato.color, inactiveBorder: lightPink.color }}
                                active={isAssetsTypeImage}
                                disabled={false}
                                width={30}
                                radius={15}
                                onValueChange={this._handleAssetsType}
                            />
                        </View>

                        <View style={styles.topContainer}>
                            <TouchableOpacity style={styles.imagePlaceHolder} activeOpacity={0.7}>
                                <Image source={require('../../../images/createTask/bi_camera.png')} style={styles.placeHolderImage} />
                            </TouchableOpacity>
                        </View>


                        <View style={styles.bottomContainer}>
                            <View style={styles.buttonContainer}>
                                <TaskButton
                                    label={isAssetsTypeImage ? "Take Picture" : "Take Video"}
                                    onPress={() => this.onTakePicture()}
                                />
                            </View>

                            <TaskButton
                                label="Choose from gallery"
                                onPress={() => this.onTakeGallery()}
                            />
                        </View>
                    </View>
                </View>
            )
        }

    }
}