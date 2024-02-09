import React from 'react';
import { Image, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text } from 'react-native';
import {
    red,
    orange,
    flxCol,
    flx1,
    aic,
    jcc,
} from '../../styles';
import { get } from 'lodash';

export default class VerfiedTasks extends React.Component {

    render() {
        const { task } = this.props;
        const is_verified = get(task, 'is_verified', false);
        return (
            <View style={[flxCol, flx1, aic, jcc]}>
                {is_verified
                    ?
                    <View style={{paddingHorizontal:5,paddingVertical:2, borderColor:"#C545B6", borderRadius:5, borderWidth: 2}}>
                        <Text style={{color:"#C545B6", fontWeight:"600", fontSize:10}}>VERIFIED</Text>
                    </View>
                    : null
                }

            </View>
        )

    }
}