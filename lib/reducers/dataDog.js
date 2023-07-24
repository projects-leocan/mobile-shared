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
};

export default createReducer(getInitialState(), ACTION_HANDLERS);
