import { createSelector } from 'reselect';
import { getFormValues } from 'redux-form';

const auditLocation = getFormValues('auditLocation')

export const selectedLocation = createSelector(
  [auditLocation],
  (form) => {
    if (!form) {
      return null
    }
    return form.location
  }
)
