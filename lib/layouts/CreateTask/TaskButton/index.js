import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from './styles'


export default class TaskButton extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { label, buttonStyle, labelStyle, onPress } = this.props;
        return(
            <TouchableOpacity style={[styles.buttonContainer, buttonStyle]} onPress={onPress}>
                <Text style={[styles.labelText, labelStyle]} adjustsFontSizeToFit>{label}</Text>
            </TouchableOpacity>
        )
    }
}