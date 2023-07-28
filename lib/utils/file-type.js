import { request, parseJSON } from 'rc-mobile-base/lib/utils/request';
import RNFetchBlob from 'rn-fetch-blob'
import { createThumbnail } from "react-native-create-thumbnail";

export const validateFileType = async (uri) => {
    // const fetchFile = fetch(uri).then(res => {
    // })
    let response

    await RNFetchBlob.fetch('GET', uri, {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    })
        .then((res) => {
            response = res.json();
        })
        .catch((errorMessage, statusCode) => {
            response = null;
            console.log("Service issue:", errorMessage)
        })
    // return response
    // return fetchFile
}

export const generateThumbnailFromVideo = async (videoData) => {
    try {
    const data = await createThumbnail({
        url: videoData,
        timeStamp: 10000,
    })
        .then((response) => { return response?.path })
        .catch((err) => { return '' })
    return data
}
catch(er) {
}
}