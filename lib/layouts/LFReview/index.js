import React from 'react';
import { compose, withStateHandlers } from 'recompose';
import { SectionList, InteractionManager } from 'react-native';
import Modalbox from 'react-native-modalbox';
import { connect } from 'react-redux';
import _, { get } from 'lodash';

import { hotelLFSelector, groupedHotelLFSelector, gropuedFilteredLFSelector } from './selectors'
import UpdatesActions from '../../actions/updates';

import Subheader from './Subheader';
import ListHeader from './ListHeader';
import Item from './Item';
import Modal from './Modal';

import {
  Container,
  Content,
  ContentSpacing
} from './styles';

class LFReviewLayout extends React.PureComponent {

  state = {
    activeItem: null,
    isShowItem: false,
    selectedStatus: null,
    signaturePath: null,
    photoOnePath: [],
    photoTwoPath: null,
    notes: null,
    isShowImageViewer: false,
    setActiveImageId: null,
    newUploadedImage: [],
    oldImagesChanges: []
  }

  _handleActiveItem = (item) => this.setState({ activeItem: item, notes: item && item.notes || '', isShowItem: true, photoOnePath: item.image_urls, oldImagesChanges: item.image_urls })

  _handleStatusUpdate = (status) => {
    const { activeItem: item, activeItem: { id } } = this.state;
    const update = { ...item, status };

    this.setState({ selectedStatus: status, isShowItem: status === "hand-delivered" }, state => console.log(state));

    InteractionManager.runAfterInteractions(() => {
      this.props.updateItem(id, update);
    });
  }

  savePhotos = (field, path) => {
    const { photoOnePath, activeItem, newUploadedImage } = this.state
    this.setState({ photoOnePath: [path, ...photoOnePath] });
    this.setState({ newUploadedImage: [...newUploadedImage, path] })
  }

  removePhotoOnCloseIcon = (item) => {
    const { photoOnePath, newUploadedImage, oldImagesChanges } = this.state
    const filterData = photoOnePath.filter((photo) => photo !== item)
    const filterDataForNewUpload = newUploadedImage.filter((photo) => photo !== item)
    const removeOldImages = oldImagesChanges.filter((photo) => photo !== item)
    this.setState({ photoOnePath: filterData })
    this.setState({ newUploadedImage: filterDataForNewUpload })
    this.setState({ oldImagesChanges: removeOldImages })
  }

  _handleCloseStatus = () => {
    const { activeItem, newUploadedImage, oldImagesChanges } = this.state;
    this.setState({ activeItem: null, isShowItem: false })

    const imageObject = {
      hotelId: activeItem.hotel_id,
      id: activeItem.id,
      photoUrls: activeItem.image_urls
    }

    InteractionManager.runAfterInteractions(() => {
      if (!_.isEmpty(this.state.newUploadedImage) || JSON.stringify(activeItem.image_urls) !== JSON.stringify(oldImagesChanges)) {
        this.props.updateItemPhoto(imageObject, oldImagesChanges, newUploadedImage)
      }

      // if (this.state.photoTwoPath) {
      //   this.props.updateItemPhoto(imageObject, 'added_image_two', this.state.photoOnePath)
      // }

      // if (this.state.signaturePath) {
      //   this.props.updateItemPhoto(imageObject, 'signature', this.state.signaturePath)
      // }

      // if (this.state.notes !== activeItem.notes) {
      //   this.props.updateItem(activeItem.id, { ...activeItem, notes: this.state.notes });
      // }

      this.setState({
        signaturePath: null,
        photoOnePath: [],
        photoTwoPath: null,
        selectedStatus: null,
        notes: null
      });
    })
  }

  _handleSetPath = (field, path) => {
    console.log(field, path);
    this.setState({ [field]: path });
  }

  _handleUpdateNotes = (t) => this.setState({ notes: t })
  // _handleUpdateSearch = (t) => this.setState({ searchQuery: t })
  // _handleUpdateShow = (v) => this.setState({ isShowAll: v })

  onpressImageIcon = (value) => {
    this.setState({ isShowImageViewer: !this.state.isShowImageViewer })
    this.setState({ setActiveImageId: value?.id })
  }

  render() {
    const { isShowImageViewer, setActiveImageId, photoOnePath, activeItem } = this.state
    return (
      <Container>
        <Subheader
          searchQuery={this.props.searchQuery}
          updateQuery={this.props.updateSearch}
          isShowAll={this.props.isShowAll}
          updateShow={this.props.updateShow}
        />

        <Content>
          <SectionList
            renderItem={({ item }) => <Item item={item} handleActive={this._handleActiveItem} onpressImageIcon={this.onpressImageIcon} isShowImageViewer={isShowImageViewer} setActiveImageId={setActiveImageId} />}
            renderSectionHeader={({ section }) => <ListHeader date={section.title} key={section.title} />}
            sections={this.props.filteredLFItems}
            keyExtractor={(item, index) => item.reference || item.date_ts}
            ListHeaderComponent={() => null}
            ListFooterComponent={() => <ContentSpacing />}
          />
        </Content>

        <Modalbox
          isOpen={this.state.isShowItem}
          swipeToClose={false}
          onClosed={this._handleCloseStatus}
          style={{ width: 800, height: 600 }}
        >
          <Modal
            photoOnePath={photoOnePath}
            activeItem={activeItem}
            status={get(this, 'state.activeItem.status', null)}
            notes={this.state.notes}
            isHandDelivered={this.state.selectedStatus === "hand-delivered"}
            handleUpdate={this._handleStatusUpdate}
            handlePhoto={this._handleSetPath}
            savePhotos={this.savePhotos}
            handleNotes={this._handleUpdateNotes}
            signaturePath={this.state.signaturePath}
            exit={() => this.setState({ isShowItem: false })}
            removePhoto={this.removePhotoOnCloseIcon}
          />
        </Modalbox>
      </Container>
    )
  }
}

const mapStateToProps = (state, props, alt) => {
  const { isShowAll, searchQuery } = props;
  return {
    lostFoundItems: groupedHotelLFSelector(state),
    filteredLFItems: gropuedFilteredLFSelector(searchQuery, isShowAll)(state)
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateItem: (id, item) => dispatch(UpdatesActions.updateFoundStatus(id, item)),
    updateItemPhoto: (id, field, path) => dispatch(UpdatesActions.updateFoundPhoto(id, field, path)),
    dispatch
  }
};

export default withStateHandlers(
  {
    searchQuery: '',
    isShowAll: false
  },
  {
    updateSearch: (state) => (t) => ({ ...state, searchQuery: t }),
    updateShow: (state) => (v) => ({ ...state, isShowAll: v })
  }
)(connect(mapStateToProps, mapDispatchToProps)(LFReviewLayout));
