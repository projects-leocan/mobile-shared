import { request, parseJSON } from 'rc-mobile-base/lib/utils/request';
import RNFetchBlob from 'rn-fetch-blob'

export const validateFileType = async (uri) => {
    // const fetchFile = fetch(uri).then(res => {
    //     console.log('--- validateFileType ---');
    //     console.log(res)
    //     console.log(JSON.parse(res))
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
        console.log('--- validateFileType ---');
        console.log(response)
    // return response
    // return fetchFile
}
