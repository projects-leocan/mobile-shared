import { isEqual, isEmpty } from 'lodash/lang';
import R from 'ramda';

const eqTs = R.eqProps('ts')
const eqName = R.eqProps('saga')
const eqArgs = R.eqProps('args')
const tsBasedComparator = R.both(eqTs, eqName)
const argsBasedComparator = R.both(eqArgs, eqName)

export const _enqueue = (comparator) => (x, y) => R.unionWith(comparator, x, [y]);
export const _dequeue = (comparator) => (x, y) => R.differenceWith(comparator, x, [y]);

export const enqueueByTs = _enqueue(tsBasedComparator)
export const dequeueByTs = _dequeue(tsBasedComparator)

export const enqueueByArgs = _enqueue(argsBasedComparator)
export const dequeueByArgs = _dequeue(argsBasedComparator)

export const enqueue = enqueueByArgs
export const dequeue = dequeueByArgs

export const ts = () => (new Date()).getTime()
