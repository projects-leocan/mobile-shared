import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
} from 'react-native';
import {
    grey400,
    white,
    splashBg,
} from 'rc-mobile-base/lib/styles';
import { get } from 'lodash';
import moment from 'moment';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default class TaskMessageChat extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    renderDate = (date) => {
        return (
            <Text style={styles.time}>
                {/* {moment(date).format('dddd, D MMM YYYY, HH:mm')} */}
                {moment(date).format('HH:mm A')}
            </Text>
        );
    }

    render() {
        const { taskMessages, user } = this.props;
        const loginUserId = get(user, 'id', null);

        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollContainer} nestedScrollEnabled={true} showsVerticalScrollIndicator={false} >
                {taskMessages.map((item, index) => {
                    const isOwnMessage = get(item, 'user_id', null) === loginUserId;
                    const fname = get(item, 'user.first_name', '');
                    const lname = get(item, 'user.last_name', '');

                    const userProfileImage = get(item, 'user.image', null);
                    const itemStyle = !isOwnMessage ? styles.itemIn : styles.itemOut;

                    return (
                        <View key={index.toString()} style={[styles.rootCellView, itemStyle]}>
                            {!isOwnMessage && (
                                <View style={styles.userProfileContainer}>
                                    {userProfileImage
                                        ?
                                        <Image
                                            source={{ uri: userProfileImage }}
                                            style={styles.userProfileImage}
                                        />
                                        :
                                        <Text>{fname.toUpperCase()[0]}{lname.toUpperCase()[0]}</Text>
                                }

                                </View>
                            )}

                            <View>
                                {!isOwnMessage ?
                                    <View>
                                        <View style={[styles.item, itemStyle]}>
                                            <View style={[styles.balloon]}>
                                                <Text>{item.message}</Text>
                                            </View>
                                            {this.renderDate(item.date_ts)}
                                        </View>
                                    </View>
                                    :
                                    <View>
                                        <View style={[styles.item, itemStyle, splashBg.bg]}>
                                            <View style={[styles.balloon]}>
                                                <Text style={white.text}>{item.message}</Text>
                                            </View>
                                            {this.renderDate(item.date_ts)}
                                        </View>
                                    </View>
                                }
                            </View>
                        </View>

                    )
                })}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 18,
        maxHeight: hp('40%')
    },
    scrollContainer: {
        flexGrow: 1
    },
    rootCellView: {
        flexDirection: 'row'
    },
    userProfileContainer: {
        height: 50,
        width: 50,
        borderRadius: 25,
        marginRight: 12,
        backgroundColor: grey400.color,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center'
    },
    userProfileImage: {
        height: 50,
        width: 50,
        resizeMode: 'cover',
        alignSelf: 'center'
    },
    item: {
        marginBottom: 10,
        flex: 1,
        backgroundColor: "#eeeeee",
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    balloon: {
        maxWidth: 250,
        padding: 15,
        paddingBottom: 5,
        borderRadius: 20,
    },
    itemIn: {
        alignSelf: 'flex-start'
    },
    itemOut: {
        alignSelf: 'flex-end'
    },
    time: {
        fontSize: 12,
        color: "#808080",
        paddingHorizontal: 15,
        paddingBottom: 8
    }
}); 