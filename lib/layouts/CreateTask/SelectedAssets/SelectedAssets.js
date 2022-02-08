import React from 'react';
import { View, TouchableOpacity, FlatList, Image } from 'react-native';
import styles from './styles'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import TaskButton from '../TaskButton';
import ImagePicker from 'rc-mobile-base/lib/utils/ImagePicker';
import { get, uniqueId } from 'lodash';
import moment from 'moment';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { themeTomato } from 'rc-mobile-base/lib/styles';

export default class SelectedAssets extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            assetsHolder: [],
        }
    }

    onTakePicture = async () => {
        const ImageResponse = await ImagePicker.launchCamera('photo');
        console.log('--- onTakePicture ----');
        console.log(ImageResponse)
    }

    onTakeGallery = async () => {
        const { assetsHolder } = this.state;
        const ImageResponse = await ImagePicker.launchLibrary('photo');
        const assetsPayload = ImageResponse.map(item => {
            return {
                assetsId: uniqueId(),
                assetsPath: item.uri
            }
        })
        this.setState({ assetsHolder: [...assetsHolder, ...assetsPayload] })
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

    render() {
        const { assetsHolder } = this.state;
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
                                onPress={() => this.onTakeGallery()}
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
                    <View style={styles.topContainer}>
                        <TouchableOpacity style={styles.imagePlaceHolder} activeOpacity={0.7}>
                            <SimpleLineIcons name="camera" size={wp('14%')} color="#cccccc" />
                        </TouchableOpacity>
                    </View>


                    <View style={styles.bottomContainer}>
                        <View style={styles.buttonContainer}>
                            <TaskButton
                                label="Take Picture"
                                onPress={() => this.onTakePicture()}
                            />
                        </View>

                        <TaskButton
                            label="Choose from gallery"
                            onPress={() => this.onTakeGallery()}
                        />
                    </View>
                </View>
            )
        }

    }
}