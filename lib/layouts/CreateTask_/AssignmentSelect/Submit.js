import React, { Component } from 'react';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  SubmitButton,
  SubmitButtonDisabled,
  SubmitLabel
} from './styles';

import {
  blueLt
} from 'rc-mobile-base/lib/styles';

const Submit = ({ assignments, onPress }) => {
    if (!assignments || !assignments.length) {
        return (
            <SubmitButtonDisabled>
                <SubmitLabel>{ I18n.t('maintenance.createtask.assignment.missing-assignment').toUpperCase() }</SubmitLabel>
            </SubmitButtonDisabled>
        )
    }

    return (
        <SubmitButton onPress={onPress}>
            <SubmitLabel>{ I18n.t('base.ubiquitous.continue').toUpperCase() }</SubmitLabel>
        </SubmitButton>
    )
}

export default Submit;