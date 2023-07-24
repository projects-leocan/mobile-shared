import RNFS from 'react-native-fs';
// import Manager from '../manager';
import DataDog from 'rc-mobile-base/lib/utils/dataDog';
import { Component } from 'react';
import moment from 'moment';

import uuid from "uuid/v4"

export const writeFileIntoLocal = (data) => {
    const data1 = { MessageStatus: { id: uuid(), date: moment.utc(new Date()), level: "info", ...data, levelCode: "I" } }
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
