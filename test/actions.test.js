import actions from '../src/actions'
import { assertActionType } from './helpers/assert-action-type'

describe('Actions', () => {
  describe('Assets', () => {
    it('resetAssets', function () {
      assertActionType(actions.resetAssets(), 'ASSETS_RESET')
    })
  })
})
