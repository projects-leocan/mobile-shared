import { filter, get, map } from 'lodash';
import React, { useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import {
    CheckBoxRootContainer,
    CheckBoxContentContainer,
    CheckBoxText
} from './styles';

import { splashBg } from 'rc-mobile-base/lib/styles/colors';
import {useEffect} from "react"

// export default CheckBox = ({ responseFormArray: options, value, onChange, ...props }) => options && options.length > 0 ? (
//     <CheckBoxRootContainer {...props}>
//         {options.map((option, index) => {
//             return (
//                 <CheckBoxContentContainer>
//                     {get(option, 'defaultSelection', false)
//                         ? <MaterialIcons name='check-box' size={30} color={splashBg.bg} />
//                         : <MaterialIcons name='check-box-outline-blank' size={30} color={splashBg.bg} />
//                     }
//                     <CheckBoxText>{get(option, 'input', '')}</CheckBoxText>
//                 </CheckBoxContentContainer>
//             )
//         })
//         }
//     </CheckBoxRootContainer>
// ) : null

export default CheckBox = ({ responseFormArray: options, value, onChange, ...props }) => {
    if (options && options.length > 0) {
        //set answer value based on default selection
        const mapOption = map(options, function (obj) {
            // return { ...obj, answerResultSelected: get(obj, 'defaultSelection', false) ? true : false }
            return { ...obj, answerResultSelected: obj.defaultSelection === 'false' ? false : true }
        })
        const [responseArray, setResponseArray] = useState(mapOption);

        const onCheckValue = (option) => {
            //set answer value based on user selection
            const mapOption = map(responseArray, function (obj) {
                return { ...obj, answerResultSelected: obj === option ? !(get(obj, 'answerResultSelected', false)) : get(obj, 'answerResultSelected', false) }
            })
            // onChange({ value: map(filter(mapOption, 'answerResultSelected'), 'input'), label: get(option, 'input', '')})
            onChange(mapOption)
            setResponseArray(mapOption)
        }

        //send default and selected answer to api request
        useEffect(() => {
            onChange(responseArray)
          }, [responseArray])

        return (
            <CheckBoxRootContainer {...props}>
                {responseArray.map((option, index) => {
                    return (
                        <CheckBoxContentContainer onPress={() => onCheckValue(option)} >
                            {get(option, 'answerResultSelected', false)
                                ? <MaterialIcons name='check-box' size={30} color={splashBg.bg} />
                                : <MaterialIcons name='check-box-outline-blank' size={30} color={splashBg.bg} />
                            }
                            <CheckBoxText>{get(option, 'input', '')}</CheckBoxText>
                        </CheckBoxContentContainer>
                    )
                })
                }
            </CheckBoxRootContainer>
        )
    } else {
        return null
    }
}
