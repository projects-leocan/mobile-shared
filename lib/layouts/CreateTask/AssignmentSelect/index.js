import React, { Component } from 'react';
import {
  SectionList,
} from 'react-native';

import I18n from 'react-native-i18n'
import ListView from 'rc-mobile-base/lib/components/ListView';

import { get } from 'lodash/object';
import { intersection, uniq, xorBy } from 'lodash/array';
import { includes, some } from 'lodash/collection';
import { isEmpty } from 'lodash/lang';

import { map, filter, omit, flatten, uniqBy, first, compact, last, orderBy, sortBy } from 'lodash';

import Header from './Header';
import GroupHeader from './GroupHeader';
import Item from './Item';
import SearchForm from './SearchForm';

import {
  Container,
  ListContainer,
  BodyContainer,
  FooterContainer
} from './styles';

import {
  themeTomato
} from 'rc-mobile-base/lib/styles';
import TaskButton from '../TaskButton';

class AssignmentSelect extends Component {

  constructor(props) {
    super(props);

    this.state = {
      assigneeHolder: [],
      selectedAssign: []
    }
  }

  setDefaultAssignee = (defaultAssignee) => {
    const defaultAssignedToUserGroupId = compact(map(defaultAssignee, 'defaultAssignedToUserGroupId'));
    const defaultAssignedToUserSubGroupId = compact(map(defaultAssignee, 'defaultAssignedToUserSubGroupId'));
    const defaultAssignedToUserId = compact(map(defaultAssignee, 'defaultAssignedToUserId'));

    this._handleDefaultAssignee(defaultAssignedToUserGroupId, defaultAssignedToUserSubGroupId, defaultAssignedToUserId)
  }

