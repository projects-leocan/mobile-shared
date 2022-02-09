import React from 'react';
import { Text, View } from 'react-native';
import styles from './styles';

export default class SafeAreaHeader extends React.Component {
    constructor(props) {
        super(props);

    }

    onBackButton = (props) => {
        const { navigation } = this.props;
        navigation.goBack();
    }

    render() {
        return (
            <View style={styles.headerContainer}>
            </View>
        )
    }
}