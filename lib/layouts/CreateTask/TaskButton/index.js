import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from './styles'


export default class TaskButton extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { label, onPress } = this.props;
        return(
            <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
                <Text style={styles.labelText}>{label}</Text>
            </TouchableOpacity>
        )
    }
}