  _handleDefaultAssignee = (defaultGroup, defaultSubGroup, defaultUser) => {
    const { setGroupAssignee, originalAssigneeGroup, assignmentOptions } = this.props;

    let filterGroup = []
    if (defaultGroup) {
      filterGroup = map(originalAssigneeGroup, function (obj) {
        const isFindGroup = includes(defaultGroup, get(obj, 'value', null));
        if (isFindGroup) {
          const isSelected = true;
          return {
            ...obj,
            isSelected: isFindGroup,
            sortingIndex: 1,
            userSubGroup: map(get(obj, 'userSubGroup'), function (o) {
              return { ...o, isSelected: isSelected, subGroupUsers: map(get(o, 'subGroupUsers'), function (o) { return { ...o, isSelected: isSelected } }) }
            }),
            groupUsers: map(get(obj, 'groupUsers', []), function (o) {
              return { ...o, isSelected: isSelected }
            }),
          }
        } else {
          const isSelected = false;
          return {
            ...obj,
            isSelected: isSelected,
            sortingIndex: 0,
            userSubGroup: map(get(obj, 'userSubGroup'), function (o) {
              return { ...o, isSelected: isSelected, subGroupUsers: map(get(o, 'subGroupUsers'), function (o) { return { ...o, isSelected: isSelected } }) }
            }),
            groupUsers: map(get(obj, 'groupUsers', []), function (o) {
              return { ...o, isSelected: isSelected }
            }),
          }
        }
      })

      filterGroup = orderBy(filterGroup, ['sortingIndex'], ['desc'])
      setGroupAssignee(filterGroup)
    }

    if (defaultSubGroup) {
      const parentAssignee = filter(flatten(map(assignmentOptions, 'userSubGroup')), function (obj) {
        return includes(defaultSubGroup, get(obj, 'value', null))
      });

      const parentsGroupId = uniq(map(parentAssignee, 'groupId'));
      filterGroup = map(filterGroup, function (obj) {
        const isFindSubGroup = includes(parentsGroupId, get(obj, 'value', null));

        if (isFindSubGroup) {
          return {
            ...obj,
            sortingIndex: 1,
            userSubGroup: map(get(obj, 'userSubGroup'), function (o) {
              const selectedConditionMet = includes(defaultSubGroup, get(o, 'value', null));
              const validateIsSelect = selectedConditionMet ? true : o.isSelected
              return { ...o, isSelected: validateIsSelect, subGroupUsers: map(get(o, 'subGroupUsers'), function (o) { return { ...o, isSelected: selectedConditionMet ? validateIsSelect : o.isSelected } }) }
            }),
          }
        } else {
          return {
            ...obj,
            sortingIndex: 0
          }
        }
      })
      filterGroup = orderBy(filterGroup, ['sortingIndex'], ['desc'])
      setGroupAssignee(filterGroup)
    }

    if (defaultUser) {
      /* SubGroup USer */
      const parentAssignee = filter(flatten(map(flatten(map(assignmentOptions, 'userSubGroup')), 'subGroupUsers')), function (o) {
        return includes(defaultUser, get(o, 'value', null))
      })

      const parentGroupId = uniq(map(parentAssignee, 'groupId'));
      const parentSubGroupId = uniq(map(parentAssignee, 'subGroupId'));

      filterGroup = map(filterGroup, function (obj) {
        const isFindSubGroup = includes(parentGroupId, get(obj, 'value', null));

        if (isFindSubGroup) {
          return {
            ...obj,
            sortingIndex: 1,
            userSubGroup: map(get(obj, 'userSubGroup'), function (o) {
              const validateSubGroupSelect = includes(parentSubGroupId, get(o, 'value', null));
              return {
                ...o, subGroupUsers: map(get(o, 'subGroupUsers'), function (o) {
                  const selectedConditionMet = includes(defaultUser, get(o, 'value', null));
                  return { ...o, isSelected: selectedConditionMet ? true : o.isSelected }
                })
              }
            }),
          }
        } else {
          return {
            ...obj,
            sortingIndex: 0
          }
        }
      })

      // setGroupAssignee(filterSubGroup)

      /* Extra user */
      const parentAssigneeUser = filter(flatten(map(assignmentOptions, 'groupUsers')), function (obj) {
        return includes(defaultUser, get(obj, 'value', null))
      });

      const userGroupId = uniq(map(parentAssigneeUser, 'groupId'));
      filterGroup = map(filterGroup, function (obj) {
        const isFindSubGroup = includes(userGroupId, get(obj, 'value', null));
        if (isFindSubGroup) {
          return {
            ...obj,
            sortingIndex: 1,
            groupUsers: map(get(obj, 'groupUsers', []), function (o) {
              const selectedConditionMet = includes(defaultUser, get(o, 'value', null));
              return { ...o, isSelected: selectedConditionMet ? true : o.isSelected }
            }),
          }
        } else {
          return {
            ...obj,
            sortingIndex: 0
          }
        }
      })


      filterGroup = orderBy(filterGroup, ['sortingIndex'], ['desc']);

      filterGroup.forEach(function (o, index) {
        if (!isEmpty(filterGroup[index].userSubGroup)) {

          let sorted = sortBy(filterGroup[index].userSubGroup, function (line, subIndex) {
            if (!isEmpty(line.subGroupUsers)) {
              return line.subGroupUsers[0].isSelected;
            }
          }).reverse();

          filterGroup[index].userSubGroup = sorted;
        }

      })

      setGroupAssignee(filterGroup)
    }

  }

  _handleSelect = (value) => {
    const { selectedAssign } = this.state;

    const validateSelectedAssign = selectedAssign.map(item => omit(item, ['isSelected']));
    const validateSelected = omit(value, ['isSelected']);

    if (some(validateSelectedAssign, validateSelected)) {
      const updateSelectionAssign = selectedAssign.filter(item => (item.value !== value.value || item.type !== value.type));
      this.setState({ selectedAssign: updateSelectionAssign })
    } else {
      this.setState({ selectedAssign: uniq([...selectedAssign, value]) })
    }
    // const { selectedAssignments, updateAssignments } = this.props;
    // let assignments = null;

    // if (value === 'maintenance team') {
    //   return updateAssignments(['maintenance team']);
    // }

    // if (selectedAssignments.length === 1 && selectedAssignments[0] === 'maintenance team') {
    //   return updateAssignments([value,]);
    // }

    // if (selectedAssignments.includes(value)) {
    //   assignments = selectedAssignments.filter(assignment => assignment !== value);
    // } else {
    //   assignments = [
    //     ...selectedAssignments,
    //     value
    //   ]
    // }

    // updateAssignments(assignments);
  }

