import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
    red,
    orange,
    flxCol,
    flx1,
    aic,
    jcc,
} from '../../styles';
import { get } from 'lodash';

export default class PriorityStatus extends React.Component {

    render() {
        const { task } = this.props;
        const isPriority = get(task, 'is_priority', false);
        const isGuestReq = get(task, 'is_guest_request', false);
        if (isGuestReq || isPriority) {
            return (
                <View style={[flxCol, flx1, aic, jcc]}>
                    <Icon
                        name="star"
                        color={isGuestReq ? red.color : orange.color}
                        size={25}
                        style={{ marginRight: 8 }}
                    />
                </View>
            )
        } else {
            return null
        }

    }
}