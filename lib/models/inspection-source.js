import { put, call } from 'redux-saga/effects';
import { createSelector } from 'reselect';
// import { Resource } from 'rc-react-shared/utils';
import { Resource } from 'rc-mobile-base/lib/utils/redux-tools';
import { authRequest } from 'rc-mobile-base/lib/utils/request';

import { computedAssetsIndex } from '../selectors/assets';

const API_URL = `/inspection_sources`

const parseDefaultAnswer = (inspection) => {
  const kind = inspection.kind
  const defaultAnswer = inspection.default_answer
  if (!defaultAnswer) {
    return;
  }
  if (kind === 'trueFalse') {
    return Boolean(defaultAnswer)
  }
  if (kind === 'range' || kind === 'rating') {
    return Number(defaultAnswer)
  }
  if (kind === 'multiTrueFalse') {
    return JSON.parse(defaultAnswer)
  }
  return defaultAnswer
}

const normalizeOne = (inspection) => {
  const defaultAnswer = parseDefaultAnswer(inspection)

  return {
    ...inspection,
    defaultAnswer,
  }
}

class InspectionSource extends Resource {
  id = '_id'
  name = 'inspection_source'

  onLoad = function * () {
    try {
      const response = yield call(authRequest, API_URL);
      return yield put(this.actions.load.success(this.normalize(response.inspection_sources.map(normalizeOne))));
    } catch (error) {
      return yield put(this.actions.load.failure(error));
    }
  }.bind(this)

  all = () => {
    const all = this.selectors.all()
    return createSelector(
      [all, computedAssetsIndex],
      (inspections, assets) => {
        return inspections.map(i => ({
          ...i,
          hotAnswers: i.hot_answers.map(a => {
            const asset = assets[a.assetId]
            return {
              ...a,
              asset,
              action: asset && asset.customActions && asset.customActions.find(action => action.id === a.actionId),
            }
          })
        }))
      }
    )
  }
}

export default new InspectionSource({ name: 'inspection_source', id: '_id' })
