import React from 'react';
import { View, TouchableOpacity, FlatList, Image, Text, Dimensions, StyleSheet } from 'react-native';
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
import { KeyboardAwareView } from 'react-native-keyboard-aware-view'
import {
    ExtraBackgroundContainer,
    ExtraPhotoCaptureBackground,
    ExtraPhotoCaptureContainer,
    ExtraPhotoCaptureButton,
    ExtraPhotoCapturedImage,
    ExtraExitContainer,
    RecordButtonOuterContainer,
    RecordButtonInnerContainer,
    RecordButtonStopInnerContainer
} from 'rc-mobile-base/lib/layouts/LostFound/styles';
import { RNCamera } from 'react-native-camera';
import Entypo from 'react-native-vector-icons/Entypo';
import Modal from 'react-native-modal';

const { width, height } = Dimensions.get('window');

export default class SelectedAssets extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isAssetsTypeImage: true,
            assetsHolder: [],
            isFromGallery: null,
        }
    }

    onTakePicture = async (assetsType) => {
        const { assetsHolder, isAssetsTypeImage } = this.state;

        const ImageResponse = await ImagePicker.launchCamera(assetsType);
        const assetsPayload = ImageResponse.map(item => {
            return {
                assetsId: uniqueId(),
                assetsPath: item.uri,
                assetsType: assetsType
            }
        })
        this.setState({ isFromGallery: false, assetsHolder: [...assetsHolder, ...assetsPayload] })
    }

    onTakeGallery = async (assetsType) => {
        const { assetsHolder, isAssetsTypeImage } = this.state;

        const ImageResponse = await ImagePicker.launchLibrary(assetsType);
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


    _handleTakePicture = async () => {

        const { assetsHolder } = this.state
        const options = {
            fixOrientation: false,
            quality: .5,
            width: 960
        };

        if ((this.camera.status || this.camera.getStatus()) !== 'READY') {
            console.log('Camera not valid');
            return;
        }

        const photoId = moment().format('X');
        await this.camera.takePictureAsync(options).then(data => {
            const photoPath = data.uri;

            if (photoPath) {
                this.setState({
                    isFromGallery: false, assetsHolder: [...assetsHolder, {
                        assetsId: uniqueId(),
                        assetsPath: photoPath,
                        assetsType: 'photo'
                    }]
                })
                this.props.onTakeImages(false)
                // this.props.setPhoto(photoPath, photoId);
                // this._handleSubmitPhoto()
            }
        })
            .catch(err => {
                console.log(err);
            });

    }

    render() {
        const { assetsHolder, isAssetsTypeImage } = this.state;
        const { onNext, isCaptureImage, onTakeImages } = this.props;

        if (isCaptureImage) {
            return (
                <>
                    <Modal isVisible={isCaptureImage} style={{ flexGrow: 1, borderRadius: 12, margin: 0 }}>
                        <View style={{ flex: 1, justifyContent: "space-around" }}>
                            <ExtraBackgroundContainer>
                                <RNCamera
                                    ref={(cam) => {
                                        this.camera = cam;
                                    }}
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    type={RNCamera.Constants.Type.back}
                                />
                                <ExtraPhotoCaptureBackground />

                                <ExtraPhotoCaptureContainer>
                                    <ExtraPhotoCaptureButton onPress={this._handleTakePicture}>
                                        <Entypo name="camera" size={36} color="white" />
                                    </ExtraPhotoCaptureButton>
                                </ExtraPhotoCaptureContainer>

                                <ExtraExitContainer onPress={() => onTakeImages(false)} >
                                    <Entypo name="cross" size={24} color="black" />
                                </ExtraExitContainer>
                            </ExtraBackgroundContainer>
                        </View>
                    </Modal>
                </>
            )
        }

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
                            <View style={styles.assetsActionButtonWrapper}>
                                <TaskButton
                                    buttonStyle={{ borderStyle: 'dashed' }}
                                    label={I18n.t('base.ubiquitous.take-picture')}
                                    onPress={() => onTakeImages(true)} />
                            </View>

                            <View style={styles.assetsActionButtonWrapper}>
                                <TaskButton
                                    buttonStyle={{ borderStyle: 'dashed' }}
                                    label={I18n.t('base.ubiquitous.take-video')}
                                    onPress={() => this.onTakePicture('video')}
                                />
                            </View>
                        </View>

                        <View style={styles.buttonContainer}>
                            <View style={styles.assetsActionButtonWrapper}>
                                <TaskButton
                                    buttonStyle={{ borderStyle: 'dashed' }}
                                    label={"+" + I18n.t('base.ubiquitous.add-more-photo')}
                                    onPress={() => this.onTakeGallery('photo')}
                                />
                            </View>

                            <View style={styles.assetsActionButtonWrapper}>
                                <TaskButton
                                    buttonStyle={{ borderStyle: 'dashed' }}
                                    label={"+" + I18n.t('base.ubiquitous.add-more-video')}
                                    onPress={() => this.onTakeGallery('video')}
                                />
                            </View>
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
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity style={styles.imagePlaceHolder} activeOpacity={0.7} onPress={() => onTakeImages(true)}>
                            <Image source={require('../../../images/createTask/bi_camera.png')} style={styles.placeHolderImage} />
                        </TouchableOpacity>
                    </View>


                    <View style={styles.bottomContainer}>
                        <View style={styles.buttonContainer}>
                            <View style={styles.assetsActionButtonWrapper}>
                                <TaskButton
                                    label={I18n.t('base.ubiquitous.take-picture')}
                                    onPress={() => onTakeImages(true)}
                                />
                            </View>

                            <View style={styles.assetsActionButtonWrapper}>
                                <TaskButton
                                    label={I18n.t('base.ubiquitous.take-video')}
                                    onPress={() => this.onTakePicture('video')}
                                />
                            </View>
                        </View>

                        <View style={styles.buttonContainer}>
                            <View style={styles.assetsActionButtonWrapper}>
                                <TaskButton
                                    label={I18n.t('base.ubiquitous.picture-gallery')}
                                    onPress={() => this.onTakeGallery('photo')}
                                />
                            </View>

                            <View style={styles.assetsActionButtonWrapper}>
                                <TaskButton
                                    label={I18n.t('base.ubiquitous.video-gallery')}
                                    onPress={() => this.onTakeGallery('video')}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            )
        }

    }
}