  _handleGroupSelect = (value) => {
    const { assigneeGroup, setGroupAssignee, setActiveGroupAssignee, searchAssignee, originalAssigneeGroup } = this.props;

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

      setActiveGroupAssignee(filterSubGroup)
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

    setGroupAssignee(filterSubGroup)
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

      setActiveGroupAssignee(filterSubGroup)
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

    setGroupAssignee(filterSubGroup)
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   // const { assignmentOptions, selectedAssignments, selectedAction } = this.props;

  //   return !checkEqual(this.props, nextProps, 'assignmentOptions')
  //     || !checkEqual(this.props, nextProps, 'selectedAssignments')
  //     || !checkEqual(this.props, nextProps, 'selectedAction');
  // }

  onNextPage = () => {
    const { onNext, assigneeGroup } = this.props;
    const { selectedAssign, assigneeHolder } = this.state;

    const mapSelectedSubGroup = uniqBy(flatten(map(assigneeGroup, 'userSubGroup')), 'value');
    const userSubGroupIds = map(filter(mapSelectedSubGroup, ['isSelected', true]), 'value');

    const selectedAssigneeUserFromGroup = uniq(map(filter(flatten(map(mapSelectedSubGroup, 'subGroupUsers')), ['isSelected', true]), 'value'));
    const mapSoloAssignee = uniqBy(flatten(map(assigneeGroup, 'groupUsers')), 'value');
    const selectedSoloAssigneeUser = uniq(map(filter(mapSoloAssignee, ['isSelected', true]), 'value'));
    const userIds = uniq([...selectedAssigneeUserFromGroup, ...selectedSoloAssigneeUser])
    const mapAllAssigneeForGroup = map(assigneeGroup, 'groupUsers');


    let userGroupIds = [];

    map(mapAllAssigneeForGroup, function (o) {
      const mapAssigneeByGroup = map(o, 'value');

      const isAllUserInGroup = intersection(userIds, mapAssigneeByGroup).length === mapAssigneeByGroup.length;

      if (isAllUserInGroup) {
        userGroupIds.push(get(first(o), 'groupId'));
      }
    })

    const finalAssignee = compact([...userGroupIds, ...userSubGroupIds, ...userIds])
    if (isEmpty(finalAssignee)) {
      alert(`Please select ${I18n.t('base.ubiquitous.assignments')}`);
      return true;
    }

    onNext();
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


  shouldComponentUpdate(nextProps, nextState) {
    const isReRender = nextProps.isAttendantApp ? nextProps.isEmptyFinalAssignee ? 2 : 0 : 2
    if (nextProps.currentPage === isReRender) {
      return true
    }
    else {
      return false
    }
  }

  render() {
    const { assigneeGroup } = this.props;
    const list = assigneeGroup.map(k => ({ data: [k], title: k.name, key: k.value }));

    return (
      <Container>
        <BodyContainer>
          <SearchForm />

          <ListContainer>
            {assigneeGroup ? (
              <SectionList
                sections={list}
                ref={(r) => this.rootSectionRef = r}
                renderItem={({ item, index }) => this.renderAssigneeItem(get(item, 'userSubGroup', []), index, get(item, 'groupUsers', []))}
                renderSectionHeader={({ section }) => <GroupHeader row={last(get(section, 'data', {}))} onPress={this._handleGroupSelect} />}
                keyExtractor={(item, index) => `key-${index}`}
                stickySectionHeadersEnabled
              />
            ) : null}
          </ListContainer>

        </BodyContainer>

        <FooterContainer>
          <TaskButton
            label={I18n.t('base.ubiquitous.task-next')}
            buttonStyle={{ backgroundColor: themeTomato.color, borderWidth: 0 }}
            labelStyle={{ color: '#FFF' }}
            onPress={() => this.onNextPage()}
          />
        </FooterContainer>

      </Container>
    )
  }
}

export default AssignmentSelect;