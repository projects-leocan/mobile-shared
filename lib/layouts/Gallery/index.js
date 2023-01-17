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
  PagerBottomInnerContainer,
  ItemSubLabelDesc
} from './styles';

import { isEmpty, get, map, remove } from 'lodash';
import PagerView from 'react-native-pager-view';
import Dots from 'react-native-dots-pagination';
import FastImage from 'react-native-fast-image';
import ImageViewer from 'rc-mobile-base/lib/components/ImageViewer';
import { connect } from 'react-redux';
import { tokenSelector, hotelGroupKeySelector, apiSelector } from 'rc-mobile-base/lib/selectors/auth';
import {
  blue
} from 'rc-mobile-base/lib/styles';
import { TouchableOpacity, Text } from 'react-native';

class GalleryLayout extends Component {
  constructor(props) {
    super(props);

    this.pagerRef = createRef()

    this.state = {
      catalogHolder: [],
      currentIndex: 0,
      isShowImageViewer: false,
      pagerIndex: 0
    }

  }

  componentDidMount() {
    let catalogIndex = get(this, 'props.navigation.state.params.imageIndex', 0);
    this.setState({ pagerIndex: catalogIndex})
    this.getRoomCatalog()
  }

  componentDidUpdate(prevProps, prevState) {
    const { catalogHolder } = this.state;
    let catalogList = get(this, 'props.navigation.state.params.catalogHolder', [])
    if (isEmpty(catalogList)) {
      catalogList = get(this, 'props.catalogHolder', []);
    }

    if (catalogHolder != catalogList) {
      this.setState({ catalogHolder: catalogList })
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

  renderViewPagerPage = (data, index) => {
    const imageUrl = get(data, 'annotatedImageUrl', null);
    const { catalogHolder, currentIndex } = this.state;
    const currentPageDescription = get(catalogHolder[currentIndex], 'annotations', []);


    return (
      <PageContainer key={index.toString()} activeOpacity={1}>
        <TouchableOpacity onPress={() => this.toggleTaskImageModal()}>
          <HeaderImages source={{ uri: imageUrl }} resizeMode={FastImage.resizeMode.contain} />
        </TouchableOpacity>
        <ImageDescriptionContainer>
          <DescriptionFlatList
            data={currentPageDescription}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => this.renderAnnotationDescription(item, index)}
          />
        </ImageDescriptionContainer>
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

  onPageScroll = (event) => {
    const { currentIndex } = this.state;
    const { position } = event.nativeEvent;
    if (position !== currentIndex) {
      this.setState({ currentIndex: position })
    }
  }


  toggleTaskImageModal = () => {
    const { isShowImageViewer } = this.state;
    this.setState({ isShowImageViewer: !isShowImageViewer });
  }

  renderAnnotationDescription = (item, index) => {
    const ordinalNumber = get(item, 'ordinalNumber', null);
    const description = get(item, 'description', null);

    let desArray = description.split("\n");
    let title = remove(desArray, (el, index) => index === 0);
    let subTitle = desArray.join(", ")


    return (
      <InformationContainer>
        {/* <ItemLabel>OrdinalNumber: {ordinalNumber}</ItemLabel> */}
        {/* <ItemLabelDesc>{ordinalNumber}. {description}</ItemLabelDesc> */}
        <ItemLabelDesc>{ordinalNumber}. {title.join(", ")}</ItemLabelDesc>
        {desArray.length > 0 &&
          <ItemSubLabelDesc>{" " + subTitle.replace(/,/g, '\n')}</ItemSubLabelDesc>
        }
      </InformationContainer>
    )
  }

  render() {
    const { catalogHolder, currentIndex, isShowImageViewer, pagerIndex } = this.state;
    const pageCount = get(catalogHolder, 'length');
    const currentPageDescription = get(catalogHolder[currentIndex], 'annotations', []);


    if (pageCount > 0) {
      return (
        <RootContainer>
          <HeaderImageSliderContainer>
            <PagerView
              style={{ flexGrow: 1, height: '100%', width: '100%' }}
              initialPage={pagerIndex}
              ref={this.pagerRef}
              onPageScroll={this.onPageScroll}
            >
              {catalogHolder.map((page, index) => this.renderViewPagerPage(page, index))}
            </PagerView>

            {/* <PagerBottomContainer>
              <PagerBottomInnerContainer>
                <Dots
                  activeDotHeight={10} activeDotWidth={10}
                  passiveDotWidth={10} passiveDotHeight={10}
                  // activeBorder={true}
                  // activeBorderWidth={1.5}
                  // passiveBorder={true}
                  // passiveBorderWidth={1}
                  activeColor={blue.color}
                  // passiveBorderColor={black.color}
                  // passiveColor={greyDk.color}
                  length={pageCount} active={currentIndex} />
              </PagerBottomInnerContainer>
            </PagerBottomContainer> */}
          </HeaderImageSliderContainer>

          <ImageViewer
            isVisible={isShowImageViewer}
            initialIndex={currentIndex}
            images={map(catalogHolder, function (obj) { return { url: get(obj, 'annotatedImageUrl', null) } })}
            toggleTaskImageModal={this.toggleTaskImageModal}
          />

          {/* <ImageDescriptionContainer>
            <DescriptionFlatList
              data={currentPageDescription}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => this.renderAnnotationDescription(item, index)}
            />
          </ImageDescriptionContainer> */}

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

export default connect(mapStateToProps, mapDispatchToProps)(GalleryLayout);