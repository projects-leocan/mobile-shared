import Immutable from 'seamless-immutable';
import omit from 'lodash/omit';

const buildReducerImmutable = (types, id) => {
  const initialState = Immutable({
    items: {},
    inserting: false,
    deleting: false,
    loading: false,
    updating: false,
  });

  const handlers = {
    [types.load.tap]: (state, { payload }) => {
      return state.set('loading', true);
    },
    [types.load.success]: (state, { payload }) => {
      return state.set('items', payload).set('loading', false);
    },
    [types.load.failure]: (state) => {
      return state.set('loading', false);
    },
    [types.update.tap]: (state) => {
      return state.set('updating', true);
    },
    [types.update.success]: (state, { payload }) => {
      return state.updateIn(['items', payload[id]], (item) => item.merge(payload)).set('updating', false)
    },
    [types.update.failure]: (state, { payload }) => {
      return state.set('updating', true)
    },
    [types.updateAll.tap]: (state) => {
      return state.set('updating', true);
    },
    [types.updateAll.success]: (state, { payload }) => {
      return state.update('items', (items) => items.merge(payload)).set('updating', false)
    },
    [types.updateAll.failure]: (state, { payload }) => {
      return state.set('updating', false)
    },
    [types.insert.tap]: (state) => {
      return state.set('inserting', true);
    },
    [types.insert.success]: (state, { payload }) => {
      return state.setIn(['items', payload[id]], payload).set('inserting', false)
    },
    [types.insert.failure]: (state) => {
      return state.set('inserting', false)
    },
    [types.insertAll.tap]: (state) => {
      return state.set('inserting', true);
    },
    [types.insertAll.success]: (state, { payload }) => {
      return state.update('items', (items) => items.merge(payload)).set('inserting', false)
    },
    [types.insertAll.failure]: (state) => {
      return state.set('inserting', false)
    },
    [types.delete.tap]: (state) => {
      return state.set('deleting', true);
    },
    [types.delete.success]: (state, { payload }) => {
      return state.update('items', (items) => items.without(payload[id])).set('deleting', false)
    },
    [types.delete.failure]: (state, { payload }) => {
      return state.set('deleting', false)
    },
    [types.deleteAll.tap]: (state) => {
      return state.set('deleting', true);
    },
    [types.deleteAll.success]: (state, { payload }) => {
      const ids = payload.ids;
      if (!ids || ids.length === 0) {
        return state;
      }
      return state.update('items', (items) => items.without(ids)).set('deleting', false)
    },
    [types.deleteAll.failure]: (state, { payload }) => {
      return state.set('deleting', false)
    },
  };

  const reducer = (state = initialState, action) => {
    if (!action) {
      return state
    }

    if (!action.type) {
      return state
    }

    const handler = handlers[action.type]

    if (!handler) {
      return state
    }

    return handler(state, action)
  }

  return reducer
}

const buildReducerPlain = (types, id) => {
  const initialState = {
    items: {},
    inserting: false,
    deleting: false,
    loading: false,
    updating: false,
  };

  const handlers = {
    [types.load.tap]: (state, { payload }) => {
      return {
        ...state,
        loading: true
      }
    },
    [types.load.success]: (state, { payload }) => {
      return {
        ...state,
        items: payload,
        loading: false,
      }
    },
    [types.load.failure]: (state) => {
      return {
        ...state,
        loading: false
      }
    },
    [types.update.tap]: (state) => {
      return {
        ...state,
        updating: true
      }
    },
    [types.update.success]: (state, { payload }) => {
      return {
        ...state,
        items: {
          ...state.items,
          [payload[id]]: {
            ...state.items[payload[id]],
            ...payload,
          }
        },
        updating: false
      }
    },
    [types.update.failure]: (state, { payload }) => {
      return {
        ...state,
        updating: false
      }
    },
    [types.updateAll.tap]: (state) => {
      return {
        ...state,
        updating: true
      }
    },
    [types.updateAll.success]: (state, { payload }) => {
      return {
        ...state,
        items: {
          ...state.items,
          ...payload,
        },
        updating: false
      }
    },
    [types.updateAll.failure]: (state, { payload }) => {
      return {
        ...state,
        updating: false
      }
    },
    [types.insert.tap]: (state) => {
      return {
        ...state,
        inserting: true
      }
    },
    [types.insert.success]: (state, { payload }) => {
      return {
        ...state,
        items: {
          ...state.items,
          [payload[id]]: payload,
        },
        inserting: false
      }
    },
    [types.insert.failure]: (state) => {
      return {
        ...state,
        inserting: false
      }
    },
    [types.insertAll.tap]: (state) => {
      return {
        ...state,
        inserting: true
      }
    },
    [types.insertAll.success]: (state, { payload }) => {
      return {
        ...state,
        items: {
          ...state.items,
          ...payload,
        },
        inserting: false
      }
    },
    [types.insertAll.failure]: (state) => {
      return {
        ...state,
        inserting: false
      }
    },
    [types.delete.tap]: (state) => {
      return {
        ...state,
        deleting: true
      }
    },
    [types.delete.success]: (state, { payload }) => {
      return {
        ...omit(state, payload[id]),
        deleting: false
      }
    },
    [types.delete.failure]: (state, { payload }) => {
      return {
        ...state,
        deleting: false
      }
    },
    [types.deleteAll.tap]: (state) => {
      return {
        ...state,
        deleting: true
      }
    },
    [types.deleteAll.success]: (state, { payload }) => {
      const ids = payload.ids;
      if (!ids || ids.length === 0) {
        return {
          ...state,
          deleting: false,
        };
      }
      return {
        ...omit(state, ids),
        deleting: false
      }
    },
    [types.deleteAll.failure]: (state, { payload }) => {
      return {
        ...state,
        deleting: false
      }
    },
  };

  const reducer = (state = initialState, action) => {
    if (!action) {
      return state
    }

    if (!action.type) {
      return state
    }

    const handler = handlers[action.type]

    if (!handler) {
      return state
    }

    return handler(state, action)
  }

  return reducer
}

export const buildReducer = (types, id, params) => {
  if (params && params.immutable) {
    return buildReducerImmutable(types, id)
  }
  return buildReducerPlain(types, id)
}

export const prepareData = (id, data) => {
  return data.reduce((acc, n) => ({
    ...acc,
    [n[id]]: {
      ...n,
      id: n[id],
    }
  }), {})
}

