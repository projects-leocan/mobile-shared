import { fork, all } from 'redux-saga/effects';

export const forkWatchers = (watchers) => function * () {
  yield all(Object.values(watchers).map(fork));
  // yield all(Object.values(watchers));
}
