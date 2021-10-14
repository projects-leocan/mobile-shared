import RNFS from 'react-native-fs';
import Manager from '../manager';

const upload = async (path, apiUrl, params = {}) => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: `file:///${path}`,
      name: 'rn.log',
      type: 'text/plain',
    });
    Object.keys(params).forEach(param => {
      formData.append(param, params[param])
    })

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data;',
      },
      body: formData,
    });

    return response
  } catch(err) {
    return null
  }
}

class FileManager extends Manager {
  constructor(params) {
    super(params)

    const { apiUrl, filename = 'rn.log' } = params
    this.apiUrl = apiUrl
    this.filename = filename
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

  async upload(params = {}) {
    const response = await upload(this.path, this.apiUrl, params)
    return response
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
