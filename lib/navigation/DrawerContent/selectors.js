import { createSelector } from 'reselect';
import { userSelector, authConfigSelector } from 'rc-mobile-base/lib/selectors/auth';

export const drawerDisabledSelector = createSelector(
  [userSelector, authConfigSelector],
  (user, config) => {
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
      isDisableMaintenanceExperience
    } = config;

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
    } else if (isInspector) {
      if (isDisableInspectorTurndown) { disabled.push('Turndown') }
      if (isDisableInspectorExperience) { disabled.push('Glitches') }
    }

    return disabled;
  }
)
