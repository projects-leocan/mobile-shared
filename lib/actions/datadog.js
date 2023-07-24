import dataDogTypes from '../constants/datadog';

export function addTimeForDataDog(data) {
  return {
    type: dataDogTypes.ADD_TIME_FOR_DATADOG,
    data
  }
}

export function dataDogReset(){
  return{
    type: dataDogTypes.RESET_USER_FOR_DATADOG
  }
}

export default {
    addTimeForDataDog,dataDogReset
}
