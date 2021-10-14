import UsersTypes from '../constants/users';

export function usersFetch() {
  return {
    type: UsersTypes.USERS_FETCH
  }
}

export function usersSuccess({ users }) {
  return {
    type: UsersTypes.USERS_SUCCESS,
    users
  }
}

export function usersFailure(error) {
  return {
    type: UsersTypes.USERS_FAILURE,
    error
  }
}

export function groupsFetch() {
  return {
    type: UsersTypes.GROUPS_FETCH
  }
}

export function groupsSuccess({ groups }) {
  return {
    type: UsersTypes.GROUPS_SUCCESS,
    groups
  }
}

export function groupsFailure(error) {
  return {
    type: UsersTypes.GROUPS_FAILURE,
    error
  }
}

export function updateUsersIncrement() {
  return {
    type: UsersTypes.UPDATE_USERS_INCREMENT,
    meta: {
      debounce: {
        time: 1000
      }  
    }
  }
}

export default {
  usersFetch,
  usersSuccess,
  usersFailure,
  groupsFetch,
  groupsSuccess,
  groupsFailure,
  updateUsersIncrement
}
