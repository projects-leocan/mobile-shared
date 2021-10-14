import { put, call } from 'redux-saga/effects';
// import { Resource } from 'rc-react-shared/utils';
import { Resource } from 'rc-mobile-base/lib/utils/redux-tools';
import { authRequest, request } from 'rc-mobile-base/lib/utils/request';
import { omit, isArray, get, isString } from 'lodash';

const API_URL = `/inspections`
// const IMAGE_API_URL = 'https://upload.roomchecking.com/image-upload'
const IMAGE_UPLOAD_API = 'https://www.filestackapi.com/api/store/S3?key=AwMlkjOdcTp2fmqSd0KPDz';

const normalizeOne = (inspection) => {
  let result = inspection
  const kind = inspection.question_kind

  result = {
    ...result,
    submitTasks: result.submit_tasks ? JSON.parse(result.submit_tasks) : []
  }

  if (kind === 'trueFalse') {
    return {
      ...result,
      answer: Boolean(Number(inspection.answer))
    }
  }
  if (kind === 'range') {
    return {
      ...result,
      answer: Number(inspection.answer)
    }
  }
  if (kind === 'multiTrueFalse') {
    return {
      ...result,
      answer: JSON.parse(inspection.answer)
    }
  }
  return result
}

const serializeOne = (inspection, options = {}) => {
  let result = inspection
  const kind = inspection.question_kind

  const hotAnswers = (inspection.hotAnswers || []).filter(answer => {
    const conditionLabel = get(answer, 'condition.label');
    const valueLabel = get(inspection, 'answer_label');
    
    if (!conditionLabel || !valueLabel) {
      return false;
    }

    return conditionLabel === valueLabel;
  });

  const submitTasks = hotAnswers.filter(answer => {
    const conditionLabel = get(answer, 'condition.label');
    const valueLabel = get(inspection, 'answer_label');

    if (!get(inspection.submitTasks, conditionLabel, false)) {
      return false;
    }

    if (!answer.asset) {
      return false;
    }

    return true;
  })

  const score = (inspection.scores || []).reduce((pv, item) => {
    const conditionLabel = String(get(item, 'condition.label'));
    const valueLabel = String(get(inspection, 'answer_label'));
    
    if (!conditionLabel || !valueLabel) {
      return pv;
    }

    if (conditionLabel === valueLabel) {
      let clean = item.score;
      
      if (isString(clean)) {
        clean = clean
          .replace('+', '')
          .replace(' ', '')
          .replace(',', '.');
      }
      
      pv = Number(clean);
    }
    return pv
  }, 0);

  const isHot = !!(hotAnswers && hotAnswers.length);

  result = {
    ...result,
    // submit_tasks: result.is_hot ? JSON.stringify(result.submitTasks) : JSON.stringify([]),
    submit_tasks: JSON.stringify(submitTasks),
    score,
    is_hot: isHot
  }

  result = omit(result, ['submitTasks', 'hotAnswers', 'scores'])

  if (kind === 'multiTrueFalse') {
    result = {
      ...result,
      answer: JSON.stringify(inspection.answer)
    }
  }
  if (options.skipId) {
    return omit(result, 'id', 'submitTasks')
  }
  return omit(result, 'submitTasks')
}

const uploadPhoto = function * (path) {
  try {
    const formData = new FormData();
    formData.append('fileUpload', {
      uri: path,
      name: 'photo.jpg',
      type: 'image/jpg'
    });

    const response = yield call(request, `${IMAGE_UPLOAD_API}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data;',
      },
      body: formData,
    });

    return response.url
  } catch(error) {
    console.log(error)
    return null
  }
}

const checkIfNeedToUploadPhoto = (data) => {
  const photo = data.photo
  return photo && !photo.match(/filepicker|filestack/)
}

class Inspection extends Resource {
  name = 'inspection'

  onLoad = function * () {
    try {
      const response = yield call(authRequest, `${API_URL}?mobile=true`);
      return yield put(this.actions.load.success(this.normalize(response.inspections)));
    } catch (error) {
      return yield put(this.actions.load.failure(error));
    }
  }.bind(this)

  onInsertAll = function * ({ payload }) {
    try {
      const data = payload;
      let results = [];
      
      for (const entry of data) {
        if (checkIfNeedToUploadPhoto(entry)) {
          const photoUrl = yield call(uploadPhoto, entry.photo);
          results.push({
            ...entry,
            photo: photoUrl
          });
        } else {
          results.push(entry);
        }
      }

      const response = yield call(authRequest, `${API_URL}/bulk_create`, {
        method: 'POST',
        body: JSON.stringify({
          inspections: results.map(inspection => serializeOne(inspection, { skipId: true }))
        })
      });

      const result = yield put(this.actions.insertAll.success(this.normalize(response.inspections)));
      return result
    } catch (error) {
      console.log(error);
      return yield put(this.actions.insertAll.failure(error));
    }
  }.bind(this)

  onUpdateAll = function * ({ payload }) {
    try {
      const data = payload
      let results = [];
      
      for (const entry of data) {
        if (checkIfNeedToUploadPhoto(entry)) {
          const photoUrl = yield call(uploadPhoto, entry.photo);
          results.push({
            ...entry,
            photo: photoUrl
          });
        } else {
          results.push(entry);
        }
      }
      
      const response = yield call(authRequest, `${API_URL}/bulk_update`, {
        method: 'PUT',
        body: JSON.stringify({
          inspections: results.map(serializeOne)
        })
      });
      const result = yield put(this.actions.updateAll.success(this.normalize(response.inspections)));
      return result
    } catch (error) {
      return yield put(this.actions.updateAll.failure(error));
    }
  }.bind(this)

  onUpdate = function * ({ payload }) {
    try {
      const data = payload

      if (checkIfNeedToUploadPhoto(data)) {
        data.photo = yield call(uploadPhoto, data.photo)
      }

      const response = yield call(authRequest, `${API_URL}/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          inspection: serializeOne(data)
        })
      });
      const result = yield put(this.actions.update.success(response.inspection));
      return result
    } catch (error) {
      return yield put(this.actions.update.failure(error));
    }
  }.bind(this)

  onInsert = function * ({ payload }) {
    try {
      const data = payload

      if (checkIfNeedToUploadPhoto(data)) {
        data.photo = yield call(uploadPhoto, data.photo)
      }

      const response = yield call(authRequest, `${API_URL}`, {
        method: 'POST',
        body: JSON.stringify({
          inspection: serializeOne(data, { skipId: true })
        })
      });
      const result = yield put(this.actions.insert.success(response.inspection));
      return result
    } catch (error) {
      return yield put(this.actions.insert.failure(error));
    }
  }.bind(this)
}

const inspection = new Inspection({name: 'inspection'});

inspection.normalizeOne = normalizeOne
inspection.serializeOne = serializeOne

export default inspection;
