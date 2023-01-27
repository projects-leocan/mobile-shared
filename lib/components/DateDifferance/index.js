import { useEffect } from "react"
import React from "react";
import moment from "moment";
import { useState } from "react";
import { Text } from "react-native";
import TimeAgo from "rc-mobile-base/lib/components/TaskRow/TimeAgo";
import {
    greyDk,
    margin,
    red,
    text
} from 'rc-mobile-base/lib/styles';

function DateDifferance({ created_at, start_at , fontSize , color}) {

    const [minutes, setMinutes] = useState(0)

    useEffect(() => {
        const differenceInMinutes = moment(start_at).diff(created_at, 'minutes');
        setMinutes(differenceInMinutes)
    }, [])

    return (
        <>
            {
                minutes > 2 ?
                    minutes < 60 ?
                        <Text style={[ margin.r10, { fontSize: fontSize?fontSize:12 , color: color?color:'red' }]}>
                          In {moment(start_at).diff(created_at, 'minutes')} min
                        </Text>
                        :
                        <Text style={[red, margin.r10, { fontSize: fontSize?fontSize:12, color: color?color:'red'}]}>
                            For {moment(start_at).format('h:mm a')}
                        </Text>
                    :
                    null
            }


        </>
    )
}

export default DateDifferance