import React from "react";
import { View, Text, TouchableOpacity, Dimensions, Image, Platform, ScrollView } from 'react-native';
import styles from './styles';
import Switch from 'rc-mobile-base/lib/components/Switch';
import I18n from 'react-native-i18n';
import { margin, jcsb, aic, grey } from 'rc-mobile-base/lib/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RNCamera } from 'react-native-camera';
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
import VideoComponent from 'rc-mobile-base/lib/components/VideoComponent';
import moment from 'moment';
import * as Colors from 'rc-mobile-base/lib/styles/colors';
import ToggleSwitch from 'rn-toggle-switch'

const { width, height } = Dimensions.get('window');
const initialAssets = { assetsId: 'add', assetsPath: '' }

export default class SelectedAssets extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isAssetsTypeImage: true,
            isShowCamera: false,
            isStartRecording: false,
            selectedVideoPath: null,
            assetsHolder: [initialAssets]
        }
    }

    toggleCamera = () => {
        const { toggleCamera } = this.props;
        const { isShowCamera } = this.state;
        this.setState({ isShowCamera: !isShowCamera })
        toggleCamera()
    }

    componentDidUpdate(prevProps, prevState) {
        const { assetsHolder } = this.state;
        const { assetsHolder: prevAssetsHolder } = prevState;

        if (prevAssetsHolder && prevAssetsHolder !== assetsHolder) {
            const { getAllAsset } = this.props;
            getAllAsset(assetsHolder.filter(item => item.assetsId !== 'add'))
        }

    }

    getAllAsset = () => {
        const { assetsHolder } = this.state;
        return assetsHolder.filter(item => item.assetsId !== 'add')
    }

    removeImage = (assetsId) => {
        const { assetsHolder } = this.state;
        const filteredImages = assetsHolder.filter(item => item.assetsId !== assetsId);
        this.setState({ assetsHolder: filteredImages })
    }

    renderVideoPath = (videoPath) => {
        const { isAssetsTypeImage } = this.state;
        if (!isAssetsTypeImage) {
            this.setState({ selectedVideoPath: videoPath })
        }
    }

    renderImageCell = () => {
        const { assetsHolder, isAssetsTypeImage } = this.state;
        return assetsHolder.map((item, index) => {
            if (item.assetsId === 'add') {
                return (
                    <View style={styles.imgItemCellContainer}>
                        <TouchableOpacity style={styles.addAssetsCircle} onPress={() => this.toggleCamera(isAssetsTypeImage)}>
                            <MaterialIcons name="add" size={wp('8%')} color="#900" />
                        </TouchableOpacity>
                        <Text style={styles.addAssetsText}>add {isAssetsTypeImage ? `Image` : `Video`}</Text>
                    </View>
                )
            } else {
                return (
                    <TouchableOpacity style={styles.imgItemCellContainer} activeOpacity={1} onPress={() => this.renderVideoPath(item.assetsPath)}  >
                        <View style={styles.cancelItemContainer}>
                            <TouchableOpacity style={styles.centerContainer} onPress={() => this.removeImage(item.assetsId)}>
                                <Ionicons name="close" size={30} color={Colors.red.color} style={{ alignSelf: 'center' }} />
                            </TouchableOpacity>
                        </View>
                        <Image
                            source={{ uri: item.assetsPath }}
                            style={styles.itemImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                )
            }
        })

    }

    _handleAssetsType = (value) => {
        this.setState({
            isAssetsTypeImage: value,
            isShowCamera: false,
            isStartRecording: false,
            selectedVideoPath: null,
            assetsHolder: [initialAssets]
        });
    }

    _handleTakePicture = async () => {
        const { assetsHolder } = this.state;
        const options = {
            fixOrientation: false,
            quality: .5,
            width: 960
        };

        if ((this.camera.status || this.camera.getStatus()) !== 'READY') {
            return;
        }

        const assetsId = moment().format('X');
        await this.camera.takePictureAsync(options).then(data => {
            const assetsPath = data.uri;

            if (assetsPath) {
                const assetsPayload = {
                    assetsId,
                    assetsPath
                }

                this.setState({ assetsHolder: [assetsPayload, ...assetsHolder] })
                this.toggleCamera();
            }
        })
            .catch(err => {
                console.log(err);
            });

    }

    handleStartTakeVideo = async camera => {
        this.setState({ isStartRecording: true })
        const options = {
            quality: RNCamera.Constants.VideoQuality['480p'],
            orientation: 'portrait',
            mirrorVideo: Platform.OS == 'ios',
            mute: false,
        };

        if ((camera.status || camera.getStatus()) !== "READY") {
            return;
        }
        const data = await camera.recordAsync(options);
        const assetsId = moment().format("X");

        const recodedPayload = {
            assetsId,
            assetsPath: data.uri
        }

        this.setState({ assetsHolder: [recodedPayload, initialAssets], isVideoRecorded: false, assetsId, recordPath: data.uri });

        // this.props.uploadPhoto(data.uri, photoId);
    };

    handleStopTakeVideo = async camera => {
        this.setState({ isStartRecording: false })
        const data = await camera.stopRecording();

        setTimeout(() => {
            this.toggleCamera()
            this.setState({ isVideoRecorded: true, isShowCamera: false })
        }, 500);

    }

    closeVideoPopUp = () => {
        this.setState({ selectedVideoPath: null })
    }

    handleNoPhoto = () => {
        const { noPhoto } = this.props;
        this.setState({ assetsHolder: [initialAssets]});
        noPhoto()
    }

    render() {
        const { isAssetsTypeImage, isShowCamera, isStartRecording, selectedVideoPath } = this.state;
        const { noPhoto } = this.props;

        if (selectedVideoPath) {
            return (
                <View style={styles.videoContainer}>
                    <VideoComponent
                        videoSource={selectedVideoPath}
                        isShowDone={false}
                        closeVideo={() => this.closeVideoPopUp()}
                        selectVideo={() => this.confirmSelectVideo()} />
                </View>
            )
        }

        if (isShowCamera) {
            return (
                <ExtraBackgroundContainer >
                    <RNCamera
                        ref={(cam) => {
                            this.camera = cam;
                        }}
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: height - 99,
                            width: width,
                            backgroundColor: '#f0f'
                        }}
                        type={RNCamera.Constants.Type.back}
                    // aspect={RNCamera.Constants.Aspect.fill}
                    />
                    <ExtraPhotoCaptureBackground />

                    <ExtraPhotoCaptureContainer>
                        {isAssetsTypeImage
                            ?
                            <ExtraPhotoCaptureButton onPress={this._handleTakePicture}>
                                <Entypo name="camera" size={36} color="white" />
                            </ExtraPhotoCaptureButton>
                            :
                            <View style={styles.recordButtonOuterContainer}>
                                {isStartRecording
                                    ?
                                    <RecordButtonStopInnerContainer onPress={() => this.handleStopTakeVideo(this.camera)} />
                                    :
                                    <RecordButtonInnerContainer onPress={() => this.handleStartTakeVideo(this.camera)} />
                                }
                            </View>
                        }
                    </ExtraPhotoCaptureContainer>

                    <ExtraExitContainer onPress={() => this.toggleCamera(isAssetsTypeImage)} >
                        <Entypo name="cross" size={24} color="black" />
                    </ExtraExitContainer>
                </ExtraBackgroundContainer>
            )
        }

        return (
            <View style={styles.rootContainer}>
                <View style={[grey.bc, jcsb, aic, margin.t10, margin.b10, styles.assetTypeContainer]}>
                    <Text>assets Type {isAssetsTypeImage ? `Image` : `Video`}</Text>
                    <ToggleSwitch
                        text={{ on: I18n.t('base.ubiquitous.yes'), off: I18n.t('base.ubiquitous.yes'), activeTextColor: 'white', inactiveTextColor: 'white' }}
                        textStyle={{ fontWeight: 'bold' }}
                        color={{ indicator: 'white', active: 'green', inactive: 'gray', activeBorder: 'green', inactiveBorder: 'gray' }}
                        active={isAssetsTypeImage}
                        disabled={false}
                        width={30}
                        radius={15}
                        onValueChange={this._handleAssetsType}
                    />
                </View>

                <View style={{ flexGrow: 1, height: '50%', width: '100%' }}>
                <ScrollView style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1 }} >
                    <View style={styles.imageListContainer}>
                        {this.renderImageCell()}
                    </View>
                </ScrollView>
                </View>

                <TouchableOpacity style={styles.passBtn} onPress={() => this.handleNoPhoto()}>
                    <Text style={styles.passBtnText}>{I18n.t('base.ubiquitous.continue-without-photo').toUpperCase()}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}