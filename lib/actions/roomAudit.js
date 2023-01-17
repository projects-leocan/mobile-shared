import RoomAuditTypes from '../constants/roomAudit';


export function insertAuditRouteSucess({ data }) {
  return {
    type: RoomAuditTypes.INSERT_AUDIT_ROUTE_SUCCESS,
    data
  }
}

export function insertAuditRouteSucessFailure(error) {
  return {
    type: RoomAuditTypes.INSERT_AUDIT_ROUTE_FAILURE,
    error
  }
}

export default {
    insertAuditRouteSucess,
    insertAuditRouteSucessFailure
}
