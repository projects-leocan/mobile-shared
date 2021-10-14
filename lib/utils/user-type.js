export default function(user, isExplicit = false) {
  if (!user) {
    return '';
  }
  if (user.isAdministrator) {
    return 'management';
  }
  if (user.isReceptionist) {
    return 'front-office';
  }
  if (user.isInspector) {
    if (isExplicit) {
      return 'inspector';
    }
    return 'housekeeping';
  }
  if (user.isMaintenance) {
    return 'maintenance';
  }
  if (user.isAttendant) {
    if (isExplicit) {
      return 'attendant';
    }
    return 'housekeeping';
  }
  if (user.isRoomRunner) {
    if (isExplicit) {
      return 'runner';
    }
    return 'front-office';
  }
}
