import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const buttonColor = '#EF7373';

export default class Button extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { label, onPress, isDisable } = this.props;
        return (
            <TouchableOpacity style={[styles.buttonContainer, { backgroundColor: isDisable ? `rgba(239,115,115, 0.6)` : `rgb(239,115,115)` }]} onPress={onPress}>
                <Text style={styles.labelText}>{label}</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    buttonContainer: {
        height: 50,
        width: '100%',
        backgroundColor: buttonColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    labelText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#FFF',
        fontWeight: '600'
    }

})