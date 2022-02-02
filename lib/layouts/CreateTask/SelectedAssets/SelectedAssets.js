import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import styles from './styles'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import TaskButton from '../TaskButton';
import ImagePicker from 'rc-mobile-base/lib/utils/ImagePicker';
import { get } from 'lodash';

export default class SelectedAssets extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            imageHolder: []
        }
    }

    onTakePicture = async () => {
        const ImageResponse = await ImagePicker.launchCamera('photo');
        console.log('--- onTakePicture ----');
        console.log(ImageResponse)
    }

    onTakeGallery = async () => {
        const { imageHolder } = this.state;
        const ImageResponse = await ImagePicker.launchLibrary('photo');
        console.log('--- onTakeGallery ----');
        console.log(ImageResponse);
        this.setState({ imageHolder: [ ...imageHolder, ...ImageResponse] })
    }

    render() {
        const { imageHolder } = this.state;
        if(get(imageHolder, 'length') > 0) {
            return(
                <View style={styles.rootContainer}>
                    </View>
            )
        } else {
            return (
                <View style={styles.rootContainer}>
                    <TouchableOpacity style={styles.imagePlaceHolder} activeOpacity={0.7}>
                        <SimpleLineIcons name="camera" size={wp('14%')} color="#cccccc" />
                    </TouchableOpacity>
    
                    <View style={styles.buttonHolderContainer}>
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