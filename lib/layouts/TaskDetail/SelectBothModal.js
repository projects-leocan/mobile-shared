import React, { createRef } from "react";
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
import ListView from "rc-mobile-base/lib/components/ListView";
import Item from "rc-mobile-base/lib/layouts/CreateTask/AssignmentSelect/Item";
import GroupHeader from "rc-mobile-base/lib/layouts/CreateTask/AssignmentSelect/GroupHeader";
import Header from "rc-mobile-base/lib/layouts/CreateTask/AssignmentSelect/Header"
import { map, flatten, last } from 'lodash';
import { xorBy } from 'lodash/array';
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
  constructor(props) {
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

  onClose = () => {
    const { toggleModal } = this.props;
    toggleModal();
    this.setState({ user: null })
  }

  _handleExtraUserSelect = (value) => {
    const { assigneeGroup, setGroupAssignee, searchAssignee, originalAssigneeGroup, setActiveGroupAssignee } = this.props;

    if (searchAssignee) {
      const filterSubGroup = map(assigneeGroup, function (obj) {
        const isFindSubGroup = get(obj, 'value', null) === get(value, 'groupId', null);

        if (isFindSubGroup) {
          return {
            ...obj,
            isSelected: false,
            groupUsers: map(get(obj, 'groupUsers', []), function (o) {
              const selectedConditionMet = get(value, 'value', null) === get(o, 'value', null);
              return { ...o, isSelected: selectedConditionMet ? !o.isSelected : o.isSelected }
            }),
          }
        } else {
          return {
            ...obj
          }
        }
      })

     // setActiveGroupAssignee(filterSubGroup)
    }

    const filterSubGroup = map(originalAssigneeGroup, function (obj) {
      const isFindSubGroup = get(obj, 'value', null) === get(value, 'groupId', null);

      if (isFindSubGroup) {
        return {
          ...obj,
          isSelected: false,
          groupUsers: map(get(obj, 'groupUsers', []), function (o) {
            const selectedConditionMet = get(value, 'value', null) === get(o, 'value', null);
            return { ...o, isSelected: selectedConditionMet ? !o.isSelected : o.isSelected }
          }),
        }
      } else {
        return {
          ...obj
        }
      }
    })

   // setGroupAssignee(filterSubGroup)
  }

  _handleUserSelect = (value) => {
    const { assigneeGroup, setGroupAssignee, searchAssignee, originalAssigneeGroup, setActiveGroupAssignee } = this.props;

    if (searchAssignee) {
      const filterSubGroup = map(assigneeGroup, function (obj) {
        const isFindSubGroup = get(obj, 'value', null) === get(value, 'groupId', null);

        if (isFindSubGroup) {
          return {
            ...obj,
            isSelected: false,
            userSubGroup: map(get(obj, 'userSubGroup'), function (o) {
              const validateSubGroupSelect = get(value, 'subGroupId', null) === get(o, 'value', null);
              return {
                ...o, isSelected: validateSubGroupSelect ? false : o.isSelected, subGroupUsers: map(get(o, 'subGroupUsers'), function (o) {
                  const selectedConditionMet = get(value, 'value', null) === get(o, 'value', null);
                  return { ...o, isSelected: selectedConditionMet ? !o.isSelected : o.isSelected }
                })
              }
            }),
          }
        } else {
          return {
            ...obj
          }
        }
      })

      //setActiveGroupAssignee(filterSubGroup)
    }

    const filterSubGroup = map(originalAssigneeGroup, function (obj) {
      const isFindSubGroup = get(obj, 'value', null) === get(value, 'groupId', null);

      if (isFindSubGroup) {
        return {
          ...obj,
          isSelected: false,
          userSubGroup: map(get(obj, 'userSubGroup'), function (o) {
            const validateSubGroupSelect = get(value, 'subGroupId', null) === get(o, 'value', null);
            return {
              ...o, isSelected: validateSubGroupSelect ? false : o.isSelected, subGroupUsers: map(get(o, 'subGroupUsers'), function (o) {
                const selectedConditionMet = get(value, 'value', null) === get(o, 'value', null);
                return { ...o, isSelected: selectedConditionMet ? !o.isSelected : o.isSelected }
              })
            }
          }),
        }
      } else {
        return {
          ...obj
        }
      }
    })

   // setGroupAssignee(filterSubGroup)
  }

  

  renderSubGroupItem = (data, isExtraUser = false) => {
    return (
      <ListView
        data={data}
        renderRow={(row, _, index) => <Item index={index} onPress={isExtraUser ? this._handleExtraUserSelect : this._handleUserSelect} row={row} />}
      />
    )
  }

  renderAssigneeItem = (row, index, groupUsers) => {
    const extraUser = xorBy(groupUsers, flatten(map(row, 'subGroupUsers')), 'value');
    const list = row.map(k => ({ data: [k], title: k.name, key: k.value }));

    return (
      <>
        {get(extraUser, 'length') > 0
          ?
          this.renderSubGroupItem(extraUser, true)
          : null
        }
        <SectionList
          sections={list}
          scrollEnabled={false}
          renderItem={({ item, index }) => this.renderSubGroupItem(get(item, 'subGroupUsers', []))}
          renderSectionHeader={({ section }) => <Header row={last(get(section, 'data', {}))} onPress={this._handleSubGroupSelect} />}
          keyExtractor={(item, index) => `key-${index}`}
        />

      </>
    )
  }
  _handleSubGroupSelect = (value) => {
    const { assigneeGroup, setGroupAssignee, searchAssignee, originalAssigneeGroup, setActiveGroupAssignee } = this.props;

    if (searchAssignee) {
      const filterSubGroup = map(assigneeGroup, function (obj) {
        const isFindSubGroup = get(obj, 'value', null) === get(value, 'groupId', null);

        if (isFindSubGroup) {
          return {
            ...obj,
            isSelected: false,
            userSubGroup: map(get(obj, 'userSubGroup'), function (o) {
              const selectedConditionMet = get(value, 'value', null) === get(o, 'value', null);
              const validateIsSelect = selectedConditionMet ? !o.isSelected : o.isSelected
              return { ...o, isSelected: validateIsSelect, subGroupUsers: map(get(o, 'subGroupUsers'), function (o) { return { ...o, isSelected: selectedConditionMet ? validateIsSelect : o.isSelected } }) }
            }),
          }
        } else {
          return {
            ...obj
          }
        }
      })

      setActiveGroupAssignee(filterSubGroup)
    }

    const filterSubGroup = map(originalAssigneeGroup, function (obj) {
      const isFindSubGroup = get(obj, 'value', null) === get(value, 'groupId', null);

      if (isFindSubGroup) {
        return {
          ...obj,
          isSelected: false,
          userSubGroup: map(get(obj, 'userSubGroup'), function (o) {
            const selectedConditionMet = get(value, 'value', null) === get(o, 'value', null);
            const validateIsSelect = selectedConditionMet ? !o.isSelected : o.isSelected
            return { ...o, isSelected: validateIsSelect, subGroupUsers: map(get(o, 'subGroupUsers'), function (o) { return { ...o, isSelected: selectedConditionMet ? validateIsSelect : o.isSelected } }) }
          }),
        }
      } else {
        return {
          ...obj
        }
      }
    })
    setGroupAssignee(filterSubGroup)
  }

  _handleGroupSelect = (value) => {
    const { assigneeGroup, setGroupAssignee, setActiveGroupAssignee, searchAssignee, originalAssigneeGroup } = this.props;
    console.log(assigneeGroup,'assignee fgroup')
    console.log(setGroupAssignee,'setgroupassignee')
    console.log(setActiveGroupAssignee,'setactivegroupassignee')
    console.log(searchAssignee,'searchassignee')
    console.log(originalAssigneeGroup,'originalassignee group')
    if (searchAssignee) {
      const filterGroup = map(assigneeGroup, function (obj) {
        const isFindGroup = get(obj, 'value', null) === get(value, 'value', null);

        if (isFindGroup) {
          const isSelected = !obj.isSelected;
          return {
            ...obj,
            isSelected: isSelected,
            userSubGroup: map(get(obj, 'userSubGroup'), function (o) {
              return { ...o, isSelected: isSelected, subGroupUsers: map(get(o, 'subGroupUsers'), function (o) { return { ...o, isSelected: isSelected } }) }
            }),
            groupUsers: map(get(obj, 'groupUsers', []), function (o) {
              return { ...o, isSelected: isSelected }
            }),
          }
        } else {
          return {
            ...obj
          }
        }
      })

      setActiveGroupAssignee(filterGroup)
    }

    const filterGroup = map(originalAssigneeGroup, function (obj) {
      const isFindGroup = get(obj, 'value', null) === get(value, 'value', null);

      if (isFindGroup) {
        const isSelected = !obj.isSelected;
        return {
          ...obj,
          isSelected: isSelected,
          userSubGroup: map(get(obj, 'userSubGroup'), function (o) {
            return { ...o, isSelected: isSelected, subGroupUsers: map(get(o, 'subGroupUsers'), function (o) { return { ...o, isSelected: isSelected } }) }
          }),
          groupUsers: map(get(obj, 'groupUsers', []), function (o) {
            return { ...o, isSelected: isSelected }
          }),
        }
      } else {
        return {
          ...obj
        }
      }
    })

    setGroupAssignee(filterGroup)
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

    // const filteredUserSections = cleanQuery
    //   ?
    //   userSections
    //     .map(section => ({
    //       ...section,
    //       data: section.data.filter((item) => {
    //         let newData = item?.first_name?.toLowerCase().concat(" " + item?.last_name?.toLowerCase())
    //         return (
    //           item?.first_name?.includes(cleanQuery?.toLowerCase())
    //           || item?.last_name?.toLowerCase().includes(cleanQuery?.toLowerCase())
    //           || newData?.includes(cleanQuery?.toLowerCase())
    //           || item?.fullName.toLowerCase().includes(cleanQuery)
    //         )
    //       })
    //     }))
    //   : userSections;
    const filteredUserSections = userSections.map(k => ({ data: [k], title: k.name, key: k.value }))

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

            <View style={{ width: "100%" }}><CustomPagerTab tabs={["user", "calendar"]} {...this.tabView} activeTab={this.state.activeTab} /></View>
            <PagerView
              style={{ flex: 1 }}
              initialPage={0}
              ref={this.tabView}
              onPageSelected={(e) => this.setState({ activeTab: e.nativeEvent.position })}
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

                {/* <SectionList
                  renderItem={({ item, index }) =>
                    <UserItem
                      user={(item.fullName && item) || null}
                      handler={() => this._handleSelectUser(item)}
                    />
                   
                  }
                  renderSectionHeader={({ section: { title } }) =>
                    <ModalSectionHeader>
                      {title}
                    </ModalSectionHeader>}
                  sections={filteredUserSections}
                  keyExtractor={(item, index) => item.id}
                /> */}

                <SectionList
                  sections={filteredUserSections}
                  //ref={(r) => this.rootSectionRef = r}
                  renderItem={
                    ({ item, index }) => this.renderAssigneeItem(get(item, 'userSubGroup', []), index, get(item, 'groupUsers', []))
                  }
                  renderSectionHeader={({ section }) => <GroupHeader row={last(get(section, 'data', {}))} onPress={this._handleGroupSelect} />}
                  keyExtractor={(item, index) => `key-${index}`}
                  stickySectionHeadersEnabled
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
