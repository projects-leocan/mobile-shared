import constants from '../../src/constants'
import { assert } from 'chai'
import { get } from 'lodash/object'

export function assertActionType(action, assertion) {
  return assert.equal(get(constants, assertion), action.type)
}
