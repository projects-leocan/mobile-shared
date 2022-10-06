import React, { Component, createRef } from 'react';
import {
    styles,
    SafeAreaContainer,
    RootContainer,
    PageContainer,
    HeaderImageSliderContainer,
    HeaderImages,
    ImageDescriptionContainer,
    DescriptionFlatList,
    InformationContainer,
    ItemLabel,
    ItemLabelDesc,
    PagerBottomContainer,
    PagerBottomInnerContainer
} from './styles';

import { TouchableOpacity, Image, FlatList, View } from 'react-native';
import { isEmpty, get, map } from 'lodash';
import PagerView from 'react-native-pager-view';
import Dots from 'react-native-dots-pagination';
import FastImage from 'react-native-fast-image';
import ImageViewer from 'rc-mobile-base/lib/components/ImageViewer';
import { connect } from 'react-redux';
import { tokenSelector, hotelGroupKeySelector, apiSelector } from 'rc-mobile-base/lib/selectors/auth';
import {
    blue, center
} from 'rc-mobile-base/lib/styles';

class GalleryGrid extends Component {
    constructor(props) {
        super(props);

        this.pagerRef = createRef()

        this.state = {
            catalogHolder: [],
            currentIndex: 0,
            isShowImageViewer: false
        }

    }

    componentDidMount() {
        this.getRoomCatalog()
    }

    componentDidUpdate(prevProps, prevState) {
        const { catalogHolder } = this.state;
        let catalogList = get(this, 'props.navigation.state.params.catalogHolder', [])
        if (!isEmpty(catalogHolder)) {
            if (isEmpty(catalogList)) {
                catalogList = get(this, 'props.catalogHolder', []);
            }

            if (catalogHolder != catalogList) {
                this.setState({ catalogHolder: catalogList })
            }
        }
    }

    getRoomCatalog = async () => {
        let catalogList = get(this, 'props.navigation.state.params.catalogHolder', [])
        if (isEmpty(catalogList)) {
            catalogList = get(this, 'props.catalogHolder', []);
        }
        if (!isEmpty(catalogList)) {
            this.setState({ catalogHolder: catalogList })
        }

    }

    handleNavigation = (item, index) => {
        const { catalogHolder } = this.state;
        let roomId = get(this, 'props.navigation.state.params.roomId', null);
        this.props.navigation.navigate('Gallery', { roomId, catalogHolder: catalogHolder, imageIndex: index });
    }

    render() {
        const { catalogHolder, currentIndex, isShowImageViewer } = this.state;
        const pageCount = get(catalogHolder, 'length');
        const currentPageDescription = get(catalogHolder[currentIndex], 'annotations', []);

        if (pageCount > 0) {
            return (
                <RootContainer>
                    <FlatList
                        data={catalogHolder}
                        renderItem={({ item, index }) => (
                            <View style={{ flex: 1, alignSelf: 'center' }}>
                                <TouchableOpacity style={styles.imageView} onPress={() => this.handleNavigation(item, index)}>
                                    <Image
                                        style={styles.imageThumbnail}
                                        source={{ uri: get(item, 'annotatedImageUrl', null) }}

                                    />
                                </TouchableOpacity>
                            </View>

                        )}
                        numColumns={3}
                        keyExtractor={(item, index) => index}
                    />

                </RootContainer>
            )
        } else {
            return null
        }

    }
}

const mapStateToProps = (state, props) => {
    return {
        token: tokenSelector(state),
        hotel_group_key: hotelGroupKeySelector(state),
        baseUrl: apiSelector(state)
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(GalleryGrid);