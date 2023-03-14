import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import PagerView from 'react-native-pager-view';
import React from 'react';
import { ModalPreview } from 'rc-mobile-base/lib/components/Audits/Audit/Actions/styles';
import Encrypto from "react-native-vector-icons/Entypo"


function ImagePreview({ data, onClickRemoveImage, activeIndex }) {
    const renderPagerData = (item, index) => {
        return (
            <View style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }} >
                <Image
                    style={{ position: "relative", width: "95%", height: "95%" }}
                    source={{ uri: item.value }}
                />
                <TouchableOpacity
                    onPress={() => onClickRemoveImage(item)}
                    style={{ position: 'absolute', right: 14, top: 15, backgroundColor: "#2185d0", borderRadius: 20 }}>
                    <Encrypto name='cross' size={30} color="#fff" />
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <>
            <PagerView style={{ flex: 1, justifyContent: "center", alignItems: "center", display: 'flex' }} initialPage={data.length - 1}>
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