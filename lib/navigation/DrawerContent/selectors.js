import { createSelector } from 'reselect';
import { userSelector, authConfigSelector, hotelSelector } from 'rc-mobile-base/lib/selectors/auth';
import { get } from 'lodash';

export const drawerDisabledSelector = createSelector(
  [userSelector, authConfigSelector, hotelSelector],
  (user, config, hotel) => {
    const { isAttendant, isMaintenance, isRoomRunner, isInspector } = user;
    const {
      isDisableInspectorTurndown,
      isDisableInspectorExperience,
      isDisableAttendantTurndown,
      isEnableAttendantAudits,
      isEnableAttendantPlannings,
      isDisableAttendantExperience,
      isDisableRunnerTurndown,
      isDisableRunnerExperience,
      isDisableRunnerAudits,
      isDisableMaintenanceExperience,
      isEnableInspectorConcierge,
      isDisableInspectorPlanning
    } = config;
    const isEnableCiCo = get(hotel, 'modules.isEnableCiCo', false);

    const disabled = [];
    
    if (isAttendant) {
      if (isDisableAttendantTurndown) { disabled.push('Turndown') }
      if (!isEnableAttendantAudits) { disabled.push('Audits') }
      if (!isEnableAttendantPlannings) { disabled.push('Plannings') }
      // if (isDisableAttendantExperience) { disabled.push('Glitch') }
    } else if (isMaintenance) {
      if (isDisableMaintenanceExperience) { disabled.push('Glitches') }
    } else if (isRoomRunner) {
      if (isDisableRunnerTurndown) { disabled.push('Turndown') }
      if (isDisableRunnerExperience) { disabled.push('Glitches') }
      if (isDisableRunnerAudits) { disabled.push('Audits') }
      if (!isEnableCiCo) { disabled.push('CheckInOut') }
    } else if (isInspector) {
      if (isDisableInspectorTurndown) { disabled.push('Turndown') }
      if (isDisableInspectorExperience) { disabled.push('Glitches') }
      if (!isEnableInspectorConcierge) { disabled.push('Concierge') }
      if (isDisableInspectorPlanning) { disabled.push('Planning') }
    }

    return disabled;
  }
)
