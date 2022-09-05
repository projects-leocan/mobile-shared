import { get } from 'lodash';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import {
    CheckBoxRootContainer,
    CheckBoxContentContainer,
    CheckBoxText
} from './styles';

import { splashBg } from 'rc-mobile-base/lib/styles/colors';

export default CheckBox = ({ responseFormArray: options, value, onChange, ...props }) => options && options.length > 0 ? (
    <CheckBoxRootContainer {...props}>
        {options.map((option, index) => {
            return (
                <CheckBoxContentContainer>
                    {get(option, 'defaultSelection', false)
                        ? <MaterialIcons name='check-box' size={30} color={splashBg.bg} />
                        : <MaterialIcons name='check-box-outline-blank' size={30} color={splashBg.bg} />
                    }
                    <CheckBoxText>{get(option, 'input', '')}</CheckBoxText>
                </CheckBoxContentContainer>
            )
        })
        }
    </CheckBoxRootContainer>
) : null