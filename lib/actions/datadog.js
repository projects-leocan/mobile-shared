import dataDogTypes from '../constants/datadog';

export function addTimeForDataDog(data) {
  return {
    type: dataDogTypes.ADD_TIME_FOR_DATADOG,
    data
  }
}

export default {
    addTimeForDataDog,
}
