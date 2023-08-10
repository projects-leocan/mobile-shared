import insertAuditTypes from "../constants/insertAudit";

export function addAudit(data){
    return{
        type: insertAuditTypes.INSERT_AUDIT,
        data
    }
}

export default {
    addAudit
}

