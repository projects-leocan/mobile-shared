import { createTransform } from 'redux-persist'
// import { initial } from './reducer';

// const { meta } = initial;

const stateCleaner = (state) => {
  const { queue, meta, outbox } = state;
  return {
    outbox: outbox,
    queue: queue,
    meta: {
      ...meta,
      isRunning: false,
      currentRunning: false,
      currentAttempt: false,
    }
  };
}
export const offlineTransform = createTransform(
  //inbound
  stateCleaner,
  //outbound
  (state) => state,
  {
    whitelist: ['offline']
  }
)
