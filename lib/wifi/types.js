const buildType = (action) => `WIFI/${action}`

export default {
  POWER: buildType('POWER/TAP'),
  POWER_SUCCESS: buildType('POWER/SUCCESS'),
  POWER_FAILURE: buildType('POWER/FAILURE'),
  NOT_SUPPORTED: buildType('NOT_SUPPORTED'),

  TOGGLE_POWER: buildType('POWER/TOGGLE'),
  TOGGLE_POWER_RUNNING: buildType('POWER/TOGGLE_RUNNING'),
  TOGGLE_POWER_FINISHED: buildType('POWER/TOGGLE_FINISHED'),
}
