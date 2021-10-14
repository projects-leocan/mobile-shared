import Immutable from 'seamless-immutable';
import { createSelector } from 'reselect';

import { transform } from '../utils/users';

const authSelector = state => state.auth;

export const tokenSelector = createSelector(
  [authSelector],
  (auth) => auth.token
);

export const apiSelector = createSelector(
  [authSelector],
  (auth) => auth.api
);

export const hotelIdSelector = createSelector(
  [authSelector],
  (auth) => auth.hotelId
);

export const userIdSelector = createSelector(
  [authSelector],
  (auth) => auth.userId
);

export const userSelector = createSelector(
  [authSelector],
  (auth) => transform(auth.user)
);

export const userFullNameSelector = createSelector(
  [userSelector],
  (user) => user ? `${user.first_name} ${user.last_name}` : null
);

export const userImageSelector = createSelector(
  [userSelector],
  (user) => user ? user.image : null
);

export const userIsOnDutySelector = createSelector(
  [userSelector],
  (user) => user ? user.isOnDuty : null
);

export const userInfoSelector = createSelector(
  [userFullNameSelector, userImageSelector, userIsOnDutySelector],
  (fullName, image, isOnDuty) => fullName ? ({ fullName, image, isOnDuty }) : null
);

export const hotelSelector = createSelector(
  [authSelector],
  (auth) => auth.hotel
);

export const hotelNameSelector = createSelector(
  [hotelSelector],
  (hotel) => hotel ? hotel.name : null
);

export const isAuthenticated = createSelector(
  [hotelIdSelector, userIdSelector],
  (hotelId, userId) => hotelId && userId ? true : false
)

export const authConfigSelector = createSelector(
  [authSelector],
  (auth) => auth.config
)
