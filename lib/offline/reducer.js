// import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import moment from 'moment';

import { enqueue, dequeue } from './helpers';
import Types from './constants';

export default function({ attempts, delay }) {
  const getInitialState = () => ({
    queue: [],
    meta: {
      attempts: false,
      delay: false,
      isRunning: false,
      currentRunning: false,
      currentAttempt: false
    }
  })
  // const INITIAL_STATE = Immutable(initial);

  const ACTION_HANDLERS = {
    [Types.ENQUEUE]: (state, { saga, args, ts }) => {
      // return state.update('queue', enqueue, { saga, args, ts })
      return {
        ...state,
        queue: enqueue(state.queue, { saga, args, ts })
      }
    },
    [Types.DEQUEUE]: (state, { saga, ts, args }) => {
      // return state.update('queue', dequeue, { saga, ts, args })
      return {
        ...state,
        queue: dequeue(state.queue, { saga, args, ts }),
        meta: {
          ...state.meta,
          attempts: false,
          currentAttempt: false,
        }
      }
    },
    [Types.START]: (state) => {
      // return state.setIn(['meta', 'isRunning'], true)
      //   .setIn(['meta', 'attempts'], attempts)
      //   .setIn(['meta', 'delay'], delay)
      //   .setIn(['meta', 'currentAttempt'], false)
      //   .setIn(['meta', 'currentRunning'], false)
      return {
        ...state,
        meta: {
          ...state.meta,
          isRunning: true,
          attempts,
          delay,
          currentAttempt: false,
          currentRunning: false
        }
      }
    },
    [Types.STOP]: (state) => {
      // return state.setIn(['meta', 'isRunning'], false)
      //   .setIn(['meta', 'currentAttempt'], false)
      //   .setIn(['meta', 'currentRunning'], false)

      return {
        ...state,
        meta: {
          ...state.meta,
          isRunning: false,
          currentAttempt: false,
          currentRunning: false
        }
      }
    },
    [Types.NEXT_ATTEMPT]: (state, { currentAttempt }) => {
      // return state.setIn(['meta', 'currentAttempt'], currentAttempt)
      return {
        ...state,
        meta: {
          ...state.meta,
          currentAttempt
        }
      }
    },
    [Types.CURRENT_RUNNING]: (state, { currentRunning }) => {
      // return state.setIn(['meta', 'currentRunning'], currentRunning)
      return {
        ...state,
        meta: {
          ...state.meta,
          currentRunning
        }
      }
    },
    [Types.CLEAR]: (state) => {
      // return state.set('queue', [])
      //   .setIn(['meta', 'isRunning'], false)
      //   .setIn(['meta', 'currentAttempt'], false)
      //   .setIn(['meta', 'currentRunning'], false)
      return {
        ...state,
        queue: [],
        meta: {
          ...state.meta,
          isRunning: false,
          currentAttempt: false,
          currentRunning: false
        }
      }
    },
    [Types.CLEAR_FOR_TODAY]: (state) => {
      const cleared = state.queue.filter(item => {
        return !moment.unix(item.ts).isBefore(moment(), 'day')
      })
      return {
        ...state,
        queue: cleared,
        meta: {
          ...state.meta,
          isRunning: false,
          currentAttempt: false,
          currentRunning: false
        }
      }
    },
  }

  return createReducer(getInitialState(), ACTION_HANDLERS);
}
