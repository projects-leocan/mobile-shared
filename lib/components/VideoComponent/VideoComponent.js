import React from 'react'
import { SafeAreaView, View, TouchableOpacity } from 'react-native'
import Video from 'react-native-af-video-player-updated'
import styles from 'rc-mobile-base/lib/components/VideoComponent/styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Colors from 'rc-mobile-base/lib/styles/colors';

const url = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'

export default class VideoComponent extends React.Component {

    render() {
        const { videoSource, closeVideo, selectVideo } = this.props;
        return (
            <View style={styles.safeAreaContainer}>
                <SafeAreaView style={styles.safeAreaContainer}>
                    <View style={styles.container}>
                        <View style={styles.actionHeaderContainer}>
                            <TouchableOpacity style={styles.actionItemContainer} onPress={() => closeVideo()}>
                                <Ionicons name="close" size={35} color={Colors.red.color} style={{ alignSelf: 'center' }} />
                            </TouchableOpacity>

                            <View style={{ flex: 1 }}></View>

                            <TouchableOpacity style={styles.actionItemContainer} onPress={() => selectVideo()}>
                                <Ionicons name="checkmark-sharp" size={35} color={Colors.white.color} style={{ alignSelf: 'center' }} />
                            </TouchableOpacity>
                        </View>
                        <Video
                            // url={videoSource}
                            url={require('./test.mp4')}
                            style={{ flex: 1, height: '100%', width: '100%' }}
                        />
                    </View>
                </SafeAreaView>

            </View>
        )
    }
}