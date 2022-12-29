import { createReducer } from 'reduxsauce';

import RoomAuditTypes from '../constants/roomAudit';
import OutboundTypes from '../constants/outbound';

const getInitialState = () => ({
  insertAuditRouteId: null,
  insertAuditRouteError: null,
})

const ACTION_HANDLERS = {
  [OutboundTypes.OUTBOUND_CREATE_AUDIT_INSERT_ROUTE_SUCESS]: (state, {payload: {data}}) => {
    return {
      ...state,
      insertAuditRouteId: data
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
