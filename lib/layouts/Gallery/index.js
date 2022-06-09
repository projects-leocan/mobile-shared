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
  ItemLabelDesc
} from './styles';

import { isEmpty, get, map } from 'lodash';
import PagerView from 'react-native-pager-view';
import FastImage from 'react-native-fast-image';
import {
  PagerTabIndicator,
  IndicatorViewPager,
  PagerTitleIndicator,
  PagerDotIndicator,
} from '@shankarmorwal/rn-viewpager';
import ImageViewer from 'rc-mobile-base/lib/components/ImageViewer';
import request from 'rc-mobile-base/lib/utils/request';
import { connect } from 'react-redux';
import { tokenSelector, hotelGroupKeySelector, apiSelector } from 'rc-mobile-base/lib/selectors/auth';

const ROOM_CATALOGS_API = `/RoomCatalog/GetListOfRoomCatalogImages`;

class GalleryLayout extends Component {
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

  getRoomCatalog = async () => {
    const { token, hotel_group_key, baseUrl } = this.props;
    const roomId = this.props.navigation.state.params.roomId

    const headers = {
      Authorization: `Bearer ${token}`,
      hotel_group_key: hotel_group_key,
      'Content-Type': 'application/json'
    };

    const url = `${baseUrl}${ROOM_CATALOGS_API}`
    const options = {
      method: 'POST',
      body: JSON.stringify({
        roomId: roomId
      })
    }

    const catalogList = await request(url, {
      ...options,
      headers,
    });

    if (!isEmpty(catalogList)) {
      this.setState({ catalogHolder: catalogList })
    }

  }

  renderViewPagerPage = (data, index) => {
    const imageUrl = get(data, 'annotatedImageUrl', null);

    return (
      <PageContainer key={index.toString()} activeOpacity={1} onPress={() => this.toggleTaskImageModal()}>
        <HeaderImages source={{ uri: imageUrl }} resizeMode={FastImage.resizeMode.contain} />
      </PageContainer>
    );
  };

  stepFromPagination = async (position) => {
    const { currentIndex } = this.state;
    const currentPageIndex = get(this, 'pagerRef.current._currentIndex', 0);
    if (currentIndex !== currentPageIndex) {
      this.setState({ currentIndex: currentPageIndex })
    }
  }

  toggleTaskImageModal = () => {
    const { isShowImageViewer } = this.state;
    this.setState({ isShowImageViewer: !isShowImageViewer });
  }

  renderAnnotationDescription = (item, index) => {
    const ordinalNumber = get(item, 'ordinalNumber', null);
    const description = get(item, 'description', null);

    return (
      <InformationContainer>
        <ItemLabel>OrdinalNumber: {ordinalNumber}</ItemLabel>
        <ItemLabelDesc>Description: {description}</ItemLabelDesc>
      </InformationContainer>
    )
  }

  render() {
    const { catalogHolder, currentIndex, isShowImageViewer } = this.state;
    const pageCount = get(catalogHolder, 'length');
    const currentPageDescription = get(catalogHolder[currentIndex], 'annotations', []);

    return (
      <SafeAreaContainer>
        <RootContainer>
          <HeaderImageSliderContainer>
            <IndicatorViewPager
              ref={this.pagerRef}
              style={styles.pagerStyle}
              indicator={
                <PagerDotIndicator pageCount={pageCount} />
              }
              onPageScrollStateChanged={(e) => this.stepFromPagination(e)}
            >
              {catalogHolder.map((page, index) => this.renderViewPagerPage(page, index))}
            </IndicatorViewPager>
          </HeaderImageSliderContainer>

          <ImageViewer
            isVisible={isShowImageViewer}
            initialIndex={currentIndex}
            images={map(catalogHolder, function (obj) { return { url: get(obj, 'annotatedImageUrl', null) } })}
            toggleTaskImageModal={this.toggleTaskImageModal}
          />

          <ImageDescriptionContainer>
            <DescriptionFlatList
              data={currentPageDescription}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => this.renderAnnotationDescription(item, index)}
            />
          </ImageDescriptionContainer>

        </RootContainer>
      </SafeAreaContainer>
    )
  }
}

const mapStateToProps = (state, props) => {
  const roomId = props.navigation.state.params.roomId

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

export default connect(mapStateToProps, mapDispatchToProps)(GalleryLayout);