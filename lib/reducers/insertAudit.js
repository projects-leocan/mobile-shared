import audit from "rc-mobile-base/lib/models/audit";
import insertAuditTypes from "../constants/insertAudit"
import { createReducer } from 'reduxsauce';

const getInitialState = () => ({
    auditInsert: []
});

const ACTION_HANDLERS = {
    [insertAuditTypes.INSERT_AUDIT]: (state, { data }) => {

        const checkWeatherAlreadyIdorNot = state?.auditInsert?.some((d) => d?.id === data?.id)
        let objectValue = []
        if (checkWeatherAlreadyIdorNot) {
            objectValue =  state.auditInsert.map((audit) => {
                return (
                    audit.id === data.id ?  data : audit
                )
            })


        }
        else {
            objectValue = [...state.auditInsert, data]
        }


        return {
            ...state,
            auditInsert: objectValue
        }
    },
}

export default createReducer(getInitialState(), ACTION_HANDLERS);
