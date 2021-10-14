import { get } from 'lodash';

export const updateOptions = [
  { value: 'open', translation: 'base.lost-found-review.index.open', icon: 'folder-open-o' },

  { value: 'emailed', translation: 'base.lost-found-review.index.emailed', icon: 'share' },
  { value: 'phoned', translation: 'base.lost-found-review.index.phoned', icon: 'phone' },
  { value: 'pending', translation: 'base.lost-found-review.index.pending', icon: 'user-circle-o' },
  { value: 'holding', translation: 'base.lost-found-review.index.holding', icon: 'pause-circle-o' },
  { value: 'reception', translation: 'base.lost-found-review.index.reception', icon: 'pause-circle-o' },

  { value: 'mailed', translation: 'base.lost-found-review.index.mailed', icon: 'truck' },
  { value: 'hand-delivered', translation: 'base.lost-found-review.index.hand-delivered', icon: 'edit'  },

  { value: 'expired', translation: 'base.lost-found-review.index.expired', icon: 'calendar' },
  { value: 'refused', translation: 'base.lost-found-review.index.refused', icon: 'ban' },
  { value: 'delete', translation: 'base.lost-found-review.index.delete', icon: 'trash' },
  { value: 'holding-lt', translation: 'base.lost-found-review.index.holding-lt', icon: 'check' },
]

const updateOptionsMap = updateOptions.reduce((pv, i) => {
  pv[i.value] = i.translation;
  return pv;
}, {});

export const updateOptionsLookup = (value) => get(updateOptionsMap, value, "");