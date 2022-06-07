import React, { Component, createRef } from 'react';
import {
  styles,
  SafeAreaContainer,
  RootContainer,
  PageContainer,
  HeaderImageSliderContainer,
  HeaderImages,
  ImageDescriptionContainer,
  DescriptionFlatList
} from './styles';

import { isEmpty, get } from 'lodash';
import PagerView from 'react-native-pager-view';
import {
  PagerTabIndicator,
  IndicatorViewPager,
  PagerTitleIndicator,
  PagerDotIndicator,
} from '@shankarmorwal/rn-viewpager';

import request from 'rc-mobile-base/lib/utils/request';
import { connect } from 'react-redux';
import { tokenSelector, hotelGroupKeySelector, apiSelector } from 'rc-mobile-base/lib/selectors/auth';

const ROOM_CATALOGS_API = `/RoomCatalog/GetListOfRoomCatalogImages`;

// function* fetchRoomCatalogs() {
//   return yield call(authRequest, ROOM_CATALOGS_API);
// }

class GalleryLayout extends Component {
  constructor(props) {
    super(props);

    this.pagerRef = createRef()

    this.state = {
      catalogHolder: []
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
      console.log('--- catalogList ---');
      console.log(catalogList)

      this.setState({ catalogHolder: catalogList })
    }

  }

  renderViewPagerPage = (data, index) => {
    const imageUrl = get(data, 'annotatedImageUrl', null);
    console.log('--- imageUrl ---', imageUrl)
    return (
      <PageContainer key={data}>
        <HeaderImages source={{ uri: imageUrl }} />
      </PageContainer>
    );
  };

  stepFromPagination = async (position) => {
    console.log('--- stepFromPagination ---');
    console.log(position)
  }

  render() {
    const { catalogHolder } = this.state;
    const pageCount = get(catalogHolder, 'length');

    return (
      <SafeAreaContainer>
        <RootContainer>
          {/* <PagerView
            style={{ flexGrow: 1 }}
            initialPage={0}
            ref={this.pagerRef}
          // onPageSelected={(e) => this.stepFromPagination(e.nativeEvent.position)}
          >
            {catalogHolder.map((page, index) => this.renderViewPagerPage(page, index))}
          </PagerView> */}
          <HeaderImageSliderContainer>
            <IndicatorViewPager
              style={styles.pagerStyle}
              indicator={
                <PagerDotIndicator pageCount={pageCount} />
              }
              onPageScrollStateChanged={(e) => this.stepFromPagination(e)}
              >
              {catalogHolder.map((page, index) => this.renderViewPagerPage(page, index))}
            </IndicatorViewPager>
          </HeaderImageSliderContainer>

          <ImageDescriptionContainer>
              {/* <DescriptionFlatList 
                data={}
              /> */}
          </ImageDescriptionContainer>

        </RootContainer>
      </SafeAreaContainer>
    )
  }
}

const mapStateToProps = (state, props) => {
  const roomId = props.navigation.state.params.roomId
  // const isAttendant = props.navigation.getParam('isAttendant', false);
  // const isRunner = props.navigation.getParam('isRunner', false);
  // console.log(isAttendant, isRunner);

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