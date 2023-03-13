import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import PagerView from 'react-native-pager-view';
import React from 'react';
import { ModalPreview } from 'rc-mobile-base/lib/components/Audits/Audit/Actions/styles';
import Encrypto from "react-native-vector-icons/Entypo"


function ImagePreview({ data, onClickRemoveImage }) {
    const renderPagerData = (item, index) => {
        return (
            <View style={{ width: "100%", height: "100%",justifyContent: "center", alignItems: "center" }} >
                <Image
                    style={{ position: "relative", width: "90%", height: "90%" }}
                    source={{ uri: item.value }}
                />
                <TouchableOpacity
                    onPress={() => onClickRemoveImage(item)}
                    style={{ position: 'absolute', right: 5, top: 5 }}>
                    <Encrypto name='cross' size={30} color="#900" />
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <>
            <PagerView style={{ flex: 1, justifyContent: "center", alignItems: "center" , display:'flex' }} initialPage={0}>
                {/* <FlatList
                    data={[data]}
                    renderItem={renderPagerData}
                /> */}
                {data.map((page, index) => renderPagerData(page, index))}
            </PagerView>
        </>
    )
}

export default ImagePreview