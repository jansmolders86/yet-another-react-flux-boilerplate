import alt from '../core/alt';

/**
 * user profile actions
 */
class UserActions {
  constructor() {
    this.generateActions(
      'login',
      'logout',
      'isLoggedIn',
      'fetchUsers',
      'register',
      'userSuccess',
      'userError',
      'userUpdateSuccess',
      'userUpdateError',
      'updateUser',
      'usersSuccess',
      'usersError',
      'logoutSuccess',
      'logoutError'
    );
  }
}

export default alt.createActions(UserActions);
