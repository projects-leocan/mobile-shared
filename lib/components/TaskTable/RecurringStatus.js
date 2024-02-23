import React from 'react';
import { Image, View } from 'react-native';
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

export default class RecurringStatus extends React.Component {

    render() {
        const { task } = this.props;
        const typeKey = get(task, 'typeKey', null);
        return (
            <View style={[flxCol, flx1, aic, jcc]}>
                {typeKey === "RECURRING"
                    ?
                    <Image style={{height:30,width:30}} resizeMode='contain' source={require("../../images/Recurring.png")}/>
                    : null
                }

            </View>
        )

    }
}