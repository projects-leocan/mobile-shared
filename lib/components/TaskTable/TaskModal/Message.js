import React from 'react';
import { View, Image, Text } from 'react-native';

import { get } from 'lodash/object';
import {
    flxRow,
    margin,
    padding,
    aic,
    grey400,
    slate
} from 'rc-mobile-base/lib/styles';
import { unixPrettyDate } from 'rc-mobile-base/lib/utils/dates';

const Message = ({ message, indexUsers }) => (
    <View style={[flxRow, margin.b10]}>
        { get(indexUsers, [message.user_id, 'image']) ?
            <Image
                source={{ uri: get(indexUsers, [message.user_id, 'thumbnail']) || get(indexUsers, [message.user_id, 'image'], '')}}
                style={{ height: 40, width: 40, borderRadius: 20, ...margin.r10 }}
                />
            :
            <View style={[{ height: 40, width: 40, borderRadius: 20 }, margin.r10, grey400.bg]}>
                <Text style={[slate.text, { fontSize: 20 }]}>{ get(indexUsers, [message.user_id, 'first_name', 0], '').toUpperCase() }</Text>
            </View>
        }
        <View style={[padding.t5]}>
            <Text style={[slate.text, { fontSize: 17 }]}>{ message.message }</Text>
            <Text style={[slate.text, { fontSize: 15, opacity: .8 }]}>{ unixPrettyDate(message.date_ts) }</Text>
        </View>
    </View>    
);

export default Message;