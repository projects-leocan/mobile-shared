import React from 'react';
import { View, TouchableOpacity, FlatList, Image, Dimensions, SafeAreaView, Alert, Platform } from 'react-native';
import styles from './styles'
import TaskButton from '../TaskButton';
import ImagePicker from 'rc-mobile-base/lib/utils/ImagePicker';
import { get, uniqueId } from 'lodash';
import I18n from 'react-native-i18n';
import moment from 'moment';
import { stat } from 'react-native-fs';
import RNFetchBlob from "rn-fetch-blob"
import {  VideoPlayContainer, VideoPlayTouchable } from "rc-mobile-base/lib/layouts/TaskDetail/styles"
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


import Ionicons from 'react-native-vector-icons/Ionicons';
import { themeTomato, white } from 'rc-mobile-base/lib/styles';
import {
    ExtraBackgroundContainer,
    ExtraPhotoCaptureBackground,
    ExtraPhotoCaptureContainer,
    ExtraPhotoCaptureButton,
    ExtraExitContainer,
} from 'rc-mobile-base/lib/layouts/LostFound/styles';
import { RNCamera } from 'react-native-camera';
import Entypo from 'react-native-vector-icons/Entypo';
import Modal from 'react-native-modal';
import Permissions from 'rc-mobile-base/lib/utils/Permissions';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { createThumbnail } from "react-native-create-thumbnail";

export default class SelectedAssets extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isAssetsTypeImage: true,
            assetsHolder: [],
            isFromGallery: null,
            isStartRecoeding: false
        }
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     // if (nextProps.currentPage === 0) {
    //     //     return true
    //     // }
    //     // else {
    //     //     return false
    //     // }
    // }

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

    generateThumbnailFromVideo = async (videoData) => {
        const data = await createThumbnail({
            url: videoData.assetsPath,
            timeStamp: 10000,
        })
            .then((response) => { return response?.path })
            .catch((err) => { return '' })
        return data
    }
    onTakeGallery = async (assetsType) => {
        try {
            const { assetsHolder, isAssetsTypeImage } = this.state;

            const ImageResponse = await ImagePicker.launchLibrary(assetsType);
            let assetsPayload = ImageResponse.filter((item) => {
                return (
                    (item?.fileSize / (1024 * 1024)).toFixed(2) <= 50
                )
            }).map((item) => {
                return (
                    {
                        assetsId: uniqueId(),
                        assetsPath: item.uri,
                        assetsType: assetsType,
                    }
                )
            })

            if (ImageResponse.length !== assetsPayload.length) {
                Alert.alert("video size must be less than 50MB")
            }

            const promises = assetsPayload.map(async (a) => {
                return {
                    ...a,
                    path: await this.generateThumbnailFromVideo(a)
                }
            })
            assetsPayload = await Promise.all(promises)

            this.setState({ isFromGallery: true, assetsHolder: [...assetsHolder, ...assetsPayload] })
        }
        catch (err) {
        }
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

                {
                    item?.assetsType === "video" ?
                        <>
                            <Image source={{ uri: item?.path }} style={styles.cellImage} />
                            <VideoPlayContainer>
                                <VideoPlayTouchable>
                                    <MaterialIcons name='play-circle-outline' size={30} color={white.color} />
                                </VideoPlayTouchable>
                            </VideoPlayContainer>
                        </>
                        : <Image source={{ uri: item.assetsPath }} style={styles.cellImage} />
                }

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


    handleTakeVideo = async () => {
        const { assetsHolder } = this.state
        this.setState({ isStartRecoeding: true })
        const { uri, codec = "mp4" } = await this.videoCamara.recordAsync();
        this.setState({ isStartRecoeding: true })
        this.setState({ isCaptureVideo: false })
        const statResult = await RNFetchBlob.fs.stat(uri);
        if ((statResult.size / (1024 * 1024)).toFixed(2) > 50) {
            Alert.alert("video size must be less than 50MB")
            return this.setState({
                isFromGallery: false,
            })
        }
        const photoPath = await this.generateThumbnailFromVideo({ assetsPath: uri })

        this.setState({
            isFromGallery: false, assetsHolder: [...assetsHolder, {
                assetsId: uniqueId(),
                assetsPath: uri,
                assetsType: "video",
                path: photoPath
            }]
        })
    }




    onTakeVideo = async (data) => {
        const value = await Permissions.requestPermissions('camera');
        if (value === "granted") {
            this.setState({ isCaptureVideo: data })
            this.setState({ isStartRecoeding: false })
        }
    }

    stopRecording = async (data) => {
        this.videoCamara.stopRecording();
    }

    render() {
        const { assetsHolder, isAssetsTypeImage, isCaptureVideo, isStartRecoeding } = this.state;
        const { onNext, isCaptureImage, onTakeImages } = this.props;

        if (isCaptureImage) {
            return (
                <>
                    <Modal isVisible={isCaptureImage} style={{ flexGrow: 1, borderRadius: 12, margin: 0 }}>
                        <SafeAreaView style={{ backgroundColor: "black" }} />
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
                                    useNativeZoom={true}
                                    flashMode={RNCamera.Constants.FlashMode.auto}
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

        if (isCaptureVideo) {
            return (
                <>
                    <Modal isVisible={isCaptureVideo} style={{ flexGrow: 1, borderRadius: 12, margin: 0 }}>
                        <SafeAreaView style={{ backgroundColor: "black" }} />
                        <View style={{ flex: 1, justifyContent: "space-around" }}>
                            <ExtraBackgroundContainer>
                                <RNCamera
                                    ref={(cam) => {
                                        this.videoCamara = cam;
                                    }}
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    type={RNCamera.Constants.Type.back}
                                    useNativeZoom={true}
                                />
                                <ExtraPhotoCaptureBackground />

                                <ExtraPhotoCaptureContainer>
                                    <ExtraPhotoCaptureButton onPress={isStartRecoeding ? this.stopRecording : this.handleTakeVideo}>
                                        {isStartRecoeding ? <MaterialCommunityIcons name="stop-circle-outline" size={50} color="white" /> : <Ionicons name="videocam-sharp" size={36} color="white" />}
                                    </ExtraPhotoCaptureButton>
                                </ExtraPhotoCaptureContainer>

                                <ExtraExitContainer onPress={() => this.onTakeVideo(false)} >
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
                                    onPress={() => this.onTakeVideo(true)}
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
                            label={I18n.t('base.ubiquitous.task-next')}
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
                                    onPress={() => this.onTakeVideo(true)}
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