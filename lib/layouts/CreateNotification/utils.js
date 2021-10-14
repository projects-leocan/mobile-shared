import { find } from 'lodash/collection';

export const buildNotifications = (values, users) => {
  const { user, locations: selectedLocations, message, photo } = values;
  const selectedValue = user.value;
  const isAnySelectedGroups = user.isGroup

  let notifications = [];
  let locations = selectedLocations;

  const photoProps = photo ? photo.predefined ? {
    photoUrl: photo.path,
    photoId: null
  } : {
    photoUrl: null,
    photoId: photo.id,
    photoPath: photo.path
  } : {}

  if (!locations && selectedValue !== 'planned') {
    locations = [null]
  }

  if (selectedValue === 'planned') {
    notifications = locations.filter(room => !!room.plannedUser)
      .map(room => ({ message, ...photoProps, room, user: room.plannedUser }));
  } else if (selectedValue === 'maintenance') {
    locations.map(room => {
      users.forEach(user => {
        if (!user.isMaintenance) {
          return;
        }
        notifications.push({ message, ...photoProps, room, user });
      })
    })
  } else if (selectedValue === 'runners') {
    locations.map(room => {
      users.forEach(user => {
        if (!user.isRoomRunner) {
          return;
        }
        notifications.push({ message, ...photoProps, room, user });
      });
    });
  } else if (selectedValue === 'inspectors') {
    locations.map(room => {
      users.forEach(user => {
        if (!user.isInspector) {
          return;
        }
        notifications.push({ message, ...photoProps, room, user });
      });
    });
  } else if (isAnySelectedGroups) {
    user.users.forEach(userId => {
      const user = find(users, { _id: userId });
      locations.map(room => {
        notifications.push({ message, ...photoProps, room, user });
      });
    });
  } else {
    locations.map(room => {
      notifications.push({ message, ...photoProps, room, user });
    });
  }

  return notifications
}
