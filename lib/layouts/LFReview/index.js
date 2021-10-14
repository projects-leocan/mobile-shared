import React from 'react';
import { compose, withStateHandlers } from 'recompose';
import { SectionList, InteractionManager } from 'react-native';
import Modalbox from 'react-native-modalbox';
import { connect } from 'react-redux';
import { get } from 'lodash';

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
    photoOnePath: null,
    photoTwoPath: null,
    notes: null,
  }

  _handleActiveItem = (item) => this.setState({ activeItem: item, notes: item && item.notes || '', isShowItem: true })

  _handleStatusUpdate = (status) => {
    const { activeItem: item, activeItem: { id } } = this.state;
    const update = { ...item, status };

    this.setState({ selectedStatus: status, isShowItem: status === "hand-delivered" }, state => console.log(state));

    InteractionManager.runAfterInteractions(() => {
      this.props.updateItem(id, update);
    });
  }

  _handleCloseStatus = () => {
    console.log('closing active item')
    const { activeItem } = this.state;
    this.setState({ activeItem: null, isShowItem: false })

    InteractionManager.runAfterInteractions(() => {
      if (this.state.photoOnePath) {
        this.props.updateItemPhoto(activeItem.id, 'added_image_one', this.state.photoOnePath)
      }

      if (this.state.photoTwoPath) {
        this.props.updateItemPhoto(activeItem.id, 'added_image_two', this.state.photoOnePath)
      }

      if (this.state.signaturePath) {
        this.props.updateItemPhoto(activeItem.id, 'signature', this.state.signaturePath)
      }

      if (this.state.notes !== activeItem.notes) {
        this.props.updateItem(activeItem.id, { ...activeItem, notes: this.state.notes });
      }

      this.setState({
        signaturePath: null,
        photoOnePath: null,
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

  render() {
    
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
            renderItem={({ item }) => <Item item={item} handleActive={this._handleActiveItem} />}
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
            status={get(this, 'state.activeItem.status', null)}
            notes={this.state.notes}
            isHandDelivered={this.state.selectedStatus === "hand-delivered"}
            handleUpdate={this._handleStatusUpdate}
            handlePhoto={this._handleSetPath}
            handleNotes={this._handleUpdateNotes}
            signaturePath={this.state.signaturePath}
            exit={() => this.setState({ isShowItem: false })}
            />
        </Modalbox>
      </Container>
    )
  }
}

const mapStateToProps = (state, props, alt) => {
  const { isShowAll, searchQuery} = props;
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
