import { createReducer } from 'reduxsauce';

import RoomAuditTypes from '../constants/roomAudit';
import OutboundTypes from '../constants/outbound';
import UpdateTypes from '../constants/updates'
import {auditTasksFetch} from '../actions/rooms'

const getInitialState = () => ({
  insertAuditRouteId: null,
  insertAuditRouteError: null,
  insertAuditTask: null
})

const ACTION_HANDLERS = {
  [OutboundTypes.OUTBOUND_CREATE_AUDIT_INSERT_ROUTE_SUCESS]: (state, {payload: {data}, meta}) => {
    return {
      ...state,
      insertAuditRouteId: data,
      insertAuditTask: {meta: meta, data: data}
    }
  },
  [UpdateTypes.TASK_REMOVE_AUDIT_META]: (state) => {
    return {
      ...state,
      insertAuditTask: null
    }
  },
  [OutboundTypes.OUTBOUND_CREATE_AUDIT_INSERT_ROUTE_FAILURE]: (state, error) => {
    return {
      ...state,
      insertAuditRouteError: JSON.stringify(error),
    }
  },
};

export default createReducer(getInitialState(), ACTION_HANDLERS);
