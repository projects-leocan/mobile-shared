import { filter, get, map } from 'lodash';
import React, { useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import {
    CheckBoxRootContainer,
    CheckBoxContentContainer,
    CheckBoxText
} from './styles';

import { splashBg } from 'rc-mobile-base/lib/styles/colors';

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
        const mapOption = map(options, function (obj) {
            return { ...obj, isSelected: get(obj, 'defaultSelection', false) ? true : false }
        })
        const [responseArray, setResponseArray] = useState(mapOption);

        const onCheckValue = (option) => {
            const mapOption = map(responseArray, function (obj) {
                return { ...obj, isSelected: obj === option ? !(get(obj, 'isSelected', false)) : get(obj, 'isSelected', false) }
            })
            onChange({ value: map(filter(mapOption, 'isSelected'), 'input'), label: get(option, 'input', '')})
            setResponseArray(mapOption)
        }

        return (
            <CheckBoxRootContainer {...props}>
                {responseArray.map((option, index) => {
                    return (
                        <CheckBoxContentContainer onPress={() => onCheckValue(option)} >
                            {get(option, 'isSelected', false)
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
