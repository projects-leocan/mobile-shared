import React from "react";
import { Modal, SectionList } from "react-native";
import ScrollableTabView from "react-native-scrollable-tab-view";
import I18n from "react-native-i18n";

import { UserItem } from "./SelectAssignmentModal";
import ModalHeader from "rc-mobile-base/lib/components/ModalHeader";
import CustomTabbar from "rc-mobile-base/lib/components/CustomTabbar";
import SearchSubheader from "rc-mobile-base/lib/components/SearchSubheader";
import moment from "moment";

import {
  ModalContainer,
  SelectBothContainer,
  SelectBothViewContainer,
  ModalSectionHeader,
  SelectBothButtonContainer,
  SelectBothButtonText,
  SelectBothSpacer,
} from "./styles";

import {
  margin,
  padding,
  blue500,
  white,
  black,
  grey,
  slate,
  text,
  asc,
  aic,
  jcc,
} from "rc-mobile-base/lib/styles";

export default class SelectBoth extends React.Component {
  state = { searchQuery: "", user: null, date: null, today: null };

  /*componentDidUpdate() {
    var tDate = new Date();
    this.setState({ date: tDate });
    this.setState({ today: tDate });
  }*/
  componentDidUpdate(prevProps, prevState) {
    //console.log(diff(prevProps, this.props));
    if (prevProps.isVisible !== this.props.isVisible) {
      var tDate = new Date();
      this.setState({ date: tDate, today: tDate });
    }
  }

  _handleUpdateQuery = t =>
    this.setState({
      searchQuery: t,
    });
  _handleSelectUser = user => {
    this.setState({ user });
    this.tabView.goToPage(1);
  };
  _handleSelectDate = date => {
    this.setState({
      date,
    });
  }
   

  _handleComplete = () => {
    const { toggleModal, handler } = this.props;
    const { user, date } = this.state;
    const formateDate = moment(date).format('YYYY-MM-DD HH:mm:ss')

    toggleModal();
    handler(user, formateDate);
  };

  render() {
    const { isVisible, toggleModal, userSections, currentDate } = this.props;
    const { searchQuery, user, date, today } = this.state;
    const cleanQuery = searchQuery && searchQuery.toLowerCase().trim();

    const filteredUserSections = cleanQuery
      ? userSections
        .map(section => ({
          ...section,
          data: section.data.filter(item =>
            item.fullName.toLowerCase().includes(cleanQuery)
          ),
        }))
        .filter(section => section.data.length)
      : userSections;

    return (
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={isVisible}
        onRequestClose={toggleModal}
      >
        <ModalContainer>
          <ModalHeader
            value={I18n.t("maintenance.task.index.reassign-task")}
            onPress={toggleModal}
          />

          <SelectBothContainer
            renderTabBar={() => <CustomTabbar />}
            ref={tabView => {
              this.tabView = tabView;
            }}
            locked
          >
            <SelectBothViewContainer tabLabel="user">
              <SearchSubheader
                updateQuery={this._handleUpdateQuery}
                searchQuery={this.state.searchQuery}
                style={{
                  container: { ...white.bg, ...padding.y10 },
                  input: { ...jcc, ...aic },
                }}
              >
                Search
              </SearchSubheader>

              <SectionList
                renderItem={({ item, index }) =>
                  <UserItem
                    user={(item.fullName && item) || null}
                    handler={() => this._handleSelectUser(item)}
                  />}
                renderSectionHeader={({ section: { title } }) =>
                  <ModalSectionHeader>
                    {title}
                  </ModalSectionHeader>}
                sections={filteredUserSections}
                keyExtractor={(item, index) => item._id}
              />
            </SelectBothViewContainer>
            <SelectBothViewContainer tabLabel="calendar">
              {/* <Calendar
                style={[]}
                barView={[blue500.bg, padding.a10]}
                barText={[text.fw600, white.text]}
                stageView={[padding.a0]}
                dayView={[
                  jcc,
                  aic,
                  padding.a5,
                  { height: 40, width: 40, borderRadius: 25 },
                ]}
                dayHeaderView={[grey.bg]}
                dayHeaderText={[text.fw700, black.text]}
                dayRowView={[grey.bc, { height: 50 }]}
                dayDisabledText={[slate.text, { opacity: 0.5 }]}
                dayTodayText={[text.fw700, blue500.text]}
                daySelectedText={[white.text, { borderWidth: 0 }]}
                daySelectedView={[blue500.bg]}
                onChange={(date) => this._handleSelectDate(date)}
                selected={(date && moment(date)) || moment(currentDate)}
                minDate={moment(today)}
                maxDate={moment().add(3, "months").startOf("day")}
              /> */}

              <SelectBothSpacer />

              <SelectBothButtonContainer onPress={this._handleComplete}>
                <SelectBothButtonText>
                  {I18n.t("base.ubiquitous.submit").toUpperCase()}
                </SelectBothButtonText>
              </SelectBothButtonContainer>
            </SelectBothViewContainer>
          </SelectBothContainer>
        </ModalContainer>
      </Modal>
    );
  }
}