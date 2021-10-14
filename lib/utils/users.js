import userType from './user-type';

export const transform = (user) => ({
  ...user,
  type: userType(user, true),
  fullName: `${user.first_name} ${user.last_name}`
})
