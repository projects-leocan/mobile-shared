import React, {createRef} from "react";
import { Modal, SafeAreaView, SectionList, View } from "react-native";
import I18n from "react-native-i18n";

import { UserItem } from "./SelectAssignmentModal";
import ModalHeader from "rc-mobile-base/lib/components/ModalHeaderNew";
import CustomTabbar from "rc-mobile-base/lib/components/CustomTabbar";
import CustomPagerTab from "rc-mobile-base/lib/components/CustomPagerTab"
import PagerView from "react-native-pager-view";
import SearchSubheader from "rc-mobile-base/lib/components/SearchSubheader";
import moment from "moment";
import CalendarPicker from 'react-native-calendar-picker';


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
import _, { first, get } from "lodash";
import pickActiveReservation from "rc-mobile-base/lib/utils/pick-active-reservation";

export default class SelectBoth extends React.Component {
  constructor(props){
    super(props)
    this.tabView = createRef()
    this.state = { 
      searchQuery: "",
      user: null, 
      date: null, 
      today: null, 
      activeGuestDate: new Date(), 
      activeTab: 0 
    };
  }
  /*componentDidUpdate() {
    var tDate = new Date();
    this.setState({ date: tDate });
    this.setState({ today: tDate });
  }*/

  componentDidUpdate(prevProps, prevState) {
    //console.log(diff(prevProps, this.props));
    if (prevProps.isVisible !== this.props.isVisible) {
      var tDate = new Date();
      const { room } = this.props
      const guests = get(room, 'guests', [])
      const activeReservationId = pickActiveReservation(guests, false);
      if (activeReservationId) {
        const calendar = get(room, "roomCalendar", [])
        const activeGuest = calendar.filter((g) => g.id === activeReservationId)
        if (!_.isEmpty(activeGuest)) {
          const coDate = activeGuest[0]?.check_out_date
          if (coDate) {
            this.setState({ date: coDate });
          }
          else {
            this.setState({ date: new Date() })
          }
        }
      }
      else {
        this.setState({ date: new Date() })
      }
      this.setState({ today: tDate })
      // this.setState({ date: tDate, today: tDate });
    }
  }

  _handleUpdateQuery = t =>
    this.setState({
      searchQuery: t,
    });
  _handleSelectUser = user => {
    this.setState({ user });
    this.tabView.current.setPage(1)
  };
  _handleSelectDate = (date) => {
    this.setState({ date });
  }


  _handleComplete = () => {
    const { toggleModal, handler } = this.props;
    const { user, date } = this.state;
    const formateDate = moment(date).format('YYYY-MM-DD HH:mm:ss')

    toggleModal();
    handler(user, formateDate);
  };

  onClose = () =>{
    const { toggleModal } = this.props;
    toggleModal();
    this.setState({user: null})
  }

  render() {
    const { isVisible, toggleModal, userSections, currentDate } = this.props;
    const { searchQuery, user, date, today, activeGuestDate } = this.state;
    const cleanQuery = searchQuery && searchQuery.toLowerCase().trim();
    const newDate = new Date(activeGuestDate)
    let today1 = moment(date);

    let customDatesStyles = [];
    customDatesStyles.push({
      date: today1.clone(),
      style: { backgroundColor: '#1D2F58' },
      textStyle: { color: '#fff' },
      containerStyle: [],
      allowDisabled: true,
    })

    const filteredUserSections = cleanQuery
      ?
      userSections
        .map(section => ({
          ...section,
          data: section.data.filter((item) => {
            let newData = item?.first_name?.toLowerCase().concat(" " + item?.last_name?.toLowerCase())
            return (
              item?.first_name?.includes(cleanQuery?.toLowerCase())
              || item?.last_name?.toLowerCase().includes(cleanQuery?.toLowerCase())
              || newData?.includes(cleanQuery?.toLowerCase())
              || item?.fullName.toLowerCase().includes(cleanQuery)
            )
          })
        }))
      : userSections;

    return (
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={isVisible}
        onRequestClose={this.onClose}
      >
        <SafeAreaView style={{ flex: 1 }} >

          <ModalContainer>
            <ModalHeader
              value={I18n.t("maintenance.task.index.reassign-task")}
              onPress={this.onClose}
            />

            <View style={{width:"100%"}}><CustomPagerTab tabs={["user","calendar"]} {...this.tabView} activeTab={this.state.activeTab}/></View>
            <PagerView
              style={{ flex: 1 }}
              initialPage={0}
              ref={this.tabView}
              onPageSelected={(e) => this.setState({activeTab: e.nativeEvent.position})}
              scrollEnabled={false}
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
                  keyExtractor={(item, index) => item.id}
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

                <CalendarPicker
                  defaultColor="#1D2F58"
                  defaultBackgroundColor="#1D2F58"
                  initialDate={newDate}
                  minDate={new Date()}
                  maxDate={moment().add(3, "months").startOf("day")}
                  headerWrapperStyle={{ backgroundColor: "#1D2F58", color: "#fff" }}
                  monthYearHeaderWrapperStyle={{ color: "#fff" }}
                  monthTitleStyle={{
                    color: '#fff',
                  }}
                  yearTitleStyle={{
                    color: '#fff',
                  }}
                  previousTitleStyle={{
                    color: '#fff',
                  }}
                  nextTitleStyle={{
                    color: '#fff',
                  }}
                  selectedDayColor="#1D2F58"
                  selectedDayTextColor="#FFFFFF"
                  onDateChange={this._handleSelectDate}
                  customDatesStyles={customDatesStyles}

                />

                <SelectBothSpacer />

                <SelectBothButtonContainer disabled={_.isEmpty(user)} style={{ opacity: _.isEmpty(user) ? 0.5 : 1 }} onPress={this._handleComplete}>
                  <SelectBothButtonText>
                    {I18n.t("base.ubiquitous.submit").toUpperCase()}
                  </SelectBothButtonText>
                </SelectBothButtonContainer>
              </SelectBothViewContainer>
            </PagerView>
          </ModalContainer>
        </SafeAreaView>

      </Modal>
    );
  }
}
