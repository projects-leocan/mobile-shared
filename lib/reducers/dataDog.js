import datadogTypes from "rc-mobile-base/lib/constants/datadog";
import { createReducer } from "reduxsauce";

const getInitialState = () => ({
    datadogTime: null,
})

const ACTION_HANDLERS = {
    [datadogTypes.ADD_TIME_FOR_DATADOG]: (state, data) => {
        return {
            ...state,
            datadogTime: data.data
        }
    },
    [datadogTypes.RESET_USER_FOR_DATADOG]: (state) => {
        return {
          ...state,
          datadogTime: null
        }
      },
};

export default createReducer(getInitialState(), ACTION_HANDLERS);
