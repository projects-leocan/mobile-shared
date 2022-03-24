import React, { Component, PureComponent } from 'react';

import {
    Container,
    ListContainer,
    ListFooter,

} from './styles';
import ListView from 'rc-mobile-base/lib/components/ListView';
import Header from './Header';
import GroupHeader from './GroupHeader';
import Item from './Item';

import { get, map, filter, omit, flatten, uniqBy, first, compact, xorBy } from 'lodash';

export default class TaskByGroupSection extends React.Component {
    constructor(props) {
        super(props);
    }

    renderSubGroupItem = (data, isExtraUser = false) => {
        const { renderHeader } = this.props;
        return (
            <ListView
                data={data}
                renderRow={(row, _, index) => <Item index={index} renderHeader={renderHeader} onPress={isExtraUser ? this._handleExtraUserSelect : this._handleUserSelect} row={row} />}
            />
        )
    }

    _handleExtraUserSelect = () => {}
    _handleUserSelect = () => {}


    renderAssigneeItem = (row, _, index, groupUsers) => {
        return (
            <>
                {get(groupUsers, 'length') > 0
                    ?
                    this.renderSubGroupItem(groupUsers, true)
                    : null
                }
                <ListView
                    data={row}
                    renderRow={(row, _, index) => this.renderSubGroupItem(get(row, 'subGroupUsers', []))}
                    // renderHeader={() => this.renderSubGroupItem(extraUser, true)}
                    renderSectionHeader={(data) => <Header row={data} onPress={this._handleSubGroupSelect} />}
                    renderFooter={() => <ListFooter />}
                    getSectionId={(data) => data}
                />

            </>
        )
    }

    _handleSubGroupSelect = () => {

    }

    _handleGroupSelect = () => {

    }

    render() {
        const { tasks } = this.props;
        return (
            <Container>
                <ListContainer>
                    <ListView
                        data={tasks}
                        renderRow={(row, _, index) => this.renderAssigneeItem(get(row, 'userSubGroup', []), _, index, get(row, 'groupUsers', []))}
                        renderSectionHeader={(data) => <GroupHeader row={data} onPress={this._handleGroupSelect} />}
                        renderFooter={() => <ListFooter />}
                        getSectionId={(data) => data}
                    />
                </ListContainer>
            </Container>
        )
    }
}