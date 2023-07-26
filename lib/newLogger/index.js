import RNFS from 'react-native-fs';
// import Manager from '../manager';
import DataDog from 'rc-mobile-base/lib/utils/dataDog';
import { Component } from 'react';
import moment from 'moment';

import { reduxOfflineActions } from 'rc-mobile-base/lib/newLogger/constantActions';
import _ from "lodash"

export const parseBodyFunction = (options) => {
    try {
        return JSON.parse(options?.body)
    }
    catch (err) {
        return options?.body
    }
}

export const createObjectForAddDataInDataDogApiCall = (endpoint, apiCallStatus, options, response) => {
    const parseOption = parseBodyFunction(options)


    let finalObject = {
        endpoint,
        apiCallSuccess: apiCallStatus,
        requestPayload: apiCallStatus === null && options?.body && options?.method && { body: parseOption, method: options?.method },
    }

    const responseLogForApiCallTaskApiForSpecificTask = endpoint.endsWith("/Task/GetListOfTasks") && apiCallStatus === true && !_.isEmpty(parseOption?.taskIds)
    const responseLogForApiCallCleaningApi = endpoint.endsWith("/Cleaning/GetListOfCleanings") && apiCallStatus === true
    const responseLogForApiCallHousekeepingApi = endpoint.endsWith("/Room/GetListOfRoomHousekeepings") && apiCallStatus === true

    if (responseLogForApiCallTaskApiForSpecificTask || responseLogForApiCallCleaningApi || responseLogForApiCallHousekeepingApi) {
        finalObject = {
            ...finalObject,
            response: response
        }
    }
    return finalObject
}

export const specificActionMiddleware = store => next => action => {
    if (reduxOfflineActions.includes(action.type)) {
        if (action?.meta?.offline?.effect) {
            const sendObjectToDatadog = {
                endpoint: `https://hopr.roomchecking.com/mobile-api${action?.meta?.offline?.effect?.url}`,
                success: null,
                request: action?.meta?.offline?.effect?.options
            }
            writeFileIntoLocal(createObjectForAddDataInDataDogApiCall(sendObjectToDatadog.endpoint, sendObjectToDatadog.success, sendObjectToDatadog.request))
        }
        else {
            const sendObjectToDatadog = {
                endpoint: action?.meta?.endpoint,
                success: action?.meta?.success
            }
            writeFileIntoLocal(createObjectForAddDataInDataDogApiCall(sendObjectToDatadog.endpoint, sendObjectToDatadog.success))

        }
    }
    return next(action)
}

export const writeFileIntoLocal = (data) => {
    const data1 =
    {
        MessageStatus:
        {
            date: moment.utc(new Date()),
            level: data?.MessageStatus?.apiCallSuccess === false ? "error" : data?.MessageStatus?.apiCallSuccess === true ? "succes" : "info",
            ...data,
            levelCode: data?.MessageStatus?.apiCallSuccess === false ? "E" : data?.MessageStatus?.apiCallSuccess === true ? "S" : "I"
        }
    }
    const fileManager = new FileManager()
    const stringifyData = JSON.stringify(data1)
    RNFS.write(fileManager.path, `${stringifyData}\r\n`, -1, 'utf8')
}

const uploadDataOnDatadog = (userInfo) => {

}

export const initializeDataDog = async (userInfo) => {
    await uploadDataOnDatadog(userInfo)
    // await this.remove()
}

class FileManager {
    constructor() {
        const apiUrl = 'http://staging.mobile-logs.roomchecking.com/api/v1/mobile_logs'
        const filename = 'rn.log'
        this.apiUrl = apiUrl
        this.filename = filename
        this.dataDog = new DataDog();

    }

    get filename() {
        return this._filename || 'rn.log'
    }

    set filename(name) {
        this._filename = name
    }

    get path() {
        return `${RNFS.DocumentDirectoryPath}/${this.filename}`
    }

    write(level, message) {
        return RNFS.write(this.path, `${message}\r\n`, -1, 'utf8')
    }

    async readLogFile() {
        try {
            const path = this.path;
            const contents = await RNFS.readFile(path, "utf8");
            const words = contents.split('\r\n');
            words.pop()

            words.forEach(element => {
                this.dataDog.sendLogtoDD(element);
            });

            // return ("" + contents);
        } catch (e) {
            console.log(e)
        }
    }

    async upload(params = {}) {
        const isUserSet = await this.dataDog.setUserToDD(params);
        if (isUserSet) {
            this.readLogFile()
        }
        // const response = await upload(this.path, this.apiUrl, params)
        // return response
    }

    remove() {
        return RNFS.unlink(this.path)
    }

    async sync(params = {}) {
        await this.upload(params)
        await this.remove()
    }
}

export default FileManager
