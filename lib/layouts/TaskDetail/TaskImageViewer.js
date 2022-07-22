import { get } from 'lodash';
import React from 'react';
import { SafeAreaView, View, TouchableOpacity } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from "react-native-modal";
import {
    SafeAreaContainer,
    RootView,
    HeaderIcon,
    TaskImageHeaderContainer,
    HeaderImageIndicator,
    CloseIconPositionContainer,
    CloseIconContainer
} from './styles'

export default class TaskImageViewer extends React.Component {
    constructor(props) {
        super(props);


    }

    loadHeader(currentIndex) {
        const { images, toggleTaskImageModal } = this.props;
        return (
            <TaskImageHeaderContainer>
                <HeaderImageIndicator>{currentIndex + 1} / {get(images, 'length')}</HeaderImageIndicator>
                <CloseIconPositionContainer>
                    <CloseIconContainer activeOpacity={0.7} onPress={toggleTaskImageModal} >
                        <HeaderIcon name='close' />
                    </CloseIconContainer>
                </CloseIconPositionContainer>
            </TaskImageHeaderContainer>
        )
    }

    render() {
        const { isVisible, images, initialIndex, toggleTaskImageModal } = this.props;
        return (
            <Modal isVisible={isVisible} swipeDirection={'down'} style={{ flex: 1, margin: 0 }} >
                <RootView>
                    <ImageViewer
                        imageUrls={images}
                        enableSwipeDown={true}
                        index={initialIndex}
                        renderIndicator={() => null}
                        onSwipeDown={toggleTaskImageModal}
                        renderHeader={currentIndex => this.loadHeader(currentIndex)}
                    />
                </RootView>
            </Modal>
        )
    }
}